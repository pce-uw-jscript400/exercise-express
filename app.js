const { NODE_ENV = "development", PORT = 5000 } = process.env;
const express = require("express");
const { generate: generateId } = require("shortid");
const helpers = require("./src/helpers");
const app = express();

if (NODE_ENV === "development") app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

const data = {
  fruits: [],
  vegetables: []
};

// VEGGIE ROUTES

app.get("/vegetables", (req, res, next) => {
  const { vegetables } = data;
  // Query for name
  const name = req.query.name;
  // Use array .filter() method to return a new array if there's a record with a matching name,
  // otherwise just return the available vegetable data if no query is specified (i.e. name constant is falsey).
  const filteredVegetables = vegetables.filter(
    vegetable => !name || vegetable.name.includes(name)
  );

  res.json(filteredVegetables);
});

app.get("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  // Use array .find() method to locate a successful id match in the available vegetable data.
  const vegetable = vegetables.find(produce => produce.id === id);
  // If the vegetable const is falsey, then throw 404 error, else return the response with status 200 and the vegetable record.
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(200).json(vegetable);
});

app.post("/vegetables", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const vegetable = { id: generateId(), ...req.body };

  vegetables.push(vegetable);
  res.status(201).json(vegetable);
});

app.delete("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  // Again, using the array .find() method to locate a successful id match in the available vegetable data.
  const vegetable = vegetables.find(produce => produce.id === id);
  // If the vegetable const is falsey, then throw 404 error, else return the response with status 200 and the vegetable record to be deleted.
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }
  res.status(200).json(vegetable);
});

app.put("/vegetables/:id", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  // Destructor values of the request body
  const { name, price } = req.body;
  // Again, using the array .find() method to locate a successful id match in the available vegetable data.
  const vegetable = vegetables.find(produce => produce.id === id);
  // If the vegetable const is falsey, then throw 404 error,
  // else return the response with status 200 and the vegetable updated record.
  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }
  // Updates the object with new values
  vegetable.name = name;
  vegetable.price = price;

  res.status(200).json(vegetable);
});

// FRUIT ROUTES

app.get("/fruits", (req, res, next) => {
  const { fruits } = data;
  // Query for name
  const name = req.query.name;
  // Use array .filter() method to return a new array if there's a record with a matching name,
  // otherwise just return the available fruit data if no query is specified (i.e. name constant is falsey).
  const filteredFruits = fruits.filter(
    fruit => !name || fruit.name.includes(name)
  );

  res.json(filteredFruits);
});

app.get("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  // Use array .find() method to locate a successful id match in the available fruit data.
  const fruit = fruits.find(produce => produce.id === id);
  // If the fruit const is falsey, then throw 404 error, else return the response with status 200 and the fruit record.
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(200).json(fruit);
});

// I modeled this off of the example code provided.
app.post("/fruits", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const fruit = { id: generateId(), ...req.body };

  fruits.push(fruit);
  res.status(201).json(fruit);
});

app.delete("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  // Again, using the array .find() method to locate a successful id match in the available fruit data.
  const fruit = fruits.find(produce => produce.id === id);
  // If the fruit const is falsey, then throw 404 error, else return the response with status 200 and the fruit record.
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(200).json(fruit);
});

app.put("/fruits/:id", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  // Destructor values of the request body
  const { name, price } = req.body;
  // Using the array .find() method to locate a successful id match in the available fruit data.
  const fruit = fruits.find(produce => produce.id === id);
  // If the fruit const is falsey, then throw 404 error, else return the response with status 200 and the fruit updated record.
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }
  // Updates the object with new values
  fruit.name = name;
  fruit.price = price;

  res.status(200).json(fruit);
});

// ERROR MIDDLEWARE

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not ${req.method} ${req.path}`
  });
});
// Error handler
app.use((err, req, res, next) => {
  const { message, status } = err;
  res.status(status).json({ message });
});

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
