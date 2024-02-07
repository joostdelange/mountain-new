import { safeParse } from 'valibot';
import { useJsonBody } from '@mountain-cms/helpers/event';
import { response } from '@mountain-cms/helpers/api';
import { UpdateMeInput } from '@mountain-cms/schemas';
import { useSession } from '@mountain-cms/helpers/session';
import { userRepository } from '../repositories/userRepository';
import { siteRepository } from '../repositories/siteRepository';

export const meController = () => ({
  async get() {
    const session = useSession();

    const user = await userRepository.getUserByUserId(session.userId);
    if (!user.success) return response(422, { message: 'Error getting initial data' });

    const sites = await siteRepository.getSitesByUser(user.output);
    if (!sites.success) return response(422, { message: 'Error getting initial data' });

    return response(200, { ...user.output, sites: sites.output, currentSiteId: session.siteId });
  },
  async update() {
    const session = useSession();

    const body = safeParse(UpdateMeInput, { ...useJsonBody(), SK: session.userId });
    if (!body.success) return response(422, { message: 'Error updating your profile' });

    const user = await userRepository.updateUser(body.output);
    if (!user.success) return response(422, { message: 'Error updating your profile' });

    const sites = await siteRepository.getSitesByUser(user.output);
    if (!sites.success) return response(422, { message: 'Error getting initial data' });

    return response(200, { ...user.output, sites: sites.output, currentSiteId: session.siteId });
  },
});