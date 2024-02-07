import { decode, sign, SignOptions, JwtPayload } from 'jsonwebtoken';
import { useEvent } from './event';

export const useSession = () => {
  const event = useEvent();
  const authorizationToken = event.headers.authorization;
  if (!authorizationToken) throw new Error('Authorization token not present');

  return decode(authorizationToken.replace('Bearer ', '')) as JwtPayload;
};

export const createSession = (payload: object, options?: SignOptions) => {
  return sign(payload, process.env.JWT_SECRET!, options);
};
