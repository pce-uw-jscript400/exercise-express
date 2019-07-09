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

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const { name } = req.query
  if (name) {
    const queriedVegetables = vegetables.filter(function(vegetable){
      return vegetable.name.toLowerCase().includes(name)
    })
    res.json(queriedVegetables)
  } else {
    res.json(vegetables)
  }
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query
  if (name) {
    const queriedFruits = fruits.filter(function(fruit){
      return fruit.name.toLowerCase().includes(name)
    })
    res.json(queriedFruits)
  } else {
    res.json(fruits)
  }
})

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

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(fruit)
})

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

app.delete('/vegetables/:id', (req, res, next) => {
  const { id } = req.params
  const { vegetables } = data
  const veggieIndex = vegetables.findIndex(veggie => veggie.id == id)
  if (veggieIndex >= 0) {
    res.json(vegetables.splice(veggieIndex, 1)[0])
  } else {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message})
  }
})

app.delete('/fruits/:id', (req, res, next) => {
  const { id } = req.params
  const { fruits } = data
  const fruitIndex = fruits.findIndex(fruit => fruit.id == id)
  if (fruitIndex >= 0) {
    res.json(fruits.splice(fruitIndex, 1)[0])
  } else {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message})
  }
})

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { id } = req.params
  const { vegetables } = data
  const veggieIndex = vegetables.findIndex(veggie => veggie.id == id)
  if (veggieIndex >= 0) {
    vegetables[veggieIndex] = { id: vegetables[veggieIndex].id, ...req.body }
    res.json(vegetables[veggieIndex])
  } else {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message})
  }
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { id } = req.params
  const { fruits } = data
  const fruitIndex = fruits.findIndex(fruit => fruit.id == id)
  if (fruitIndex >= 0) {
    fruits[fruitIndex] = { id: fruits[fruitIndex].id, ...req.body }
    res.json(fruits[fruitIndex])
  } else {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message})
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
