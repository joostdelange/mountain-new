import { randomInt } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { safeParse } from 'valibot';
import { SendEmailCommand } from '@aws-sdk/client-sesv2';
import { QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { dynamodbDocumentClient } from '@mountain-cms/helpers/dynamodb';
import { LoginSchema } from '@mountain-cms/schemas';
import { sesv2Client } from '@mountain-cms/helpers/ses';
import { loginRequestEmail } from '@mountain-cms/templates/email';
import { mjmlHttp } from '@mountain-cms/helpers/mjml';

export const loginRepository = {
  async getLoginRecord(code: string) {
    const getLoginItemCommand = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      FilterExpression: 'code = :code AND #status = :status',
      ExpressionAttributeValues: {
        ':pk': 'login',
        ':code': code,
        ':status': 'requested',
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    });
    const getLoginItemResponse = await dynamodbDocumentClient.send(getLoginItemCommand);

    return safeParse(LoginSchema, getLoginItemResponse.Items?.[0]);
  },
  async createLoginRecord(userId: string) {
    const code = randomInt(999999).toString().padStart(6, '0');

    const loginPayload = safeParse(LoginSchema, {
      PK: 'login',
      SK: uuidv4(),
      userId,
      code,
      status: 'requested',
      createdAt: DateTime.now().toSeconds(),
    });

    if (!loginPayload.success) return false;

    const createLoginCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'login',
        SK: uuidv4(),
      },
      UpdateExpression: 'SET userId = :userId, code = :code, #status = :status, createdAt = :createdAt',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':code': code,
        ':status': 'requested',
        ':createdAt': DateTime.now().toSeconds(),
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const createLoginResponse = await dynamodbDocumentClient.send(createLoginCommand);
    return safeParse(LoginSchema, createLoginResponse.Attributes);
  },
  async updateLoginRecord(loginId: string) {
    const updateLoginItemCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'login',
        SK: loginId,
      },
      UpdateExpression: 'SET #status = :status',
      ExpressionAttributeValues: {
        ':status': 'completed'
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    });

    await dynamodbDocumentClient.send(updateLoginItemCommand);
  },
  async sendLoginRequestEmail(code: string, firstName: string, email: string) {
    const loginRequestTemplate = await loginRequestEmail(
      mjmlHttp(process.env.MJML_APPLICATION_ID!, process.env.MJML_SECRET_KEY!),
      {
        domain: process.env.DOMAIN!,
        code,
        firstName,
      },
      `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
    );

    const sendEmailCommand = new SendEmailCommand({
      FromEmailAddress: process.env.FROM_EMAIL,
      Destination: {
        ToAddresses: [email],
      },
      Content: {
        Simple: {
          Subject: {
            Data: loginRequestTemplate.subject,
          },
          Body: {
            Html: {
              Data: loginRequestTemplate.html,
            },
          },
        },
      },
    });

    await sesv2Client.send(sendEmailCommand);
  },
};
