const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
let veggies = 'data/veggies.json'
let fruit = 'data/fruit.json'
let fs = require ('fs');
let veggieContent =  fs.readFileSync(veggies, 'utf-8');
let vegtables = JSON.parse(veggieContent);
let fruitContent =  fs.readFileSync(fruit, 'utf-8');
let allTheFruit = JSON.parse(fruitContent);
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: allTheFruit,
  vegetables: vegtables
}

app.get('/vegetables', (req, res, next) => {
  //const { vegetables } = data
  const { name } = req.query
  const vegetable = vegtables.filter(veggie => !name || veggie.name.includes(name))
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

app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  } else {
    vegtables.splice(vegetables.indexOf(vegetable), 1);
    let stringy = JSON.stringify(vegetables);
    fs.writeFileSync(veggies, stringy);
    res.json(vegetable)
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
    Object.assign(vegetable, req.body);
    let stringy = JSON.stringify(vegetables);
    fs.writeFileSync(veggies, stringy);
    res.json(vegetable)
    next( {status: 200} )
  }
})

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

app.get('/fruits', (req, res, next) => {
  const { name } = req.query
  const fruit = fruits.filter(f => !name || f.name.includes(name))
  res.json(fruit)
  next( {status: 200} )
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
  next( {status: 200})

})

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const produce = { id: generateId(), ...req.body }
  fruits.push(produce)
  let stringy = JSON.stringify(fruits);
  fs.writeFileSync(fruit, stringy);
  res.json(produce)
  next( {status: 200})
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const produce = fruits.find(f => f.id === id)
  if (!produce) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  } else {
    Object.assign(produce, req.body);
    let stringy = JSON.stringify(fruits);
    fs.writeFileSync(fruit, stringy);
    res.json(produce)
  }
  next( {status: 200} )

})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const produce = fruits.find(f => f.id === id)

  if (!produce) {
   const message = `Could not find fruit with ID of ${id}`
   next({ status: 404, message })
 }
 if (produce){
   fruits.splice(fruits.indexOf(produce), 1);
   let stringy = JSON.stringify(fruits);
   fs.writeFileSync(fruit, stringy);
   res.json(produce)
}
   next( {status: 200})
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


