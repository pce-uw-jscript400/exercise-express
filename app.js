const { NODE_ENV = "development", PORT = 5000 } = process.env;
const express = require("express");
const { generate: generateId } = require("shortid");
const helpers = require("./src/helpers");
const app = express();

if (NODE_ENV === "development") app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

const data = {
  fruits: [
    {
      id: "hxVQBS8vO",
      name: "banana",
      price: "0.50"
    },
    {
      id: "X8tf7Fl_j",
      name: "strawberry",
      price: "4.33"
    },
    {
      id: "303zEauDV",
      name: "blueberry",
      price: "3.63"
    }
  ],
  vegetables: [
    {
      id: "toQxYtAr8",
      name: "carrot",
      price: "1.44"
    },
    {
      id: "mVCiqQMox",
      name: "peppers",
      price: "1.50"
    }
  ]
};
//GET http://localhost:5000/vegetables?name=peppers
//GET http://localhost:5000/vegetables
app.get("/vegetables", (req, res, next) => {
  const { vegetables } = data;
  const vegName = req.query.name;
  const matchedVegetables = vegetables.filter(veggie =>
    veggie.name.includes(vegName)
  );
  //if /vegetables return the whole array if no match return empty array
  let message = !vegName ? vegetables : matchedVegetables;
  res.json(message);
});

app.get("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(vegetable);
});

//DELETE http://localhost:5000/vegetables/toQxYtAr8
//DELETE http://localhost:5000/vegetables/toQx
app.delete("/vegetables/:id", (req, res, next) => {
  const status = 200;
  const { id } = req.params;
  const { vegetables } = data;
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  const message = `Deleted message ${id}`;
  res.status(status).json(message);
});

//PUT http://localhost:5000/vegetables/toQxYtAr8
//PUT http://localhost:5000/vegetables/to
app.put("/vegetables/:id", (req, res, next) => {
  const status = 200;
  const { id } = req.params;
  const { vegetables } = data;
  const vegetable = vegetables.find(veggie => veggie.id === req.params.id);
  let message = vegetable;

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  } else if (!req.body.name || !req.body.price) {
    message = "Bad request";
  } else {
    vegetable.name = req.body.name;
    vegetable.price = req.body.price;
  }

  res.status(status).json(message);
});

app.post("/vegetables", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const vegetable = { id: generateId(), ...req.body };

  vegetables.push(vegetable);
  res.status(201).json(vegetable);
});

//////Fruit

//GET http://localhost:5000/fruits?name=banana
//GET http://localhost:5000/fruits?name=berry
//GET http://localhost:5000/fruits



app.get("/fruits", (req, res, next) => {
  const { fruits } = data;
  const fruitName = req.query.name;
  const matchedfruits = fruits.filter(fruitie =>
    fruitie.name.includes(fruitName)
  );
  //if /fruits return the whole array if no match return empty array
  let message = !fruitName ? fruits : matchedfruits;
  res.json(message);
});

app.get("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const fruit = fruits.find(fruitie => fruitie.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(fruit);
});

//POST 
app.post("/fruits", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const fruit = { id: generateId(), ...req.body };

  fruits.push(fruit);
  res.status(201).json(fruit);
});


//DELETE
//DELETE http://localhost:5000/fruits/hxVQBS8vO
//DELETE http://localhost:5000/fruits/hxV
app.delete("/fruits/:id", (req, res, next) => {
  const status = 200;
  const { id } = req.params;
  const { fruits } = data;
  const fruit = fruits.find(fruitie => fruitie.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.status(status).json(fruit);
});


//PUT
//PUT http://localhost:5000/fruits/303zEauDV
//PUT http://localhost:5000/fruits/to
app.put("/fruits/:id", (req, res, next) => {
  const status = 200;
  const { id } = req.params;
  const { fruits } = data;
  const fruit = fruits.find(fruitie => fruitie.id === req.params.id);
  let message = fruit;

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  } else if (!req.body.name || !req.body.price) {
    message = "Bad request";
  } else {
    fruit.name = req.body.name;
    fruit.price = req.body.price;
  }

  res.status(status).json(message);
});

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not ${req.method} ${req.path}`
  });
});

app.use((err, req, res, next) => {
  const { message, status } = err;
  res.status(status).json({ message });
});

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
