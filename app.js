const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }],
  vegetables: [  { "id": "AEdvQm9t_", "name": "green pepper", "price": "0.99" },
  { "id": "JA_dIbXLW", "name": "red pepper", "price": "0.99" }]
}

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data;
  const { name } = req.query;
  const foundVegetables = vegetables.filter(veggie => veggie.name.includes(name));

  if(!name) {
    res.json(vegetables)
  } 
  else {
    res.json(foundVegetables);
  }
})

app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(vegetable => vegetable.id === id)

  if (!vegetable) {
    const message = `Vegetable ID of ${id} not found`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)

  res.status(200).json({
    message: 'Handling POST requests to /vegetables'
  })
})

app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params

  const vegetableIndex = vegetables.findIndex(veggie => veggie.id == id)
  if (vegetableIndex >= 0) {
    res.json(vegetables.splice(vegetableIndex, 1)[0])
  } else {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message})
  }
})

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    const vegIndex = vegetables.indexOf(vegetable);
    vegetables[vegIndex] = { id: id, ...req.body }
    res.status(200).json(vegetables[vegIndex]);
  }

})

//Fruits
app.get('/fruits', (req, res, next) => {
  const { fruits } = data;
  const { name } = req.query;
  const foundFruits = fruits.filter(fruit => fruit.name.includes(name));

  if(!name) {
    res.json(fruits)
  } 
  else {
    res.json(foundFruits);
  }
})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params

  const fruit = fruits.find(fruit => fruit.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    const fruitIndex = fruits.indexOf(fruit);
    fruits[fruitIndex] = { id: id, ...req.body }
    res.status(200).json(fruits[fruitIndex]);
  }
})

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)

  res.status(200).json({
    message: 'Handling POST requests to /fruits'
  })
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params

  const fruitIndex = fruits.findIndex(fruit => fruit.id == id)
  if (fruitIndex >= 0) {
    res.json(fruits.splice(fruitIndex, 1)[0])
  } else {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message})
  }
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  const updatedFruits = fruits.filter(fruits => fruits.id !== id)

  console.log(updatedFruits)

  res.json(fruit)

  res.status(200).json({
    message: 'Deleted message'
  })
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
