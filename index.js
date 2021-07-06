'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const server = require('./src/server');

const port = process.env.PORT || 5000;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);
server.start (port);
