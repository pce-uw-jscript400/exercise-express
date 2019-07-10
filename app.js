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

  if(name) {
    res.json(vegetables.filter(v => v.name.includes(name)))
  } else {
    res.json(vegetables)
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

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const pos = vegetables.findIndex(veggie => veggie.id === id)

  if (pos < 0) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    const removedVeg = vegetables[pos]
    vegetables.splice(pos,1)
    res.json(removedVeg)
  }
})

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    vegetable.name = req.body.name
    vegetable.price = req.body.price
    res.json(vegetable)
  }
})

// Fruits

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query

  if(name) {
    res.json(fruits.filter(f => f.name.includes(name)))
  } else {
    res.json(fruits)
  }
})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(f => f.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(fruit)
})

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const pos = fruits.findIndex(f => f.id === id)

  if (pos < 0) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    const removedFruit = fruits[pos]
    fruits.splice(pos,1)
    res.json(removedFruit)
  }
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(f => f.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    fruit.name = req.body.name
    fruit.price = req.body.price
    res.json(fruit)
  }
})

// end fruits

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
