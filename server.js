require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.listen(3000, () => console.log(`Running on port ${process.env.PORT}`));

module.exports = { app };