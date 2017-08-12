"use strict";
var assert = require("assert");
var request = require("supertest");
var express = require("express");
var session = require("express-session");
var cookies;

var path = require("path");
import { VHandler, VService, VPolicy } from "../src";
var vhandler = new VHandler();
var app = express();

describe("vig #policies", function () {
  before(function () {
    app.use(session({
      name: "vig",
      secret: "secret oososos",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false
      }
    }));

    vhandler.set({
      urls: ['/failure'],
      definitions: {
        fallbacks: {
          ok: function (error, req, res) {
            res.status(200).send('ok');
          },
          test: function (error, req, res) {
            res.status(404).send('test');
          }
        }
      },
      routers: {
        get: function (req, res) {
          res.send('get');
        },
        post: function (req, res) {
          res.send('post');
        }
      },
      policies: {
        methods: ['get'],
        get: async (req, res, scope) => {
          return (false);
        }
      },
      validations: {
        post: async (req, res, scope) => {
          return (false);
        }
      },
      failures: {
        policy: 'ok',
        validation: 'test'
      }
    });
    vhandler.attach(app);
  });

  it("should have  fallbacks", function (done) {
    var passed = false;
    app.use((req, res, next) => {
      passed = true;
      assert(req.fallbacks);
      next();
    });
    request(app)
      .get("/")
      .end(function (err, res) {
        assert(passed);
        done();
      });
  });

  it("should provent failure", function (done) {
    request(app)
      .get("/failure")
      .expect(200)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === "ok");
        done();
      });
  });

  it("should post /prevent all", function (done) {
    request(app)
      .post("/failure")
      .expect(404)
      .end(function (err, res) {
        assert(!err);
        assert(res.text === "test");
        done();
      });
  });
})

