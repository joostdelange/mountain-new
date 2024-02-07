import { safeParse } from 'valibot';
import { useJsonBody, usePathParams } from '@mountain-cms/helpers/event';
import { response } from '@mountain-cms/helpers/api';
import { CreateBlockInput, UpdateBlockInput } from '@mountain-cms/schemas';
import { useSession } from '@mountain-cms/helpers/session';
import { blockRepository } from '../repositories/blockRepository';

export const blockController = () => ({
  async list() {
    const session = useSession();

    const blocks = await blockRepository.getBlocks(session.siteId);
    if (!blocks.success) return response(422, { message: 'Error getting blocks' });

    return response(200, blocks.output.toSorted((a, b) => a.label.localeCompare(b.label)));
  },
  async create() {
    const session = useSession();
    const body = safeParse(CreateBlockInput, useJsonBody());
    if (!body.success) return response(422, { message: 'Error creating block' });

    const block = await blockRepository.createBlock(body.output, session.siteId);
    if (!block || !block.success) return response(422, { message: 'Error creating block' });

    return response(200, block.output);
  },
  async get() {
    const session = useSession();
    const params = usePathParams();
    if (!params.id) return response(422, { message: 'Error getting page' });

    const block = await blockRepository.getBlockByBlockId(params.id, session.siteId);
    if (!block || !block.success || !block.output.SK) return response(422, { message: 'Error getting block' });

    return response(200, block.output);
  },
  async update() {
    const session = useSession();
    const body = useJsonBody();

    const block = safeParse(UpdateBlockInput, body);
    if (!block.success || !block.output.siteId || block.output.siteId !== session.siteId) {
      return response(422, { message: 'Error updating block', issues: block.issues });
    }

    const updatedBlock = await blockRepository.updateBlock(block.output);
    if (!updatedBlock.success) return response(422, { message: 'Error updating block' });

    return response(200, updatedBlock.output);
  },
  async delete() {
    const session = useSession();
    const params = usePathParams();
    if (!params.id) return response(422, { message: 'Error deleting block' });

    await blockRepository.deleteBlock(params.id, session.siteId);

    return response(200, { message: 'Succesfully deleted block' });
  },
});
