import { safeParse, array } from 'valibot';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamodbDocumentClient } from '@mountain-cms/helpers/dynamodb';
import { User, SiteSchema } from '@mountain-cms/schemas';

export const siteRepository = {
  async getSitesByUser(user: User) {
    const getSitesQuery = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': 'site' },
    });

    const getSitesResponse = await dynamodbDocumentClient.send(getSitesQuery);

    return safeParse(array(SiteSchema), user.role === 'user'
      ? getSitesResponse.Items?.filter((site) => user.siteIds?.includes(site.SK)) || []
      : getSitesResponse.Items || []);
  },
};