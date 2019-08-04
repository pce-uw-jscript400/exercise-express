const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()
// const fs = require('fs');
// const contents = fs.readFileSync('./data/post.json', 'utf-8')
// const data = JSON.parse(contents)

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())
 
const data = {
  fruits: [
    { "id": "p7pzzZxCX", "name": "banana", "price": "0.79" },
    { "id": "H14ykcZcT", "name": "blueberries", "price": "2.99" },
    { "id": "faf84ZZNF", "name": "strawberries", "price": "3.99" }
  ],
  vegetables: [
    { "id": "AEdvQm9t_", "name": "green pepper", "price": "0.99" },
    { "id": "JA_dIbXLW", "name": "red pepper", "price": "0.99" },
    { "id": "5TsEt-xfI", "name": "turnip", "price": "0.79" }
  ]
}

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  // console.log(req.query.name)
  if(typeof req.query.name != 'undefined'){
    response = vegetables.filter( veggie => {
      // console.log(veggie.name)
      if (veggie.name.includes(req.query.name)){
        // console.log("Is this working")
        return veggie;
      }
    });
  } else {
    response = vegetables
  }
  // console.log(`${response} Be something` )
  res.json(response)
  
})

app.get('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)
  console.log(id)
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)
  const deleteIndex = vegetables.indexOf(vegetable)
  if (!vegetable) {
    const message = `Vegetable could not be found.`
    next({ status: 404, message })
  }
  const response = vegetables.splice(deleteIndex, 1)
  res.json({ status: 200, response })
})

app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)
  const vegetableIndex = vegetables.indexOf(vegetable)
  const updateItems = req.body

  if (!vegetable) {
    const message = `Vegetable could not be found.`
    next({ status: 404, message })
  }

  const response = vegetables.splice(vegetableIndex, 1, updateItems) 

  res.json({ status: 200, response })
  
})

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  console.log(vegetable)
  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  // console.log(req.query.name)
  if(typeof req.query.name != 'undefined'){
    response = fruits.filter( fruit => {
      // console.log(veggie.name)
      if (fruit.name.includes(req.query.name)){
        // console.log("Is this working")
        return fruit;
      }
    });
  } else {
    response = fruits
  }
  // console.log(`${response} Be something` )
  res.json(response)
})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruitable = fruits.find(fruit => fruit.id === id)
  console.log(id)
  if (!fruitable) {
    const message = `Fruit could not be found.`
    next({ status: 404, message })
  }

  res.json(fruitable)
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruitable = fruits.find(fruit => fruit.id === id)
  const deleteIndex = fruits.indexOf(fruitable)
  if (!fruitable) {
    const message = `Fruit could not be found.`
    next({ status: 404, message })
  }
  const response = fruits.splice(deleteIndex, 1)
  res.json({ status: 200, response })
})

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ... req.body }

  console.log(fruit)

  fruits.push(fruit)
  res.status(201).json(fruits)
})

app.put('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruitable = fruits.find(fruit => fruit.id === id)
  const fruitableIndex = fruits.indexOf(fruitable)
  const updateItems = req.body

  if (!fruitable) {
    const message = `Vegetable could not be found.`
    next({ status: 404, message })
  }

  const response = fruits.splice(fruitableIndex, 1, updateItems) 

  res.json({ status: 200, response })
  
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
