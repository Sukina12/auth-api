'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500');
const notFound = require('./error-handlers/404');
const authRoutes = require('./routes/router');
const logger = require ('./middleware/logger');

const v1Routes =require('./routes/v1');
const v2Routes =require('./routes/v2');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
app.use(logger);

app.use('/api/v1',v1Routes);
app.use('/api/v2',v2Routes);

// prove of life
app.get('/', (req, res) => {
  res.status(200).send('Hello from sukina !');
});

// Catchalls
app.use('*',notFound);
app.use( errorHandler);

module.exports = {
  app: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
