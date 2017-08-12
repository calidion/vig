import 'mocha';

import { VHandler, VService } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as request from 'supertest';
import * as WebSocket from "ws";

import { expect } from "chai";

const componentPath = path.resolve(__dirname, './data/component.websockets/');
let app, handler, service;

let server, options;



describe('VService', () => {
  before(function (done) {
    app = express();
    handler = new VHandler(null, componentPath);
    handler.attach(app);
    service = new VService();
    service.start(app, (s, o) => {
      server = s;
      options = o;
      done();
    });
  });

  it("should open a web socket", (done) => {
    const ws = new WebSocket(`ws://${options.ip}:${options.port}`);
    ws.on("message", (data) => {
      assert("hello" === data);
      ws.close();
      done();
    });
  })

  it("should send message", (done) => {
    const ws = new WebSocket(`ws://${options.ip}:${options.port}`);
    ws.on("open", () => {
      ws.send("abcd");
      ws.send(JSON.stringify({
        event: 'put',
        message: {
          text: 'text'
        }
      }));
      ws.send(JSON.stringify({
        event: 'post',
        message: 'message'
      }));
      ws.on("message", (data) => {
        if ("hello" === data) {
          return;
        }
        data = JSON.parse(data);
        console.log(data);
        expect(data.event).to.be.eq("post");
        expect(data.message).to.be.eq("echo message");
        ws.close();
        done();
      });
    });
  })

  it("should broadcast message", (done) => {
    const ws = new WebSocket(`ws://${options.ip}:${options.port}`);
    const ws1 = new WebSocket(`ws://${options.ip}:${options.port}`);
    let count = 0;

    const f = (data) => {
      console.log("inside message f");
      console.log(data);
      if ("hello" === data) {
        return;
      }
      console.log("f");
      console.log(data);
      expect(data).to.be.eq("message");
      count++;
      if (count > 1) {
        ws.close();
        ws1.close();
        done();
      }
    }
    ws.on("open", () => {
    });
    ws.on("message", f);

    ws1.on("message", f);

    ws1.on("open", () => {
      ws1.send(JSON.stringify({
        event: 'get',
        message: 'message'
      }));
    });
  })

  it("should broadcast message with filter", (done) => {
    const ws = new WebSocket(`ws://${options.ip}:${options.port}`);
    const ws1 = new WebSocket(`ws://${options.ip}:${options.port}`);
    let count = 0;

    const f = (data) => {
      console.log("inside message f");
      console.log(data);
      if ("hello" === data) {
        return;
      }
      console.log("f");
      console.log(data);
      expect(data).to.be.eq("message");
      count++;
      if (count > 1) {
        ws.close();
        ws1.close();
        done();
      }
    }
    ws.on("open", () => {
      ws.send(JSON.stringify({
        event: 'false',
        message: 'message'
      }));
    });
    ws.on("message", f);

    ws1.on("message", f);

    ws1.on("open", () => {
      ws1.send(JSON.stringify({
        event: 'broadcast',
        message: 'message'
      }));
    });
  })

  it("should shut down", (done) => {
    server.close();
    done();
  })
});