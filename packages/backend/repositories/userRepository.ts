import { safeParse } from 'valibot';
import { GetCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { dynamodbDocumentClient } from '@mountain-cms/helpers/dynamodb';
import { GetUserOutput, UpdateUserInput, UpdateUserOutput } from '@mountain-cms/schemas';

export const userRepository = {
  async getUserByUserId(userId: string) {
    const getUserCommand = new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'user',
        SK: userId,
      },
    });
    const getUserResponse = await dynamodbDocumentClient.send(getUserCommand);

    return safeParse(GetUserOutput, getUserResponse.Item);
  },
  async getUserByEmail(email: string) {
    const getUserCommand = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':pk': 'user',
        ':email': email,
      },
    });
    const getUserResponse = await dynamodbDocumentClient.send(getUserCommand);

    return safeParse(GetUserOutput, getUserResponse.Items?.[0]);
  },
  async updateUser(payload: UpdateUserInput) {
    const updateUserCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'user',
        SK: payload.SK,
      },
      UpdateExpression: 'SET email = :email, firstName = :firstName, lastName = :lastName, siteIds = :siteIds',
      ExpressionAttributeValues: {
        ':email': payload.email,
        ':firstName': payload.firstName,
        ':lastName': payload.lastName,
        ':siteIds': payload.siteIds,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const updateUserResponse = await dynamodbDocumentClient.send(updateUserCommand);
    return safeParse(UpdateUserOutput, updateUserResponse.Attributes);
  },
};
