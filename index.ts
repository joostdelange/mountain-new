import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

const project = pulumi.getProject();
const stack = pulumi.getStack();

const config = new pulumi.Config();

const table = new aws.dynamodb.Table(`${stack}-${project}-table`, {
  billingMode: 'PAY_PER_REQUEST',
  pointInTimeRecovery: { enabled: true },
  hashKey: 'PK',
  rangeKey: 'SK',
  attributes: [
    { name: 'PK', type: 'S' },
    { name: 'SK', type: 'S' },
  ],
});

const assetsBucket = new aws.s3.Bucket(`${stack}-${project}-assets-bucket`, {
  versioning: { enabled: true },
});

new aws.s3.BucketPublicAccessBlock(`${stack}-${project}-assets-bucket-public-access-block`, {
  bucket: assetsBucket.id,
});

new aws.s3.BucketOwnershipControls(`${stack}-${project}-assets-bucket-ownership-controls`, {
  bucket: assetsBucket.id,
  rule: {
    objectOwnership: 'BucketOwnerPreferred',
  },
});

const handlerRole = new aws.iam.Role(`${stack}-${project}-handler-role`, {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [{
      Action: 'sts:AssumeRole',
      Effect: 'Allow',
      Principal: {
        Service: 'lambda.amazonaws.com',
      },
    }],
  },
});

new aws.iam.RolePolicyAttachment(`${stack}-${project}-handler-role-policy-attachment-lambda`, {
  role: handlerRole,
  policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});

new aws.iam.RolePolicyAttachment(`${stack}-${project}-handler-role-policy-attachment-dynamodb`, {
  role: handlerRole,
  policyArn: aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
});

new aws.iam.RolePolicyAttachment(`${stack}-${project}-handler-role-policy-attachment-s3`, {
  role: handlerRole,
  policyArn: aws.iam.ManagedPolicies.AmazonS3FullAccess,
});

new aws.iam.RolePolicyAttachment(`${stack}-${project}-handler-role-policy-attachment-ses`, {
  role: handlerRole,
  policyArn: aws.iam.ManagedPolicies.AmazonSESFullAccess,
});

const handler = new aws.lambda.Function(`${stack}-${project}-handler`, {
  role: handlerRole.arn,
  code: new pulumi.asset.FileArchive('./packages/backend/handlers/dist'),
  handler: 'api.handler',
  runtime: aws.lambda.Runtime.NodeJS20dX,
  timeout: 6,
  environment: {
    variables: {
      TABLE_NAME: table.name,
      BUCKET_NAME: assetsBucket.bucketRegionalDomainName,
      MJML_APPLICATION_ID: config.get('MJML_APPLICATION_ID') || '',
      MJML_SECRET_KEY: config.getSecret('MJML_SECRET_KEY') || '',
      DOMAIN: config.getSecret('DOMAIN') || '',
      FROM_EMAIL: config.getSecret('FROM_EMAIL') || '',
      JWT_SECRET: config.getSecret('JWT_SECRET') || '',
      NODE_OPTIONS: '--enable-source-maps',
    },
  },
});

const api = new aws.apigatewayv2.Api(`${stack}-${project}-api`, {
  protocolType: 'HTTP',
  corsConfiguration: {
    allowOrigins: ['*'],
    allowMethods: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*'],
  },
});

new aws.lambda.Permission(`${stack}-${project}-handler-permission`, {
  action: 'lambda:InvokeFunction',
  principal: 'apigateway.amazonaws.com',
  function: handler,
  sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
}, { dependsOn: [api, handler] });

const handlerIntegration = new aws.apigatewayv2.Integration(`${stack}-${project}-handler-integration`, {
  apiId: api.id,
  integrationType: 'AWS_PROXY',
  integrationUri: handler.arn,
  integrationMethod: 'POST',
  payloadFormatVersion: '2.0',
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-auth-code-request-route`, {
  apiId: api.id,
  routeKey: 'GET /auth/code/request',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-auth-code-complete-route`, {
  apiId: api.id,
  routeKey: 'GET /auth/code/complete',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-auth-code-switch-site-route`, {
  apiId: api.id,
  routeKey: 'GET /auth/code/switch-site',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-me-route`, {
  apiId: api.id,
  routeKey: 'GET /me',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-put-me-route`, {
  apiId: api.id,
  routeKey: 'PUT /me',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-blocks-route`, {
  apiId: api.id,
  routeKey: 'GET /blocks',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-post-blocks-route`, {
  apiId: api.id,
  routeKey: 'POST /blocks',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-blocks-id-route`, {
  apiId: api.id,
  routeKey: 'GET /blocks/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-put-blocks-id-route`, {
  apiId: api.id,
  routeKey: 'PUT /blocks/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-delete-blocks-id-route`, {
  apiId: api.id,
  routeKey: 'DELETE /blocks/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-pages-route`, {
  apiId: api.id,
  routeKey: 'GET /pages',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-post-pages-route`, {
  apiId: api.id,
  routeKey: 'POST /pages',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-get-pages-id--route`, {
  apiId: api.id,
  routeKey: 'GET /pages/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-put-pages-id-route`, {
  apiId: api.id,
  routeKey: 'PUT /pages/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-put-pages-id-publish-route`, {
  apiId: api.id,
  routeKey: 'PUT /pages/{id}/publish',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-put-pages-id-revert-route`, {
  apiId: api.id,
  routeKey: 'PUT /pages/{id}/revert',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

new aws.apigatewayv2.Route(`${stack}-${project}-delete-pages-id-route`, {
  apiId: api.id,
  routeKey: 'DELETE /pages/{id}',
  target: pulumi.interpolate`integrations/${handlerIntegration.id}`,
});

const stage = new aws.apigatewayv2.Stage(`${stack}-${project}-stage`, {
  apiId: api.id,
  name: stack,
  autoDeploy: true,
});

export const apiUrl = stage.invokeUrl;
export const bucket = assetsBucket.bucket;
