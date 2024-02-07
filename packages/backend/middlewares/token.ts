import { useSession } from '@mountain-cms/helpers/session';

export const tokenMiddleware = () => {
  try {
    const session = useSession();
    if (Date.now() >= (session?.exp || 0) * 1000) return false;

    return true;
  } catch (e) {
    console.error(e);

    return false;
  }
};