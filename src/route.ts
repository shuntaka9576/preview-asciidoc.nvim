import * as fs from 'fs';
import * as path from 'path';

import { getModuleLogger } from './util/logger';

const logger = getModuleLogger();
const routeList = [];

const use = (route: any): void => {
  routeList.unshift((req, res, next) => () => route(req, res, next));
};

use(async (req, res, next) => {
  if (/\/page\/\d+/.test(req.url)) {
    return fs.createReadStream(`${__dirname}/../out/index.html`).pipe(res);
  } else if (/\/page\//.test(req.url)) {
    const fileName = path.basename(req.url);
    return fs
      .createReadStream(`${__dirname}/../../preview/images/${fileName}`)
      .pipe(res);
  }
  next();
});

use((req, res) => {
  res.statusCode = 404;
  return fs.createReadStream(`${__dirname}/../out/404.html`).pipe(res);
});

export function routes(req: any, res: any, next?: any): any {
  return routeList.reduce((next, route) => {
    return route(req, res, next);
  }, next)();
}
