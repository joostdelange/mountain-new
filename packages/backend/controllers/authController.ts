import { useQueryParams, useMethod } from '@mountain-cms/helpers/event';
import { response } from '@mountain-cms/helpers/api';
import { useSession, createSession } from '@mountain-cms/helpers/session';
import { userRepository } from '../repositories/userRepository';
import { loginRepository } from '../repositories/loginRepository';

export const authController = () => ({
  async request() {
    const { email } = useQueryParams();
    if (!email) return response(401, { message: 'Something went wrong while requesting a login' });

    const user = await userRepository.getUserByEmail(email);
    if (!user.success) return response(404, { message: 'No record found of that email adres' });

    const login = await loginRepository.createLoginRecord(user.output.SK);
    if (!login || !login.success) return response(404, { message: 'No record found of that email adres' });

    await loginRepository.sendLoginRequestEmail(login.output.code, user.output.firstName, user.output.email);

    return response(200, { message: 'Email sent to provided email address' });
  },
  async complete() {
    const { email, code } = useQueryParams();
    if (!email || !code) return response(401, { message: 'Something went wrong while completing the login' });

    const login = await loginRepository.getLoginRecord(code);
    if (!login || !login.success) return response(401, { message: 'Something went wrong while completing the login' });

    const [user] = await Promise.all([
      userRepository.getUserByUserId(login.output.userId),
      loginRepository.updateLoginRecord(login.output.SK),
    ]);
    if (!user.success) return response(401, { message: 'Something went wrong while completing the login' });
    if (!user.output.siteIds?.length) return response(401, { message: 'There are no sites you manage' });

    const sessionToken = createSession(
      { userId: login.output.userId, siteId: user.output.siteIds[0] },
      { expiresIn: '1d' },
    );

    return response(
      200,
      { message: 'Succesfully completed login request' },
      { headers: { Authorization: sessionToken } },
    );
  },
  async switchSite() {
    const method = useMethod();
    if (method === 'OPTIONS') return response(200, { message: 'Preflight check OK' });

    const queryParams = useQueryParams();
    if (!queryParams.siteId) return response(401, { message: 'Unauthorized' });

    const session = useSession();

    const user = await userRepository.getUserByUserId(session.userId);
    if (!user.success) return response(401, { message: 'Unauthorized' });
    if (!user.output.siteIds.includes(queryParams.siteId)) return response(401, { message: 'Unauthorized' });

    const sessionToken = createSession(
      { userId: user.output.SK, siteId: queryParams.siteId },
      { expiresIn: '1d' },
    );

    return response(200,
      { message: 'Succesfully switched site' },
      { headers: { Authorization: sessionToken } },
    );
  }
});
