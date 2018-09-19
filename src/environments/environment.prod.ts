import { Helper } from './helper';

export const environment = {
  production: true,
  esearch: Helper.server("9200"),
  webservice: Helper.server("8000")
};
