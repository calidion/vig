// import 'mocha';
// import { VModel, VHandler } from '../src';
// var assert = require('assert');
// var path = require('path');
// var sailsMemoryAdapter = require('sails-memory');
// var request = require('supertest');
// var express = require('express');
// var app;

// var componentPath = path.resolve(__dirname, './data/component/');

// const model = new VModel(componentPath);

// let models;

// describe('VModel', function () {
//   before(function () {
//     app = express();
//   });
//   it('should init models', function (done) {
//     model.init({
//       adapters: {
//         memory: sailsMemoryAdapter
//       },
//       connections: {
//         default: {
//           adapter: 'memory'
//         }
//       }
//     },
//       {
//         connection: 'default'
//       },
//       function (error, models) {
//         assert(!error);
//         assert(models);
//         assert(models.User);
//         assert(models.Pet);
//         model.attach(app, models);
//         done();
//       });
//   });

//   it('should init models again', function (done) {
//     model.init({
//       adapters: {
//         memory: sailsMemoryAdapter
//       },
//       connections: {
//         default: {
//           adapter: 'memory'
//         }
//       }
//     },
//       {
//         connection: 'default'
//       },
//       function (error) {
//         assert(error);
//         done();
//       });
//   });

//   it('should get test req.models', function (done) {
//     app.use('/models/assert', function (req, res) {
//       assert(req.models.Pet);
//       assert(req.models.User);
//       res.send('ok');
//     });

//     request(app)
//       .post('/models/assert')
//       .expect(200)
//       .end(function (err, res) {
//         assert(!err);
//         assert(res.text === 'ok');
//         done();
//       });
//   });
// });
