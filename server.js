require('./config/config');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

app.use((req, res, next) => {
    const now = new Date().toString();
    const logInfo = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', logInfo + '\n', err => {
        if (err) { console.log('Unable to write log info'); }
    });

    console.log(logInfo);
    next();
});

app.listen(3000, () => console.log(`Running on port ${process.env.PORT}`));

module.exports = { app };