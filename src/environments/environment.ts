import { Helper } from './helper';



export const environment = {
  production: false,
  esearch: Helper.tunnel("esearch"),
  webservice: Helper.tunnel("ws"),
  configs: Helper.configs,
  couchdb: Helper.tunnel("couchdb"),
  db: "nlp-party"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
