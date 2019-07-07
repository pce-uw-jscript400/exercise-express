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
  if(req.query.name){
    console.log(req.query.name);
    let myArray = [];
      for(let i = 0; i < vegetables.length; i++){
        if(vegetables[i].name.indexOf(req.query.name) >= 0){
          myArray.push(vegetables[i]);
        }
      }
      res.json(myArray);
  }else{
    res.json(vegetables);
  }
  
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  if(req.query.name){
    console.log(req.query.name);
    let myArray = [];
      for(let i = 0; i < fruits.length; i++){
        if(fruits[i].name.indexOf(req.query.name) >= 0){
          myArray.push(fruits[i]);
        }
      }
      res.json(myArray);
  }else{
    res.json(fruits);
  }
  
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
  const fruit = fruits.find(ft => ft.id === id)

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

app.delete('/vegetables/:id',(req, res, next) => {
  const{vegetables} = data;
  const { id } = req.params;
  let arrayLocation = -1;
  let returnElement;
  for(let i =0;i < vegetables.length; i++){
    if(vegetables[i].id === id){
      arrayLocation = i;
    }
  }
  if(arrayLocation >= 0){
     returnElement = vegetables.splice(arrayLocation, 1);
     res.status(200).json(returnElement);
  }else{
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message })
  }
})

app.delete('/fruits/:id',(req, res, next) => {
  const{fruits} = data;
  const { id } = req.params;
  let arrayLocation = -1;
  let returnElement;
  for(let i =0;i < fruits.length; i++){
    if(fruits[i].id === id){
      arrayLocation = i;
    }
  }
  if(arrayLocation >= 0){
     returnElement = fruits.splice(arrayLocation, 1);
     res.status(200).json(returnElement);
  }else{
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message })
  }
})

app.put('/vegetables', helpers.validatePut, (req, res, next) => {
  const {vegetables} = data;
  const vegetable = {...req.body}

  let arrayLocation = -1;
  
  for(let i =0;i < vegetables.length; i++){
    if(vegetables[i].id === vegetable.id){
      arrayLocation = i;
      vegetables[i].name = vegetable.name;
      vegetables[i].price = vegetable.price;
    }
  }
  if(arrayLocation >= 0){
     res.status(200).json(vegetables[arrayLocation]);
  }else{
    const message = `Could not find vegetable with ID of ${vegetable.id}`;
    next({ status: 404, message })
  }
})

app.put('/fruits', helpers.validatePut, (req, res, next) => {
  const {fruits} = data;
  const fruit = {...req.body}

  let arrayLocation = -1;
  
  for(let i =0;i < fruits.length; i++){
    if(fruits[i].id === fruit.id){
      arrayLocation = i;
      fruits[i].name = fruit.name;
      fruits[i].price = fruit.price;
    }
  }
  if(arrayLocation >= 0){
     res.status(200).json(fruits[arrayLocation]);
  }else{
    const message = `Could not find fruit with ID of ${fruit.id}`;
    next({ status: 404, message })
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
