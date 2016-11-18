'use strict';

var assert = require('assert');
var path = require('path');
var vig = require('../lib');
var request = require('supertest');
var express = require('express');
var app;

describe('vig #uploaders', function () {
  before(function () {
    app = express();
    app.set('trust proxy', 1); // trust first proxy
    vig.init(app);
    app.post('/file/upload', function (req, res) {
      req.cloud('txt', {
        type: 'disk',
        config: {
          dir: path.resolve(__dirname, './uploaded/'),
          base: 'http://localhost'
        }
      }).then(function (files) {
        res.send(String(files.length));
      });
    });
  });

  it('should upload files', function (done) {
    request(app).post('/file/upload')
      .attach('txt', path.resolve(__dirname, 'uploader/a.txt'))
      .attach('txt', path.resolve(__dirname, 'uploader/b.txt'))
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '2');
        done();
      });
  });
  it('should upload files', function (done) {
    request(app).post('/file/upload')
      .attach('txt', path.resolve(__dirname, 'uploader/a.txt'))
      .end(function (err, res) {
        assert(!err);
        assert(res.text === '1');
        done();
      });
  });

  it('should test onError', function (done) {
    var onError = vig.uploaders._onError(null, function (err) {
      assert(err === 100);
      done();
    });
    onError(100);
  });
  it('should test onUploader', function (done) {
    var onUpload = vig.uploaders._onUpload(null, function (err) {
      assert(err === 100);
      done();
    });
    onUpload(100);
  });
});

