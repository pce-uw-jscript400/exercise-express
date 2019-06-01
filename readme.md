# Exercise: Express Produce Stand

This exercise will assess your ability to build upon an already existing Express API.

## Setup

1. Fork & Clone this repository
1. `npm install`
1. `npm run dev`

## Instructions

Improve upon and/or build the following routes as specified.

- [ ] [GET /vegetables?name=[partial-query]](#get-vegetablesnamepartial-query)
- [ ] [DELETE /vegetables/[id]](#delete-vegetablesid)
- [ ] [PUT /vegetables/[id]](#put-vegetablesid)
- [ ] [GET /fruits](#get-fruits)
- [ ] [GET /fruits?name=[partial-query]](#get-fruitsnamepartial-query)
- [ ] [GET /fruits/[id]](#get-fruitsid)
- [ ] [POST /fruits](#post-fruitsid)
- [ ] [DELETE /fruits/[id]](#delete-fruitsid)
- [ ] [PUT /fruits/[id]](#put-fruitsid)

### GET /vegetables?name=[partial-query]

_Note: This is not a new route!_

* e.g. `GET http://localhost:5000/vegetables?name="pepper"`

> Return a list of all vegetables where the query is included somewhere in the name.

**Correct Response Body Example**
```json
[
  { "id": "AEdvQm9t_", "name": "green pepper", "price": "0.99" },
  { "id": "JA_dIbXLW", "name": "red pepper", "price": "0.99" }
]
```

> If there are no vegetables that match, just return an empty array.

**Correct Response Body Example**
```json
[]
```

### DELETE /vegetables/[id]

* e.g. `DELETE http://localhost:5000/vegetables/5TsEt-xfI`

> If there is a record where the ID matches, remove the resource from the array. Return a status code of *200*.

**Correct Response Body Example**
```json
{ "id": "5TsEt-xfI", "name": "turnip", "price": "0.79" }
```

> If there is not a record where the ID matches, return an error with a status of `404` saying that the vegetable could not be found.

**Incorrect Response Body Example**
```json
{ "message": "Could not find vegetable with ID of 1" }
```

### PUT /vegetables/[id]

* e.g. `PUT http://localhost:5000/vegetables/5TsEt-xfI`

> If there is a record where the ID matches, validate the request body and then update the resource with the new information. Return a status code of *200*.

**Correct Request Body Example**
```json
{ "name": "turnip", "price": "0.79" }
```

**Correct Response Body Example**
```json
{ "id": "5TsEt-xfI", "name": "turnip", "price": "0.79" }
```

> If there is not a record where the ID matches, return an error with a status of `404` saying that the vegetable could not be found.

**Incorrect Response Body Example**
```json
{ "message": "Could not find vegetable with ID of 1" }
```

> If the request body does not include the "name" and "price" keys, or includes other keys, return the validation error.

**Incorrect Request Body Example**
```json
{ "name": "turnip" }
```

**Incorrect Response Body Example**
```json
{ "message": "Bad request" }
```

### GET /fruits

* e.g. `GET http://localhost:5000/fruits`

> Return all fruits with a status code of *200*.

**Correct Response Body Example**
```json
[
  { "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }
]
```

### GET /fruits?name=[partial-query]

_Note: This is not a new route!_

* e.g. `GET http://localhost:5000/fruits?name="berr"`

> Return a list of all fruits where the query is included somewhere in the name.

**Correct Response Body Example**
```json
[
  { "id": "H14ykcZcT", "name": "blueberries", "price": "2.99" },
  { "id": "faf84ZZNF", "name": "strawberries", "price": "3.99" }
]
```

> If there are no fruits that match, just return an empty array.

**Correct Response Body Example**
```json
[]
```

### GET /fruits/[id]

* e.g. `GET http://localhost:5000/fruits/p7pzzZxCX`

> If there is a record where the ID matches, return the resource with a status code of *200*.

**Correct Response Body Example**
```json
{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }
```

### POST /fruits

* e.g. `POST http://localhost:5000/fruits`

> Validate the request body and then create a new resource with an ID. Return a status code of *201*.

**Correct Request Body Example**
```json
{ "name": "banana", "price": "0.79" }
```

**Correct Response Body Example**
```json
{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }
```

### DELETE /fruits/[id]

* e.g. `DELETE http://localhost:5000/fruits/p7pzzZxCX`

> If there is a record where the ID matches, remove the resource from the array. Return a status code of *200*.

**Correct Response Body Example**
```json
{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }
```

> If there is not a record where the ID matches, return an error with a status of `404` saying that the banana could not be found.

**Incorrect Response Body Example**
```json
{ "message": "Could not find banana with ID of 1" }
```

### PUT /fruits/[id]

* e.g. `PUT http://localhost:5000/fruits/p7pzzZxCX`

> If there is a record where the ID matches, validate the request body and then update the resource with the new information. Return a status code of *200*.

**Correct Request Body Example**
```json
{ "name": "banana", "price": "0.79" }
```

**Correct Response Body Example**
```json
{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }
```

> If there is not a record where the ID matches, return an error with a status of `404` saying that the banana could not be found.

**Incorrect Response Body Example**
```json
{ "message": "Could not find banana with ID of 1" }
```

> If the request body does not include the "name" and "price" keys, or includes other keys, return the validation error.

**Incorrect Request Body Example**
```json
{ "name": "banana" }
```

**Incorrect Response Body Example**
```json
{ "message": "Bad request" }
```