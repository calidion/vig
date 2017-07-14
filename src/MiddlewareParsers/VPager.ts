/**
 * Copyright(c) 2016 calidion <calidion@gmail.com>
 * Apache 2.0 Licensed
 */

/**
 * @class VPager
 * VPager is a parser for pagination info, after parsing, the sharing info inside {VHandler}
 * will be provided with a pager attribute, containing attributes:
 * 1. @param page current requesting page number
 * 2. @param limit max items per page
 *
 * so every request hander inside routers can accession this with
 * {si.pager.page} or {si.pager.limit}
 */

import { VHTTPBase } from "../Components/VHTTPBase";

export class VPager extends VHTTPBase {
  constructor(path) {
    super(path)
    this.defaultPath = "pagers";
  }
  public isType(item: any): boolean {
    return typeof item === "boolean";
  }

  public toNumber(value) {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 1;
    }
    if (value < 1) {
      value = 1;
    }
    return value;
  }

  public async parse(req, res, scope): Promise<boolean> {
    const handler = this.check(req);
    if (!handler) {
      scope.query = req.query;
      delete scope.query.page;
      delete scope.query.limit;
      return false;
    }
    const query = req.query;
    query.page = this.toNumber(query.page);
    query.limit = this.toNumber(query.limit);
    scope.query = query;
    console.log(scope);
    return true;
  }
}
