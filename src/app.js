const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')

const app = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

// IMPORTANTE: By security reasons, I would suggest to use hash ID instead of incremental numbers.

const contracts = require('./routes/contracts.route');
app.use('/contracts', contracts);

const jobs = require('./routes/jobs.route');
app.use('/jobs', jobs);

module.exports = app;
