import * as fs from 'fs';



export class VService {
  protected urls: Array<String> = [];
  protected path: String;

  constructor(urls: Array<String>, path: string) {
    if (!urls || urls.length <= 0) {
      throw new Error('VService Error: urls MUST be specified.')
    }
    if (!path) {
      throw new Error('VService Error: path MUST be specified.')
    }
    if (fs.existsSync(path)) {
      throw new Error('VService Error: path MUST exist.')
    }
    this.urls = urls;
    this.path = path;
  }

}