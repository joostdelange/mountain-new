import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const dynamodbClient = new DynamoDBClient({});
export const dynamodbDocumentClient = DynamoDBDocumentClient.from(dynamodbClient);

export const getUserByEmail = async (tableName: string, email: string) => {
  const getUserByEmailCommand = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk',
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':pk': 'user',
      ':email': email,
    },
  });

  const getUserByEmailResponse = await dynamodbDocumentClient.send(getUserByEmailCommand);
  const [user] = getUserByEmailResponse.Items || [];

  return user;
}