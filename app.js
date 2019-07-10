const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [{id:'3', name:'melons', price:1.50},{id:'33', name:'limes', price:2.50},{id:'23', name:'apples', price:3.50},{id:'24', name:'berries', price:1.25}],
  vegetables: [{id:'1', name:'carrots', price:1.50},{id:'11', name:'Red Peppers', price:2.50},{id:'111', name:'Bell Peppers', price:3.50},{id:'2', name:'peas', price:1.25}]
}

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  res.json(vegetables)
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  res.json(fruits)
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
  const fruit = fruits.find(fru => fru.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(fruit)
})

app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(fru => fru.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    for (i=0; i<vegetables.length; i++) {
      if (vegetables[i].id === id) {
        if(!req.body.name === '') {
          vegetables[i].name = req.body.name;
        }
        if(!req.body.price === '') {
          vegetables[i].price = req.body.price;
        }      
      }
    }
    res.json(vegetable)
  }
})

app.put('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fru => fru.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    for (i=0; i<fruits.length; i++) {
      if (fruits[i].id === id) {
        if(!req.body.name === "") {
          fruits[i].name = req.body.name;
        }
        if(!req.body.price === '') {
          fruits[i].price = req.body.price;
        }      
      }
    }
    res.json(fruit)
  }
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
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veg => veg.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    for (i=0; i<vegetables.length; i++) {
      if (vegetables[i].id === id) {
        vegetables.splice(i, 1);
      }
      }
    const message = `vegetable deleted`
    next({ status: 200, message })
    }
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fru => fru.id === id)

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    for (i=0; i<fruits.length; i++) {
      if (fruits[i].id === id) {
        fruits.splice(i, 1);
      }
      }
    const message = `fruit deleted`
    next({ status: 200, message })
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

//vegetables[i].name = req.body.name;
//vegetables[i].price = req.body.price;