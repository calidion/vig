import { VBase } from "../Components/VBase";
export class Filter extends VBase {
  constructor(path) {
    super(path);
    this.defaultPath = "filters";
  }
  public isType(item: any): boolean {
    return item instanceof Function;
  }
}
