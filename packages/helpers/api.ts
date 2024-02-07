import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

export const response = (
  statusCode: number,
  body: object | string,
  options?: APIGatewayProxyStructuredResultV2
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  body: typeof body === 'object' ? JSON.stringify(body) : body,
  headers: options?.headers,
  ...(options || {}),
});
