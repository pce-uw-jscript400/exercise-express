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
  const vegetable = vegetables.filter(veggie => veggie.name.includes(name))

  if (!name) {
    res.json(vegetables)
  } else {
    res.status(200).json(vegetable)
  }
  res.json({ status: 200, response: veggie })

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


app.delete('/vegetables/:id', (req, res, next) => {
  let { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    vegetables = vegetables.filter(veggie => veggie.id !== id)
  }
  res.json(vegetable)
});


app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    veggie.name = req.body.name
    veggie.price = req.body.price

    res.status(200).json(veggie);
  }
});


app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})


app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query
  const fruit = fruits.filter(fruit => fruit.name.includes(name))

  if (!name) {
    res.json(fruits)
  } else {
    res.status(200).json(fruit)
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


app.delete('/fruits/:id', (req, res, next) => {
  let { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    fruits = fruits.filter(fruit => fruit.id !== id)
  }
  res.json(vegetable)
});


app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    fruit.name = req.body.name
    fruit.price = req.body.price

    res.status(200).json(fruit);
  }
});

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
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
