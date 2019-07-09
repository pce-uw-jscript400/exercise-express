const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()
const expressValidator = require('express-validator')


if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [],
  vegetables: []
}
// Routes that Delete 
app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data 
  const { id } = req.params
  const results = vegetables.filter(veg => veg.id.indexOf(id) != -1 );

  if (results.length == 0) {
    status = 404
    message = "Could not find vegetable with ID of " + id
  } else {
    status = 200
    message = results
    vegetables.splice(results, 1)
  }
  res.status(status).json(message)

})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data 
  const { id } = req.params
  const results = fruits.filter(fru => fru.id.indexOf(id) != -1 );

  if (results.length == 0) {
    status = 404
    message = "Could not find fruit with ID of " + id
  } else {
    status = 200
    message = results
    fruits.splice(results, 1)
  }
  res.status(status).json(message)

})

// Routes that read
app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const name = (req.query.name).replace(/['"]+/g, '');
  const results = vegetables.filter(veg => veg.name.indexOf(name) != -1 );
  
  res.status(201).json(results)

})

app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)
 
  res.json({content})
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  
  res.status(200).json(fruits)

})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const vegetable = fruits.find(fru => fru.id === id)
 
  res.json({content})
})


// Routes that Create
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


// Routes that Update
app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data 
  const { id } = req.params
  const vegetable = { id: id, ...req.body }
  const results = vegetables.filter(veg => veg.id.indexOf(id) != -1 );

  //insert validation logic

  if (results.length == 0) {
    status = 404
    message = "Could not find vegetable with ID of " + id
  } else {
    status = 200
    vegetables.push(vegetable)
    message = vegetable
  }
  res.status(status).json(message)
})

app.put('/fruits/:id', (req, res, next) => {
  const { fruits } = data 
  const { id } = req.params
  const fruit = { id: id, ...req.body }
  const results = fruits.filter(fru => fru.id.indexOf(id) != -1 );

  if (results.length == 0) {
    status = 404
    message = "Could not find fruit with ID of " + id
  } else {
    status = 200
    fruits.push(fruit)
    message = fruit
  }
  res.status(status).json(message)
})



app.use((err, req, res, next) => {
  const { message, status } = err
  res.status(status).json({ message })
})

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
