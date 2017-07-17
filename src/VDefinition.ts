import { resolve } from "path";
import { VFallbackDefinition as VFallback } from "./DefinitionParsers/VFallbackDefinition";
import { VPolicyDefinition as VPolicy } from "./DefinitionParsers/VPolicyDefinition";

export class VDefinition {
  public fallback: VFallback;
  public policy: VPolicy;
  constructor(path: string) {
    const base = resolve(path);
    const definitionDir = resolve(base, "./definitions");
    this.fallback = new VFallback(definitionDir);
    this.policy = new VPolicy(definitionDir);
    this.fallback.loadOn();
    this.policy.loadOn();
  }

  public parse(scope) {
    const definitions = {
      fallbacks: this.fallback.get(),
      policies: this.policy.get()
    };
    scope.definitions = definitions;
  }

  public set(data) {
    if (data.fallbacks) {
      this.fallback.set(data.fallbacks);
    }

    if (data.policies) {
      this.policy.set(data.policies);
    }
  }

};
