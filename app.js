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
  const name = req.query.name;
  const filteredVeggies = vegetables.filter(
    veggie => !name || veggie.name.includes(name)
  );

  res.json(filteredVeggies);
});

app.get("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  const vegetable = vegetables.find(produce => produce.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(vegetable);
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
  const vegetable = vegetables.find(produce => produce.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(200).json(vegetable);
});

// FRUIT ROUTES

app.get("/fruits", (req, res, next) => {
  const { fruits } = data;
  const name = req.query.name;
  const filteredFruits = fruits.filter(
    fruit => !name || fruit.name.includes(name)
  );

  res.json(filteredFruits);
});

app.get("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const fruit = fruits.find(produce => produce.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(200).json(fruit);
});

app.post("/fruits", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const fruit = { id: generateId(), ...req.body };

  fruits.push(fruit);
  res.status(201).json(fruit);
});

app.delete("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const fruit = fruits.find(produce => produce.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

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
