import axios from 'axios';

export const mjmlHttp = (applicationId: string, secretKey: string) => axios.create({
  baseURL: 'https://api.mjml.io/v1',
  auth: {
    username: applicationId,
    password: secretKey,
  },
});
