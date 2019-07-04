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

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  res.json(vegetables)
})

// GET /vegetables/[id]

app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

// GET /fruits
// implement /fruits?name=[partial-query] in here

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  req.json(fruits)
})

// GET /fruits[id]

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruits = fruits.find(fruit => fruit.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(fruit)
})

//POST /vegetables

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

//POST /fruits

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

// PUT /vegetables/[id]

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  
})

// PUT /fruits/[id]

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  
})

// DELETE /vegetables/[id]

app.delete('/vegetables/:id', (req, res, next) => { 
  const { vegetables } = data
  const { id } = req.params
  const index = vegetables.indexOf(veggie => veggie.id === id)

  if (index === -1) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  const removed = vegetables.splice(index, 1);
  res.json(removed)

})

// DELETE /fruits/[id]

app.delete('/fruits/:id', (req, res, next) => { 
  const { fruits } = data
  const { id } = req.params
  const index = fruits.indexOf(fruit => fruit.id === id)

  if (index === -1) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  const removed = fruits.splice(index, 1);
  res.json(removed)

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
