const browserify = require('browserify-middleware');
const glslify = require('glslify');
const express = require('express');

const app = express()
  .use('/js', browserify('./client', {transform: [glslify]}))
  .use(express.static('./public'))
  .listen(process.env.PORT);
