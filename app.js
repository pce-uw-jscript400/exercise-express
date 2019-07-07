const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [],
  vegetables: []
}

// GET /vegetables
// implement /vegetables?name=[partial-query] in here
// accepts an optional name query string

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  //destructure the name from the request body
  const { name } = req.query
  //if we have the name, filter the db for the items that contain the name
  if (name !== undefined) {
    const filteredVegetables = vegetables.filter(vegetable => vegetable.name.includes(name))
    res.json(filteredVegetables)
  //else we just return the vegetables
  } else {
    res.json(vegetables)
  }

})

// GET /vegetables/[id]

app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    res.json(vegetable)
  }
})

//POST /vegetables

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})


// DELETE /vegetables/[id]

app.delete('/vegetables/:id', (req, res, next) => { 
  const { vegetables } = data
  const { id } = req.params
  const index = vegetables.findIndex(vegetable => vegetable.id === id)
  if (index === -1) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    const removed = vegetables.splice(index, 1);
    res.json(removed[0])
  }
})

// PUT /vegetables/[id]

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  //get the id from the request parameters
  const { id } = req.params
  //get the name,price from the request body
  const { name, price } = req.body
  //make sure there is a vegetable that has that id
  const index = vegetables.findIndex(vegetable => vegetable.id === id)
  //if not throw an error
  if (index === -1) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else if (!(name && price)) {
    //make sure our names/prices are defined and throw error if not.
    const message = `Bad request`
    next({ status: 404, message })
  } else {
    //create our updated Veggie with the id, name, price
    const updatedVegetable = {id, name, price}
    //splice it into our DB
    vegetables.splice(index, 1, updatedVegetable)
    //return the correct status code along with the updated info
    res.json(updatedVegetable)
  }
})

// GET /fruits
// implement /fruits?name=[partial-query] in here
// accepts an optional name query string

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  //destructure the name from the request body
  const { name } = req.query
  //if we have a name, filter the db for items that contain the name
  if (name !== undefined) {
    res.json(fruits.filter(fruit => fruit.name.includes(name)))
  //else we just return the fruits
  } else {
    res.json(fruits)
  }
})

// GET /fruits[id]

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    res.json(fruit)
  }
})

//POST /fruits

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

// DELETE /fruits/[id]

app.delete('/fruits/:id', (req, res, next) => { 
  const { fruits } = data
  const { id } = req.params
  const index = fruits.findIndex(fruit => fruit.id === id)

  if (index === -1) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    const removed = fruits.splice(index, 1);
    res.json(removed[0])
  }
})

// PUT /fruits/[id]

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  //get the id from the request parameters
  const { id } = req.params
  //get the name,price from the request body
  const { name, price } = req.body
  //make sure there is a vegetable that has that id
  const index = fruits.findIndex(fruit => fruit.id === id)
  //if not throw an error
  if (index === -1) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else if (!(name && price)) {
  //make sure our names/prices are defined and throw error if not.
    const message = `Bad request`
    next({ status: 404, message })
  } else {
    //create our updated Veggie with the id, name, price
    const updatedFruit = {id, name, price}
    //splice it into our DB
    fruits.splice(index, 1, updatedFruit)
    //return the correct status code along with the updated info
    res.json(updatedFruit)
  }
})

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not ${req.method} ${req.path}`
  })
})

//err handler

app.use((err, req, res, next) => {
  const { message, status } = err
  res.status(status).json({ message })
})

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
