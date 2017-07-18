import * as assert from "assert";

export = {
  urls: ['/urls'],
  prefix: '/a',
  configs: {
    b: 1
  },
  routers: {
    get: async(req, res, scope) => {
      assert(scope.configs.test.a === '1');
      assert(scope.configs.b === 1);
      res.send('get');
    }
  }
}