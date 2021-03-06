import { Helper } from './helper';

export const environment = {
  production: true,
  esearch: Helper.tunnel("esearch"),
  webservice: Helper.tunnel("ws"),
  couchdb: Helper.tunnel("couchdb"),
  db: "nlp-101",
  configs: Helper.configs,
};
