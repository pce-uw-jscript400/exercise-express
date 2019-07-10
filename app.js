const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [],
  vegetables: [
    { "id": "AEdvQm9t_", "name": "green pepper", "price": "0.99" },
    { "id": "JA_dIbXLW", "name": "red pepper", "price": "0.99" },
    { "id": "5TsEt-xfI", "name": "turnip", "price": "0.79" }
  ]
}

// Vegetables

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const { name } = req.query
  const vegetable = vegetables.filter(veggie => veggie.name.includes(name))

  if (!name) {
    const message = `Could not find vegetable with name of ${name}`
    next({ status: 404, message })
  }
  
  res.json(vegetable)
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
  const vegetable = vegetables.find(veggie => veggie.id === id)

  for(let i = 0; i < data.vegetables.length; i++) {
    if (vegetables[i].id === id) {
      vegetables.splice(i, 1);
      const message = `${vegetable.name} with ID ${id} has been deleted!`
      next({ status: 200, message })
    }
  }

  const message = `Could not find vegetable with ID of ${id}`
  next({ status: 404, message })
})

app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  let veggie;
  for(let i = 0; i < data.vegetables.length; i++) {
    if (vegetables[i].id === id) {
      veggie.name = req.body.name
      veggie.price = req.body.price

      const message = `${vegetable.name} with ID ${id} has been updated!`
      next({ status: 200, message })
    } 
  }

  const message = `Could not find vegetable with ID of ${id}`
  next({ status: 404, message })

})

// Fruits

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query
  const fruit = fruits.filter(fruitItem => fruitItem.name.includes(name))

  if (!name) {
    const message = `Could not find fruit with name of ${name}`
    next({ status: 404, message })
  }
  
  res.json(fruit)
})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruitItem => fruitItem.id === id)

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
  const fruit = fruits.find(fruitItem => fruitItem.id === id)

  for(let i = 0; i < data.fruits.length; i++) {
    if (fruits[i].id === id) {
      fruits.splice(i, 1);
      const message = `${fruit.name} with ID ${id} has been deleted!`
      next({ status: 200, message })
    }
  }

  const message = `Could not find fruit with ID of ${id}`
  next({ status: 404, message })
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
