import { Helper } from './helper';

export const environment = {
  production: true,
  esearch: Helper.tunnel("esearch"),
  webservice: Helper.tunnel("8000")
};
