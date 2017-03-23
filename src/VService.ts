import * as fs from 'fs';

import { VHandler } from './VHandler'

export class VService {
  protected handlers = [];
  constructor() {
  }

  addHandler(handler: VHandler) {
    this.handlers.push(handler);
  }

  toJSON() {
    var handlers = [];
    for (let i = 0; i < this.handlers.length; i++) {
      handlers.push(this.handlers[i].toJSON());
    }
    return handlers;
  }
}