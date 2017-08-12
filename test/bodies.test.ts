var assert = require("assert");
var request = require("supertest");
var express = require("express");
var path = require("path");
import { promisify } from "bluebird";
import { VHandler, VService, VEvent } from "../src";
import * as fs from "fs";
var app = express();

var componentPath = path.resolve(__dirname, "./data/component.bodies/");


describe("vig #body", function () {
  it("should get body1", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body1"],
      bodies: {
        post: {
          form: true
        }
      },
      routers: {
        post: async (req, res) => {
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body1")
      .type("form")
      .send({
        key: "value",
        key1: "value1"
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        console.log(err, res.text);
        assert(res.body.key === "value");
        assert(res.body.key1 === "value1");
        done();
      });
  });

  it("should get body2", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body2"],
      bodies: {
        post: {
          formdata: true
        }
      },
      routers: {
        post: async (req, res) => {
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body2")
      .type("form")
      .send({
        key: "value",
        key1: "value1"
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.body.key === "value");
        assert(res.body.key1 === "value1");
        done();
      });
  });

  it("should get body3", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body3"],
      bodies: {
        post: {
          json: true
        }
      },
      routers: {
        post: async (req, res) => {
          res.send(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body3")
      .type("json")
      .send(JSON.stringify({
        key: "value",
        key1: "value1"
      }))
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.body.key === "value");
        assert(res.body.key1 === "value1");
        done();
      });
  });

  it("should get body4", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body4"],
      bodies: {
        post: {
          xml: true,
          lot: true,
          good: null,
          send: async (req, res, scope) => {
          }
        }
      },
      routers: {
        post: async (req, res) => {
          res.send(String(req.body));
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body4")
      .type("raw")
      .set("Content-Type", "text/xml")
      .set("Accept", "text/xml")
      .send("<?xml version=\"1.0\" encoding=\"utf-8\" ?><key>value</key><key1>value1</key1>")
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === "<?xml version=\"1.0\" encoding=\"utf-8\" ?><key>value</key><key1>value1</key1>");
        done();
      });
  });

  it("should get body5", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body5"],
      bodies: {
        post: {
          xml: true,
          lot: true,
          good: null,
          send: async (req, res, scope) => {
          }
        }
      },
      routers: {
        post: async (req, res) => {
          res.send(String(req.body));
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body5")
      .type("raw")
      .set("Content-Type", "application/xml")
      .set("Accept", "application/xml")
      .send("<?xml version=\"1.0\" encoding=\"utf-8\" ?><key>value</key><key1>value1</key1>")
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === "<?xml version=\"1.0\" encoding=\"utf-8\" ?><key>value</key><key1>value1</key1>");
        done();
      });
  });

  it("should get body51", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/body511"],
      routers: {
        post: async (req, res) => {
          res.json(req.body);
        }
      }
    });
    handler.attach(app);
    request(app)
      .post("/body511")
      .type("form")
      .send({
        key: "value",
        key1: "value1"
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.body.key === "value");
        assert(res.body.key1 === "value1");
        done();
      });
  });

  it("should post /body6", function (done) {
    const app1 = express();
    var handler = new VHandler(
      ["/body6"],
      componentPath,
      "/"
    );
    handler.attach(app1);

    request(app1)
      .post("/body6")
      .type("form")
      .set('Cookie', ['myApp-token=12345667', 'myApp-other=blah'])
      .send({
        key: "value",
        key1: "value1"
      })
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.body.key === "value");
        assert(res.body.key1 === "value1");
        done();
      });
  });


  it("should post /file", function (done) {
    var handler = new VHandler();
    handler.set({
      urls: ["/file"],
      asyncs: {
        post: [async () => {
        }, async () => {
        }]
      },
      bodies: {
        post: {
          file: true,
          lot: true,
          good: null,
          send: async (req, res, scope) => {
          }
        }
      },
      routers: {
        post: async (req, res) => {
          const files = await req.storage("txt");
          const file = files[0];
          const content = fs.readFileSync(file.fd);
          res.send(String(content));
        }
      }
    });
    handler.attach(app);

    request(app)
      .post("/file")
      .attach("txt", path.resolve(__dirname, "./data/uploader/a.txt"))
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === "hello world!")
        done();
      });
  });
});
