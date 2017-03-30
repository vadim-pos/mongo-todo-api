require('./config/config');

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');

const app = express();

/* --- middleware settings --- */

app.use((req, res, next) => {
    const now = new Date().toString();
    const logInfo = `${now}: ${req.method} ${req.url}`;

    fs.appendFile('server.log', logInfo + '\n', err => {
        if (err) { console.log('Unable to write log info'); }
    });

    next();
});

app.use(bodyParser.json());

/* --- routes settings --- */

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({todos});
    } ,err => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    
    if (!ObjectID.isValid(id)) { res.status(404).send(); }
    
    Todo.findById(id).then(todo => {
        todo ? res.send({todo}) : res.status(404).send();
    }, err => {
        res.status(400).send();
    });
});


app.listen(3000, () => console.log(`Running on port ${process.env.PORT}`));

module.exports = { app };