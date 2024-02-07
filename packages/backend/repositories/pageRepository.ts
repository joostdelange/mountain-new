import { safeParse, array } from 'valibot';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { QueryCommand, UpdateCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { dynamodbDocumentClient } from '@mountain-cms/helpers/dynamodb';
import { GetPagesOutput, GetPageOutput } from '@mountain-cms/schemas';
import { CreatePageInput, CreatePageOutput, UpdatePageInput, UpdatePageOutput, PageBlockSchema } from '@mountain-cms/schemas';
import { blockRepository } from './blockRepository';

export const pageRepository = {
  async getPagesBySiteId(siteId: string, version: string) {
    const getPagesQuery = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': 'page',
        ':sk': `site#${siteId}#page#${version}`,
      },
    });

    const getPagesResponse = await dynamodbDocumentClient.send(getPagesQuery);

    return safeParse(GetPagesOutput, getPagesResponse.Items);
  },
  async getPageByPageId(pageId: string, siteId: string, version: string) {
    const getPageQuery = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': 'page',
        ':sk': `site#${siteId}#page#${version}#${pageId}`,
      },
    });

    const [getPageResponse, pageBlocks] = await Promise.all([
      dynamodbDocumentClient.send(getPageQuery),
      this.getPageBlocksByPageId(pageId, siteId, version),
    ]);
    if (!pageBlocks || !pageBlocks.success) return false;

    const page = safeParse(GetPageOutput, {
      ...getPageResponse.Items?.[0],
      blocks: pageBlocks.output.toSorted((a, b) => a.position - b.position),
    });

    return page;
  },
  async getPageBlocksByPageId(pageId: string, siteId: string, version: string) {
    const getPageBlocksQuery = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :pageId)',
      ExpressionAttributeValues: {
        ':pk': 'pageBlock',
        ':pageId': `page#${version}#${pageId}`,
      },
    });
    const [blocks, getPageBlocksResponse] = await Promise.all([
      blockRepository.getBlocks(siteId),
      dynamodbDocumentClient.send(getPageBlocksQuery),
    ]);
    if (!blocks.success) return false;

    return safeParse(
      array(PageBlockSchema),
      (getPageBlocksResponse.Items || [])
        .toSorted((a, b) => a.position - b.position)
        .map((pageBlock) => ({
          ...pageBlock,
          block: blocks.output.find((block) => block.SK === pageBlock.blockId),
        })),
    );
  },
  async createPage(payload: CreatePageInput, siteId: string, version: string) {
    const pageId = uuidv4();

    const createPageCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'page',
        SK: `site#${siteId}#page#${version}#${pageId}`,
      },
      UpdateExpression: 'SET pageId = :pageId, link = :link, title = :title, metaDescription = :metaDescription, updatedAt = :updatedAt, divertedFromPublished = :divertedFromPublished',
      ExpressionAttributeValues: {
        ':pageId': pageId,
        ':link': payload.link,
        ':title': payload.title,
        ':metaDescription': payload.metaDescription || '',
        ':updatedAt': DateTime.now().toSeconds(),
        ':divertedFromPublished': true,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const createPageResponse = await dynamodbDocumentClient.send(createPageCommand);
    return safeParse(CreatePageOutput, { ...createPageResponse.Attributes, blocks: [] });
  },
  async updatePage(payload: UpdatePageInput, siteId: string, version: string, divertedFromPublished: boolean = true) {
    const updatePageCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: 'page',
        SK: `site#${siteId}#page#${version}#${payload.pageId}`,
      },
      UpdateExpression: 'SET pageId = :pageId, link = :link, title = :title, metaDescription = :metaDescription, updatedAt = :updatedAt, divertedFromPublished = :divertedFromPublished',
      ExpressionAttributeValues: {
        ':pageId': payload.pageId,
        ':link': payload.link,
        ':title': payload.title,
        ':metaDescription': payload.metaDescription || '',
        ':updatedAt': DateTime.now().toSeconds(),
        ':divertedFromPublished': divertedFromPublished,
      },
      ReturnValues: ReturnValue.ALL_NEW,
    });

    const [updatePageResponse, pageBlocks] = await Promise.all([
      dynamodbDocumentClient.send(updatePageCommand),
      this.getPageBlocksByPageId(payload.pageId, siteId, version),
    ]);
    if (!pageBlocks || !pageBlocks.success) return false;

    const updatePageBlocksCommand = new BatchWriteCommand({
      RequestItems: {
        [process.env.TABLE_NAME!]: [
          ...payload.blocks
            .map((block) => {
              const newPageBlockId = uuidv4();

              return {
                PutRequest: {
                  Item: {
                    PK: 'pageBlock',
                    SK: `page#${version}#${payload.pageId}#pageBlock#${block.pageBlockId || newPageBlockId}`,
                    pageBlockId: block.pageBlockId || newPageBlockId,
                    blockId: block.blockId,
                    position: block.position,
                  },
                },
              };
            }),
          ...pageBlocks.output
            .filter((block) => !payload.blocks
              .some((payloadBlock) => `page#${version}#${payload.pageId}#pageBlock#${payloadBlock.pageBlockId}` === block.SK))
            .map((block) => ({
              DeleteRequest: {
                Key: {
                  PK: 'pageBlock',
                  SK: block.SK,
                },
              },
            })),
        ],
      },
    });

    if (pageBlocks.output.length || payload.blocks.length) {
      await dynamodbDocumentClient.send(updatePageBlocksCommand);
    }

    const updatedPageBlocks = await this.getPageBlocksByPageId(payload.pageId, siteId, version);
    if (!updatedPageBlocks || !updatedPageBlocks.success) return false;

    return safeParse(UpdatePageOutput, {
      ...updatePageResponse.Attributes,
      blocks: updatedPageBlocks.output.toSorted((a, b) => a.position - b.position),
    });
  },
  async deletePage(pageId: string, siteId: string, version: string) {
    const getPageBlocksQuery = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :pageId)',
      ExpressionAttributeValues: {
        ':pk': 'pageBlock',
        ':pageId': `page#${version}#${pageId}`,
      },
    });
    const getPageBlocksResponse = await dynamodbDocumentClient.send(getPageBlocksQuery);
    const pageBlocks = safeParse(array(PageBlockSchema), getPageBlocksResponse.Items);
    if (!pageBlocks.success) return false;

    const batchDeletePageCommand = new BatchWriteCommand({
      RequestItems: {
        [process.env.TABLE_NAME!]: [
          {
            DeleteRequest: {
              Key: {
                PK: 'page',
                SK: `site#${siteId}#page#${version}#${pageId}`,
              },
            },
          },
          ...pageBlocks.output
            .map((block) => ({
              DeleteRequest: {
                Key: {
                  PK: 'pageBlock',
                  SK: block.SK,
                },
              },
            })),
        ],
      },
    });

    await dynamodbDocumentClient.send(batchDeletePageCommand);

    return true;
  },
};