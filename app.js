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
//GET vegetables
app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const { name } = req.query
  const vegetable = vegetables.filter(veggie => veggie.name.includes(name))
  if (!name) {
    res.json(vegetables)
    //If there are no vegetables that match, just return an empty array
  } else {
    res.status(200).json(vegetable)
    //Return a list of all vegetables where the query is included somewhere in the name
  }
})
//GET fruites
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
//delete vegetable
app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  // Get the id through req.params.id of the object we are going to delete
  const vegetable = vegetables.find(veggie => veggie.id == id); 
  // As we have only Id of the object, we want to get the entire object from the array. 
  // find() will fetch the object from the array whose id is equal to id and assign it to vegetable.
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
    // if no id found return error message
  }
  else {
    const deleteIndex = vegetables.indexOf(vegetable); 
    //Find the index of the object fetched from the JSON array.
    vegetables.splice(deleteIndex,1); 
    // Splice/ remove the object from the JSON Array.
    res.status(200).json(vegetable); 
    //return status 200 with deleted object
  }
});

//delete fruit
app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id == id); 
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    const deleteIndex = fruits.indexOf(fruit); 
    fruits.splice(deleteIndex,1); 
    res.status(200).json(fruit); 
  }
});

// get vegetable with Id 
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

// get fruit with Id 
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

//Update vegetables
app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id == id); 
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    const updateIndex = vegetables.indexOf(vegetable); 
    vegetables[updateIndex] = { id: id, ...req.body }
    res.status(200).json(vegetables[updateIndex]); 
    //update the resource with the new information. Return a status code of *200*.
  }
});


//Update fruits
app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(fruit => fruit.id == id); 
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else {
    const updateIndex = fruits.indexOf(fruit); 
    fruits[updateIndex] = { id: id, ...req.body }
    res.status(201).json(fruits[updateIndex]); 
  }
});

//create new vegetable
app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

//create new fruit
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
//error handler
app.use((err, req, res, next) => {
  const { message, status } = err
  res.status(status).json({ message })
})

const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
