import 'mocha';

import { VHandler, VService } from '../src';

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as http from "supertest";
import * as WebSocket from "ws";
import * as session from "express-session";

import { expect } from "chai";

const componentPath = path.resolve(__dirname, './data/component.websockets/');
let app, handler, service, cookies;

let server, options, wsUrl;

// let req = request.defaults({ jar: true })


describe('VService', () => {
  before(function (done) {
    app = express();
    handler = new VHandler(null, componentPath);
    handler.attach(app);
    const h1 = new VHandler();
    h1.set(
      {
        urls: ['/session1'],
        sessions: {
          all: { session: true }
        },
        routers: {
          get: function (req, res) {
            res.json(req.session.user);
          },
          post: function (req, res) {
            req.session.user = {
              id: 100
            };
            res.send('post');
          }
        }
      });
    h1.attach(app);
    h1.setParent(handler);
    service = new VService();
    service.start(app, (s, o) => {
      server = s;
      options = o;
      wsUrl = `ws://${options.ip}:${options.port}`;
      done();
    });
  });

  after(function (done) {
    app = express();
    service = new VService({});
    service.start(app);
    setTimeout(() => done(), 300);
  });

  it("should open a web socket", (done) => {
    const ws = new WebSocket(wsUrl);
    ws.on("message", (data) => {
      assert("hello" === data);
      ws.close();
      done();
    });
  })

  it("should send message", (done) => {
    const ws = new WebSocket(wsUrl);
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
        expect(data.event).to.be.eq("post");
        expect(data.message).to.be.eq("echo message");
        ws.close();
        done();
      });
    });
  })

  it("should broadcast message", (done) => {
    const ws = new WebSocket(wsUrl);
    const ws1 = new WebSocket(wsUrl);
    let count = 0;

    const f = (data) => {
      if ("hello" === data) {
        return;
      }
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
    const ws = new WebSocket(wsUrl);
    const ws1 = new WebSocket(wsUrl);
    let count = 0;

    const f = (data) => {
      if ("hello" === data) {
        return;
      }
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

  it("should post", (done) => {

    const req = http(app).post("/session1");
    req.expect(200).end((err, res) => {
      assert(!err);
      assert(res.text === "post");
      var re = new RegExp('; path=/; httponly', 'gi');
      cookies = res.headers['set-cookie']
        .map(function (r) {
          return r.replace(re, '');
        }).join("; ");
      done();
    });
  });

  it("should get", (done) => {
    const req = http(app).get("/session1");
    req.cookies = cookies;
    req.expect(200).end((err, res) => {
      assert(!err);
      assert(res.body.id === 100);
      done();
    });
  });

  it("should should get session info", (done) => {
    const ws = new WebSocket(wsUrl,
      [],
      {
        'headers': {
          'Cookie': cookies
        }
      });
    ws.on("open", () => {
      ws.send(JSON.stringify({
        event: 'user',
        message: ""
      }));
      ws.on("message", (data) => {
        if ("hello" === data) {
          return;
        }
        data = JSON.parse(String(data));
        expect(data.id).to.be.eq(100);
        ws.close();
        done();
      });
    });
  })

  it("should shut down", (done) => {
    server.close();
    done();
  })
});