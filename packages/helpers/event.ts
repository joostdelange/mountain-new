import { APIGatewayProxyEventV2 } from 'aws-lambda';

// @ts-ignore
export const setEvent = (incomingEvent: any) => globalThis.event = incomingEvent;

// @ts-ignore
export const useEvent = () => globalThis.event as unknown as APIGatewayProxyEventV2;

export const useJsonBody = () => {
  const event = useEvent();

  return JSON.parse(event.body || '{}');
};

export const usePathParams = () => {
  const event = useEvent();

  return event.pathParameters || {};
};

export const useQueryParams = () => {
  const event = useEvent();

  return event.queryStringParameters || {};
};

export const useMethod = () => {
  const event = useEvent();

  return event.requestContext.http.method;
};
