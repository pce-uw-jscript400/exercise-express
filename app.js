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

// get vegetables, by name or all
app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const { name } = req.query
  // check for all vegetables that include the name
  const vegetable = vegetables.filter(veggie => veggie.name.includes(name))

  // if there isn't a name specified, return all vegetables
  if (!name) {
    res.status(200).json(vegetables)
  } else {
    // otherwise, return specific vegetable(s) from match
    res.status(200).json(vegetable)
  } 
})

// get vegetable by ID
app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  // match vegetable by ID
  const vegetable = vegetables.find(veggie => veggie.id === id)

  // if there is no match, return error
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    // return vegetable that matches
    res.status(200).json(vegetable)
  }
})

// create a new vegetable
app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

// delete a vegetable
app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params

  // if the vegetable exists, delete from the array, return the vegetable
  if (vegetables.find(veggie => veggie.id === id)) {
    const vegetable = vegetables.splice(vegetables.findIndex(veggie => veggie.id === id), 1)
    res.status(200).json(vegetable)
  } else {
    // if the vegetable is not found, return error message and status code
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
})

// update existing vegetable
app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params

  // if the ID doesn't match an existing vegetable, give error
  if ( !id ) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    // otherwise, find existing vegetable using ID
    vegIndex = vegetables.findIndex(veggie => veggie.id === id)
    // update vegetable with new data
    vegetables[vegIndex] = { id: id, ...req.body }
    // return updated vegetable info
    res.status(201).json(vegetables[vegIndex])
  }
})

// get fruits, by name or all
app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query
  // check for all fruits that include the name
  const fruit = fruits.filter(fruit => fruit.name.includes(name))

  // if there isn't a name specified, return all fruits
  if (!name) {
    res.status(200).json(fruits)
  } else {
    // otherwise, return fruit(s) that include name
    res.status(200).json(fruit)
  } 
})

// get fruit by ID
app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  // check for fruit by ID
  const fruit = fruits.find(fruit => fruit.id === id)

  // if there is no fruit that matches the id, return error
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    // otherwise, return the fruit
    res.status(200).json(fruit)
  }
})

// create new fruit
app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

// delete fruit
app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params

  // if the fruit exists, delete from the array, return the fruit
  if (fruits.find(fruit => fruit.id === id)) {
    const fruit = fruits.splice(fruits.findIndex(fruit => fruit.id === id), 1)
    res.status(200).json(fruit)
  } else {
    // if the fruit is not found, return error message and status code
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
})

// update existing fruit
app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params

  // if the ID doesn't match an existing fruit, give error
  if ( !id ) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    // otherwise, find existing fruit using ID
    fruitIndex = fruits.findIndex(fruit => fruit.id === id)
    // update fruit with new data
    fruits[fruitIndex] = { id: id, ...req.body }
    // return updated fruit info
    res.status(201).json(fruits[fruitIndex])
  }
})

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not ${req.method} ${req.path}`
  })
})

app.use((err, req, res, next) => {
  const { message, status } = err
  res.status(status).json({ message })
})

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
