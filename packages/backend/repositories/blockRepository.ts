import { safeParse } from 'valibot';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { dynamodbDocumentClient } from '@mountain-cms/helpers/dynamodb';
import { GetBlocksOutput, GetBlockOutput } from '@mountain-cms/schemas';
import { CreateBlockInput, CreateBlockOutput, UpdateBlockInput, UpdateBlockOutput } from '@mountain-cms/schemas';

export const blockRepository = {
  async getBlocks(siteId: string) {
    const getBlocksCommand = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      FilterExpression: 'siteId = :siteId OR attribute_not_exists(siteId)',
      ExpressionAttributeValues: {
        ':pk': 'block',
        ':siteId': siteId,
      },
    });

    const getBlocksResponse = await dynamodbDocumentClient.send(getBlocksCommand);

    return safeParse(GetBlocksOutput, getBlocksResponse.Items);
  },
  async createBlock(payload: CreateBlockInput, siteId: string) {
    const createBlockCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'block',
        SK: uuidv4(),
      },
      UpdateExpression: 'SET siteId = :siteId, #name = :name, label = :label, description = :description, #fields = :fields, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':siteId': siteId,
        ':name': payload.label.toLowerCase().replace(/ /g, '_'),
        ':label': payload.label,
        ':description': payload.description,
        ':fields': payload.fields.map((field) => ({
          ...field,
          name: field.label.toLowerCase().replace(/ /g, '_'),
        })),
        ':updatedAt': DateTime.now().toSeconds(),
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#fields': 'fields',
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const createBlockResponse = await dynamodbDocumentClient.send(createBlockCommand);

    return safeParse(CreateBlockOutput, createBlockResponse.Attributes);
  },
  async getBlockByBlockId(blockId: string, siteId: string) {
    const getBlockCommand = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      FilterExpression: 'siteId = :siteId OR attribute_not_exists(siteId)',
      ExpressionAttributeValues: {
        ':pk': 'block',
        ':sk': blockId,
        ':siteId': siteId,
      },
    });

    const getBlockResponse = await dynamodbDocumentClient.send(getBlockCommand);

    return safeParse(GetBlockOutput, getBlockResponse.Items?.[0]);
  },
  async updateBlock(payload: UpdateBlockInput) {
    const updateBlockCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'block',
        SK: payload.SK,
      },
      UpdateExpression: 'SET #name = :name, label = :label, description = :description, #fields = :fields, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':name': payload.label.toLowerCase().replace(/ /g, '_'),
        ':label': payload.label,
        ':description': payload.description,
        ':fields': payload.fields.map((field) => ({
          ...field,
          name: field.label.toLowerCase().replace(/ /g, '_'),
        })),
        ':updatedAt': DateTime.now().toSeconds(),
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#fields': 'fields',
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const updateBlockResponse = await dynamodbDocumentClient.send(updateBlockCommand);

    return safeParse(UpdateBlockOutput, updateBlockResponse.Attributes);
  },
  async deleteBlock(blockId: string, siteId: string) {
    const deleteBlockCommand = new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'block',
        SK: blockId,
      },
      ConditionExpression: 'siteId = :siteId',
      ExpressionAttributeValues: {
        ':siteId': siteId,
      },
    });

    await dynamodbDocumentClient.send(deleteBlockCommand);
  },
};













