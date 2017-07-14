export * from "./VService";
export * from "./VHandler";
export * from "./VEvent";
export * from "./Components";
export * from "./MiddlewareParsers/";
export * from "./DefinitionParsers/VPolicyDefinition";
export * from "./DefinitionParsers/VFallbackDefinition";

import {VHandler} from "./VHandler";
import {VService } from "./VService";

export function init(app) {
  const service = new VService();
  service.attach(app);
}
export function addHandler(app, options) {
  const handler = new VHandler();
  handler.set(options);
  handler.attach(app);
}
