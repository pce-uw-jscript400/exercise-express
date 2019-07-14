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
      id: "I6d-k6a60",
      name: "banana",
      price: "0.79"
    },
    {
      id: "p-Yp63hCY",
      name: "apple",
      price: "2.00"
    },
    {
      id: "vtrDZT-Rf",
      name: "pear",
      price: "1.00"
    }
  ],
  vegetables: [
    {
      id: "OIDlPI3hm",
      name: "onions",
      price: 0.99
    },
    {
      id: "oD73STQ06",
      name: "tomato",
      price: 2.99
    },
    {
      id: "IfxG9SHKZ",
      name: "cucumber",
      price: 1.99
    }
  ]
};

// 01 - GET /vegetables?name=[partial-query]
// ===============================================
app.get("/vegetables", (req, res, next) => {
  if (req.query) {
    const { vegetables } = data;
    const { name } = req.query;
    const result = vegetables.filter(veggie => veggie.name.includes(name));
    res.json(result);
  } else {
    const { vegetables } = data;
    res.json(vegetables);
  }
});

// 2 - DELETE/vegetables/[id]
// ========================
app.delete("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  const index = vegetables.findIndex(veggie => veggie.id === id);
  vegetable = vegetables.splice(index, 1);
  if (index == -1) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }
  res.json(vegetable);
});

// 3 - PUT/vegetables/[id]
//=========================

app.put("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  const vegetable = vegetables.find(veggie => veggie.id === id);
  if (vegetable) {
    vegetable.name = req.body.name;
    vegetable.price = req.body.price;
  } else {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(vegetable);
});

// 4 - GET/fruits
//================

// app.get("/fruits", (req, res, next) => {
//   const { fruits } = data;
//   res.json(fruits);
// });

// 5 - GET /fruits?name=[partial-query]
// ===============================================
app.get("/fruits", (req, res, next) => {
  if (req.query) {
    const { fruits } = data;
    const { name } = req.query;
    const result = fruits.filter(myFruit => myFruit.name.includes(name));
    res.json(result);
  } else {
    const { fruits } = data;
    res.json(fruits);
  }
});

// 6 - GET/fruits/[id]
//=====================

app.get("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const fruit = fruits.find(myFruit => myFruit.id === id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(fruit);
});

// 7 - POST/fruits
//=================

app.post("/fruits", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const fruit = { id: generateId(), ...req.body };
  fruits.push(fruit);
  res.status(201).json(fruit);
});

// 8 - DELETE/fruits/[id]
// ========================
app.delete("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const index = fruits.findIndex(myFruit => myFruit.id === id);
  fruit = fruits.splice(index, 1);
  if (index == -1) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }
  res.json(fruit);
});

// 9 - PUT/fruits/[id]
//=========================

app.put("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const fruit = fruits.find(myFruit => myFruit.id === id);
  if (fruit) {
    fruit.name = req.body.name;
    fruit.price = req.body.price;
  } else {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(fruit);
});

//get all vegetables
app.get("/vegetables", (req, res, next) => {
  const { vegetables } = data;
  res.json(vegetables);
});

//get vegetables with id
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

//post a new vegetable
app.post("/vegetables", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const vegetable = { id: generateId(), ...req.body };

  vegetables.push(vegetable);
  res.status(201).json(vegetable);
});

//Error loggers
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
