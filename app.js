const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

//Adding some temp fruit and veggies to data for testing so that i dont have to keep making a POST request in order to get data to play with.
const data = {
  fruits: [{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }],
  vegetables: [{ "id": "AEdvQm9t_", "name": "green pepper", "price": "0.99" },
  { "id": "JA_dIbXLW", "name": "red pepper", "price": "0.99" }]
}

//GET - /vegetables route
app.get('/vegetables', (req, res, next) => {
  //Destructures the request query and pulls out the name
  const { name } = req.query

  //Destructure the vegetables array from the data object
  const { vegetables } = data

  //If the query name is empty
  if(!name){
    return res.json(vegetables)
  }

  //If there is a value in the query name
  //Filter the data and only return the objects that include the partial name
  const vegetable = vegetables.filter(veggie => veggie.name.includes(name))

  //Return the filtered vegetables
  res.json(vegetable)

})


//GET - /vegetables/id route
app.get('/vegetables/:id', (req, res, next) => {
  //Destructure the vegetables array from the data object
  const { vegetables } = data
  //Destructures the request parameters and pulls out the id
  const { id } = req.params
  //Loops through the vegetables array and finds the object that has matching id from the params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  //If the certain vegetable doesnt exist, output the could not find message and status code
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  //If certain vegetable does exist, then output the vegetable we found earlier
  res.json(vegetable)
})


//DELETE - /vegetables/id route
app.delete('/vegetables/:id', (req, res, next) => {
  //Destructure the vegetables array from the data object
  const { vegetables } = data
  //Destructures the request parameters and pulls out the id
  const { id } = req.params

  //Loops through the vegetables array and finds the object that has matching id from the params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  //If id of vegetables being deleted does not exist in the data
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  //Filters the array of vegetables and returns new array excluding the object with id matching our params
  const filteredVegies = vegetables.filter(vegie => vegie.id !== id)
  //consoling out the leftover vegetable
  console.log(filteredVegies)
  //Responds with the object that is being deleted
  res.json(vegetable)

})


//PUT - /vegetables/id route
app.put('/vegetables/:id', helpers.validate, (req, res, next) => {

  const { vegetables } = data
  //Destructure id from req.params
  const { id } = req.params
  //Destructure name and price from req.body
  const  {name, price} = req.body
  //Check if certain id of veggie exists in vegetables array
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  //Update veggie name with new name from req.body
  vegetable["name"] = name
  //Update veggie price with new price from req.body
  vegetable["price"] = price

  //Respond with updated vegetable
  res.status(201).json(vegetable)

})




//POST - /vegetables route
app.post('/vegetables', helpers.validate, (req, res, next) => {
  //Destructure vegetables array from data object
  const { vegetables } = data
  //Creates a new json object with the object that is from the request body and adds an id property using the generateId function from the shortid package
  const vegetable = { id: generateId(), ...req.body }

  //Adds the new veggie object into the vegetables array
  vegetables.push(vegetable)
  //Returns the new veggie object and sets the status code to 201
  res.status(201).json(vegetable)
})




//GET - /fruits route
app.get('/fruits', (req, res, next) => {
  //Pulls and destructures the name request query
  const { name } = req.query

  //Destructure the vegetables array from the data object
  const { fruits } = data

  //If the query name is empty
  if(!name){
    return res.json(fruits)
  }

  //If there is a value in the query name
  //Filter the data and only return the objects that include the partial name
  const fruit = fruits.filter(f => f.name.includes(name))
  //Return the filtered vegetables
  res.json(fruit)

})



//GET - /fruits/id route
app.get('/fruits/:id', (req, res, next) => {
  //Destructure fruits array from data object
  const { fruits } = data
  //Destructure req.params and pull out the id from the parameters
  const { id } = req.params
  //Loop through the fruits array and find the fruit that has the id matching the params
  const fruit = fruits.find(f => f.id === id)

  //If the id of the fruit doesnt exist, output message and status code 404
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  //If fruit does exist, output the fruit object
  res.json(fruit)
})


//DELETE - /fruits/id route
app.delete('/fruits/:id', (req, res, next) => {
  //Destructure fruits array from data object
  const { fruits } = data
  //Destructure req.params and pull out the id from the parameters
  const { id } = req.params

  //Loop through the fruits array and find the fruit that has the id matching the params
  const fruit = fruits.find(f => f.id === id)

  //If id of fruit being deleted does not exist in the data
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  //Filters the array and returns new array with filtered objects
  const filteredFruits = fruits.filter(f => f.id !== id)

  //consoling out the leftover fruits
  console.log(filteredFruits)
  //Responds with the object that is being deleted
  res.json(fruit)

})



//PUT - /fruits/id route
app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  //Destructure fruits array from data object
  const { fruits } = data

  //Destructure id from req.params
  const { id } = req.params

  //Destructure name and price from req.body
  const  {name, price} = req.body

  //Check if certain id of fruit exists in fruits array
  const fruit = fruits.find(f => f.id === id)

  //If id of fruit being udpated does not exist in the data
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }

  //Update fruit name with new name from req.body
  fruit["name"] = name
  //Update fruit price with new price from req.body
  fruit["price"] = price

  //Respond with updated fruit
  res.status(201).json(fruit)

})



//POST - /fruits route
app.post('/fruits', helpers.validate, (req, res, next) => {
  //Destructure fruits array from data object
  const { fruits } = data
  //Creates a new json object with the object that is from the request body and adds an id property using the generateId function from the shortid package
  const fruit = { id: generateId(), ...req.body }

  //Adds the new fruit object into the fruits array
  fruits.push(fruit)
  //Returns the new fruit object and sets the status code to 201
  res.status(201).json(fruit)
})




//Middleware to handle request to non existing endpoints
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not ${req.method} ${req.path}`
  })
})



//Error handler passed from the helpers.js file
app.use((err, req, res, next) => {
  const { message, status } = err
  res.status(status).json({ message })
})



const listener = () => console.log(`Listening on Port ${PORT}!`)
app.listen(PORT, listener)
