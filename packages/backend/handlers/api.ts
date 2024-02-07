import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { setEvent } from '@mountain-cms/helpers/event';
import { response } from '@mountain-cms/helpers/api';
import { tokenMiddleware } from '../middlewares/token';
import { authController } from '../controllers/authController';
import { meController } from '../controllers/meController';
import { blockController } from '../controllers/blockController';
import { pageController } from '../controllers/pageController';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  setEvent(event);

  const auth = authController();

  switch (event.requestContext.routeKey) {
    case 'GET /auth/code/request':
      return auth.request();
    case 'GET /auth/code/complete':
      return auth.complete();
    case 'GET /auth/code/switch-site':
      return auth.switchSite();
  }

  if (!tokenMiddleware()) return response(401, { message: 'Unauthorized' });

  const me = meController();
  const block = blockController();
  const page = pageController();

  switch (event.requestContext.routeKey) {
    case 'GET /me':
      return me.get();
    case 'PUT /me':
      return me.update();
    case 'GET /blocks':
      return block.list();
    case 'POST /blocks':
      return block.create();
    case 'GET /blocks/{id}':
      return block.get();
    case 'PUT /blocks/{id}':
      return block.update();
    case 'DELETE /blocks/{id}':
      return block.delete();
    case 'GET /pages':
      return page.list();
    case 'POST /pages':
      return page.create();
    case 'GET /pages/{id}':
      return page.get();
    case 'PUT /pages/{id}':
      return page.update();
    case 'PUT /pages/{id}/publish':
      return page.publish();
    case 'PUT /pages/{id}/revert':
      return page.revert();
    case 'DELETE /pages/{id}':
      return page.delete();
    default:
      return { statusCode: 404, body: JSON.stringify({ message: 'Not found' }) };
  }
};
