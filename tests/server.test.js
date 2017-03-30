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
    it('should create new todo and return it', done => {
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

describe('GET /todos/:id', () => {
    it('should return todo doc with existing id', done => {
        request(app)
            .get(`/todos/${testTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(testTodos[0].text);
            })
            .end(done);
    });
    it('should return 404 if no todo found', done => {
        const id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if invalid object id passed', done => {
        const id = '123qwerty';
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove todo with existing id and return it', done => {
        const id = testTodos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${testTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) { return done(err); }

                Todo.findById(id).then(todo => {
                    expect(todo).toNotExist();
                    done();
                }, err => done(err));
            });
    });
    it('should return 404 if no todo found', done => {
        const id = new ObjectID();
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 when invalid object id passed', done => {
        const id = '123qwerty';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update todo with existing id and return it', done => {
        const id = testTodos[0]._id.toHexString();
        const text = 'New test text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });
    it('should set completedAt to null when todo is not completed', done => {
        const id = testTodos[1]._id.toHexString();
        const text = 'New test text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});