import "mocha";
import { VCondition } from "../../src/MiddlewareParsers/VCondition";

import * as assert from "assert";
import * as path from "path";
import * as fs from "fs";

const router = new VCondition("");
var componentPath = path.resolve(__dirname, "../data/component/");
var objPath = path.resolve(__dirname, "../data/component/conditions");

describe("VCondition", () => {
  it("should new VCondition", () => {
    assert(router);
  });

  it("should load", () => {
    var data: any = router.load(objPath);
    assert(data && data.get && data.post);
  })

  it("should load", () => {
    let r = new VCondition(componentPath);
    var data: any = r.load();
    assert(data && data.get && data.post && !data.fuck);
  })

  it("should new undefined", () => {
    let r = new VCondition(undefined);
  })
});