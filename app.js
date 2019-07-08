const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [{ "id": "p7pzzZxCX", "name": "banana", "price": "0.79" }, { "id": "p7pyyZxC0", "name": "apple", "price": "1.79" }, { "id": "p7pyyZxC09", "name": "blueberry", "price": "1.79" }, { "id": "p7pyyZxC08", "name": "strawberry", "price": "1.79" }],
  vegetables: []
}

app.get('/vegetables', (req, res, next) => {
  const searchTerm = req.query.name;
  const { vegetables } = data;

  const searchedVeggies = vegetables.filter(veggie => veggie.name.includes(searchTerm));
  
  res.json(searchedVeggies);
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
  const { vegetables } = data;
  const { id } = req.params;
  const updatedVegetables = vegetables.filter(veggie => !veggie.id === id);

  res.json(updatedVegetables);
});


app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;

  const { name, price } = req.body

  const veggieIndex = vegetables.findIndex(veggie => veggie.id === id);
  if( veggieIndex === -1) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message});
  }

  vegetables[veggieIndex].name = name;
  vegetables[veggieIndex].price = price;

  res.json(vegetables[veggieIndex]);
});

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
});


app.get('/fruits', (req, res, next) => {
  const { fruits } = data;
  const searchTerm = req.query.name;

  const searchedFruits = fruits.filter(fruit => fruit.name.includes(searchTerm));
  res.json(searchedFruits);
});

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const searchedFruit = fruits.find(fruit => fruit.id === id);

  if(!searchedFruit) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(searchedFruit);
});

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const newFruit = {id: generateId(), ...req.body};

  fruits.push(newFruit);
  res.status(201).json(newFruit);
});

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;

  const newFruits = fruits.filter(fruit => fruit.id !== id);
  res.json(newFruits);
});

app.put('/fruits/:id', (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const { name, price } = req.body;

  const fruitIndex = fruits.findIndex(fruit => fruit.id === id);

  if(fruitIndex === -1) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message});
  }

  fruits[fruitIndex].name = name;
  fruits[fruitIndex].price = price;

  Response.json(fruits[fruitIndex]);
});

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
