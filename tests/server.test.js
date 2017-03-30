const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const testTodos = [
    { _id: new ObjectID(), text: 'Test todo 1' },
    { _id: new ObjectID(), text: 'Test todo 2' }
];

// clean up collection before each test, then add test todos
beforeEach(done => {
    Todo.remove({}).then(() => {
        Todo.insertMany(testTodos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create new todo', done => {
        const text = 'test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) { return done(err); }

                Todo.find({text}).then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(err => done(err));
            });
    });
    it('should not create new todo with invalid data and return 400', done => {
        request(app)
            .post('/todos')
            .send('')
            .expect(400)
            .end((err, res) => {
                if (err) { return done(err); }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(err => done(err));
            });
    });
});

describe('GET /todos', () => {
    it('should return all todos in collection', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});
