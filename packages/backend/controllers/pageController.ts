import { safeParse } from 'valibot';
import { usePathParams, useJsonBody } from '@mountain-cms/helpers/event';
import { useSession } from '@mountain-cms/helpers/session';
import { response } from '@mountain-cms/helpers/api';
import { CreatePageInput, UpdatePageInput, PageVersion } from '@mountain-cms/schemas';
import { pageRepository } from '../repositories/pageRepository';

export const pageController = () => ({
  async list() {
    const session = useSession();

    const pages = await pageRepository.getPagesBySiteId(session.siteId, PageVersion.CONCEPT);
    if (!pages.success) return response(422, { message: 'Error getting pages' });

    return response(200, pages.output.toSorted((a, b) => b.updatedAt - a.updatedAt));
  },
  async get() {
    const session = useSession();
    const params = usePathParams();
    if (!params.id) return response(422, { message: 'Error getting page' });

    const page = await pageRepository.getPageByPageId(params.id, session.siteId, PageVersion.CONCEPT);
    if (!page || !page.success || !page.output.pageId) return response(422, { message: 'Error getting page' });

    return response(200, page.output);
  },
  async create() {
    const session = useSession();
    const body = safeParse(CreatePageInput, useJsonBody());
    if (!body.success) return response(422, { message: 'Error creating page' });

    const page = await pageRepository.createPage(body.output, session.siteId, PageVersion.CONCEPT);
    if (!page.success || !page.output.pageId) return response(422, { message: 'Error creating page' });

    return response(200, page.output);
  },
  async update() {
    const session = useSession();
    const body = safeParse(UpdatePageInput, useJsonBody());
    if (!body.success) return response(422, { message: 'Error updating page' });

    const page = await pageRepository.updatePage(body.output, session.siteId, PageVersion.CONCEPT);
    if (!page || !page.success || !page.output.pageId) return response(422, { message: 'Error updating page' });

    return response(200, page.output);
  },
  async publish() {
    const session = useSession();
    const body = safeParse(UpdatePageInput, useJsonBody());
    if (!body.success) return response(422, { message: 'Error publishing page' });

    const conceptPage = await pageRepository.updatePage(body.output, session.siteId, PageVersion.CONCEPT, false);
    if (!conceptPage || !conceptPage.success || !conceptPage.output.pageId) return response(422, { message: 'Error publishing page' });

    const publishedPage = await pageRepository.updatePage(conceptPage.output, session.siteId, PageVersion.PUBLISHED, false);
    if (!publishedPage || !publishedPage.success || !publishedPage.output.pageId) return response(422, { message: 'Error publishing page' });

    return response(200, conceptPage.output);
  },
  async revert() {
    const session = useSession();
    const params = usePathParams();
    if (!params.id) return response(422, { message: 'Error reverting to published version' });

    const publishedPage = await pageRepository.getPageByPageId(params.id, session.siteId, PageVersion.PUBLISHED);
    if (!publishedPage || !publishedPage.success) return response(422, { message: 'Error reverting to published version' });
    if (!publishedPage.output.pageId) return response(422, { message: 'There is no published version at the moment' });

    const conceptPage = await pageRepository.updatePage(publishedPage.output, session.siteId, PageVersion.CONCEPT, false);
    if (!conceptPage || !conceptPage.success) return response(422, { message: 'Error reverting to published version' });

    return response(200, conceptPage.output);
  },
  async delete() {
    const session = useSession();
    const params = usePathParams();
    if (!params.id) return response(422, { message: 'Error deleting page' });

    await Promise.all([
      pageRepository.deletePage(params.id, session.siteId, PageVersion.CONCEPT),
      pageRepository.deletePage(params.id, session.siteId, PageVersion.PUBLISHED),
    ]);

    return response(200, { message: 'Succesfully deleted page' });
  },
});
