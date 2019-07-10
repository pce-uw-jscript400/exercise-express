const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const _ = require('lodash');
const app = express()


if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())


// Use Mock Data if in development enviro
if (NODE_ENV === 'development') {
  const data = require('./mock');
} else {
  const data = {
    fruits: [],
    vegetables: []
  }
}

/**
 * Vegetable Routes 
 */

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  if(req.query.name ) {
    let matches = _.filter(vegetables, (vegetable) => {
      return vegetable.name.indexOf(req.query.name) > -1;
    });
    res.json(matches)
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
  const vegetableIdx = vegetables.findIndex(veggie => veggie.id == id)
  if (vegetableIdx < 0) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  const vegetable = vegetables.splice(vegetableIdx,1);
  res.json(vegetable)
})

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetableIdx = vegetables.findIndex(vegetable => vegetable.id == id)
  if (vegetableIdx < 0) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  const vegetable = {id: req.params.id, name: req.body.name, price:req.body.price}
  vegetables.splice(vegetableIdx,1,vegetable);
  res.json(vegetable)
})


/**
 * Fruit Routes
 */

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  if(req.query.name ) {
    let matches = _.filter(fruits, (fruit) => {
      return fruit.name.indexOf(req.query.name) > -1;
    });
    res.json(matches)
  } else {
    res.json(fruits)
  }
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

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruitIdx = fruits.findIndex(fruit => fruit.id == id)
  if (fruitIdx < 0) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  
  const fruit = fruits.splice(fruitIdx,1);
  res.json(fruit)
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruitIdx = fruits.findIndex(fruit => fruit.id == id)
  if (fruitIdx < 0) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  const fruit = {id: req.params.id, name: req.body.name, price:req.body.price}
  fruits.splice(fruitIdx,1,fruit);
  res.json(fruit)
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
