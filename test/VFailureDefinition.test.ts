"use strict";



var assert = require("assert");
var request = require("supertest");
var express = require("express");
var session = require("express-session");
var cookies;

var path = require("path");
import { VHandler, VService, VPolicy, VPolicyDefinition, VFallbackDefinition } from "../src";
var vhandler = new VHandler();
var app = express();

var vfallback = new VFallbackDefinition();
vfallback = new VFallbackDefinition(path.resolve(__dirname, "./data/"));

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
    console.log(vfallback.get());
    vfallback.loadOn();
    vfallback.attach(app);

    vhandler.set({
      urls: ['/failure'],
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
        get: function (req, res, next) {
          console.log(arguments);
          next(false);
        }
      },
      validations: {
        post: function (req, res, next) {
          next(false);
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
});
