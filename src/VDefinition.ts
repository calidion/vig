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
    const definitions: any = {
    };
    const fallbacks = this.fallback.get();
    const policies = this.policy.get();
    if (Object.keys(fallbacks).length > 0) {
      definitions.fallbacks = fallbacks;
    }
    if (Object.keys(policies).length > 0) {
      definitions.policies = policies;
    }
    if (Object.keys(definitions).length > 0) {
      scope.definitions = definitions;
    }
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
