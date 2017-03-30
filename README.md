# API for CRUD operations on todos database

## How to use:
1) Run mongodb ```  mongod ```
2) Run node server ``` $  npm start ```

## CRUD Operations
### Create - creates new todo in the database and returns it
+ method: POST
+ url: /todos
+ json-body: { text: 'Text for new todo' }
### Read - returns all todos or specific todo
+ Get all todos
    + method: GET
    + url: /todos
+ Get todo by id
    + method: GET
    + url: /todos/:id
### Update - updates specific todo and returns it
+ method: PATCH
+ url: /todos/:id
+ json-body: { text: 'Text for new todo', completed: boolean - optional prop }

### Delete - removes specific todo and returns it
+ method: DELETE
+ url: /todos/:id
