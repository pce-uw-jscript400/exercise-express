const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [
    {
      id: 'H14ykcZcT',
      name: 'blueberries',
      price: '2.99'
    }, 
    {
      id: 'faf84ZZNF',
      name: 'strawberries',
      price: '3.99'
    }, 
    {
      id: 'p7pzzZxCX',
      name: 'banana',
      price: '0.79'
    }
  ],
  vegetables: [
    {
      id: 'AEdvQm9t_',
      name: 'green pepper',
      price: '0.99'
    }, 
    {
      id: 'JA_dIbXLW',
      name: 'red pepper',
      price: '0.99'
    },
    {
      id: '5TsEt-xfI',
      name: 'turnip',
      price: '1.79'
    },
  ]
}

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data;
  const { name } = req.query;
  let output;
  if(name){
    output = vegetables.filter(function(veggie, index, arr){
      return veggie.name.includes(name.replace(/"/g,""));
    });
  }else{
    output = vegetables;
  }
  res.json(output)
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data;
  const { name } = req.query;
  let output;
  if(name){
    output = fruits.filter(function(fruit, index, arr){
      return fruit.name.includes(name.replace(/"/g,""));
    });
  }else{
    output = fruits;
  }
  res.json(output)
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

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  let { vegetables } = data
  const { id } = req.params
  const vegetableId = vegetables.findIndex(veggie => veggie.id === id)
  let vegetable;

  if (vegetableId) {
    vegetable = vegetables[vegetableId];
    vegetable = Object.assign(vegetable, req.body);
    vegetables[vegetableId] = vegetable;
  }else{
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  let { fruits } = data
  const { id } = req.params
  const fruitId = fruits.findIndex(fruit => fruit.id === id)
  let fruit;

  if (fruitId) {
    fruit = fruits[fruitId];
    fruit = Object.assign(fruit, req.body);
    fruits[fruitId] = fruit;
  }else{
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(fruit)
})

app.delete('/vegetables/:id', (req, res, next) => {
  let { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (vegetable) {
    vegetables = vegetables.filter(function(veggie, index, arr){
      return veggie.id !== id;
    });
  }else{
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id === id)

  if (fruit) {
    data.fruits = fruits.filter(function(fruit, index, arr){
      return fruit.id !== id;
    });
  }else{
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

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
