import * as WebSocket from "ws";
import { VHandler } from "./VHandler";
import { Server } from "http";

export class VWSServer {

  public static ENTER = "enter";
  public static LEAVE = "leave";

  public static getInstance() {
    if (VWSServer.instance) {
      return VWSServer.instance;
    }
    VWSServer.instance = new VWSServer();
  }

  private static instance;

  public server;
  public eventsAndListeners: object = {};

  // private constructor(server) {

  // }

  public addEventListener(event: string, handler: VHandler) {
    let handlers = this.eventsAndListeners[event];
    if (!(handlers instanceof Array)) {
      handlers = [];
    }
    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler);
    }
  }

  public removeEventListener(event: string, handler: VHandler) {
    const handlers = this.eventsAndListeners[event];
    if (!(handlers instanceof Array)) {
      return;
    }
    const index = handlers.indexOf(handler);
    if (index === -1) {
      handlers.splice(index, 1);
    }
  }

  public filter(client, handler) {
    return true;
  }

  public send(data, handler: VHandler) {
    const wss = this.server;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (this.filter(client, handler)) {
          client.send(data);
        }
      }
    });
  }

  public onEnter(ws, req) {
    const enterListeners = this.eventsAndListeners[VWSServer.ENTER];
    if (enterListeners && enterListeners.length) {
      for (let i = 0; i < enterListeners.length; i++) {
        const handler = enterListeners[i];
        handler.wsEnter(ws, req);
      }
    }
  }

  public onEvents(ws, req) {
    for (const k of Object.keys(this.eventsAndListeners)) {
      if (k === VWSServer.ENTER) {
        continue;
      }
      ws.on(k, (data) => {
        const eventListeners = this.eventsAndListeners[k];
        for (let i = 0; i < eventListeners.length; i++) {
          const handler = eventListeners[i];
          handler.wsEvent(k, ws, req);
        }
      });
    }
  }

  public start(server: Server) {
    const wss = new WebSocket.Server({ server });
    this.server = wss;
    wss.on("connection", (ws, req) => {
      this.onEnter(ws, req);
      this.onEvents(ws, req);
    });
  }
}
