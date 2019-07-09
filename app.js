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
      id: "ad_-OwhQA",
      name: "apple",
      price: "2.99"
    },
    {
      id: "DLU6Rjfon",
      name: "banana",
      price: "1.99"
    },
    {
      id: "3YVN-Kn_z",
      name: "kiwis",
      price: "4.13"
    },
    {
      id: "0BtTp4JRn",
      name: "melon",
      price: "3.33"
    }
  ],
  vegetables: [
    {
      id: "xg7hs7vlV",
      name: "acorn squash",
      price: "1.33"
    },
    {
      id: "0k8RBDjm0",
      name: "artichoke",
      price: "1.23"
    },
    {
      id: "Vt2Y8l3IE",
      name: "basil",
      price: "1.93"
    },
    {
      id: "-iWrxvN8G",
      name: "cabbage",
      price: "2.98"
    }
  ]
};

app.get("/vegetables", (req, res, next) => {
  const { vegetables } = data;

  const name = req.query.name;

  let myList = [];

  if (!name) {
    return res.json(vegetables);
  }
  console.log(name);

  myList = vegetables.filter(veggie =>
    veggie.name.includes(name.substring(1, req.query.name.length - 1))
  );

  res.json(myList);
});
/******************************************** */
app.get("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const id = req.params.id;
  let vegetable = vegetables.find(veggie => veggie.id === id);

  console.log(id);

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(vegetable);
});
/******************************************** */
app.delete("/vegetables/:id", (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  let vegetable = vegetables.find(veggie => veggie.id === id);

  //console.log(id);

  if (!vegetable) {
    const message = `DELETE: Could not find vegetable with ID of ${id}`;
    next({ status: 404, message });
  }
  let filtered = vegetables.filter(
    (x = (value, index, arr) => {
      return value.id !== id;
    })
  );
  //console.log(data.vegetables);
  //console.log("===========================");
  data.vegetables = filtered;
  //console.log(data.vegetables);
  res.status(200).json(vegetable);
});
/******************************************** */
app.put("/vegetables/:id", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const { id } = req.params;
  const { name, price } = req.body;
  const vegetable = vegetables.find(veggie => veggie.id === id);

  if (!vegetable) {
    const message = `PUT: Could not find ${name} with ID of ${id}`;
    next({ status: 404, message });
  }
  vegetable.name = name;
  vegetable.price = price;
  res.status(201).json(vegetable);
});

/******************************************** */
app.post("/vegetables", helpers.validate, (req, res, next) => {
  const { vegetables } = data;
  const vegetable = { id: generateId(), ...req.body };

  vegetables.push(vegetable);
  res.status(201).json(vegetable);
});
/******************************************** */
app.get("/fruits", (req, res, next) => {
  const { fruits } = data;

  const name = req.query.name;

  let myList = [];

  if (!name) {
    return res.json(fruits);
  }
  console.log(name);

  myList = fruits.filter(fruit =>
    fruit.name.includes(name.substring(1, req.query.name.length - 1))
  );

  res.json(myList);
});
/******************************************** */
app.get("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const id = req.params.id;
  let fruit = fruits.find(fruit => fruit.id === id);

  console.log(id);

  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }

  res.json(fruit);
});
/******************************************** */
app.post("/fruits", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const fruit = { id: generateId(), ...req.body };

  fruits.push(fruit);
  res.status(201).json(fruit);
});
/******************************************** */
app.delete("/fruits/:id", (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  let fruit = fruits.find(fruit => fruit.id === id);

  //console.log(id);

  if (!fruit) {
    const message = `DELETE: Could not find fruit with ID of ${id}`;
    next({ status: 404, message });
  }
  let filtered = fruits.filter(
    (x = (value, index, arr) => {
      return value.id !== id;
    })
  );
  //console.log(data.vegetables);
  //console.log("===========================");
  data.fruits = filtered;
  //console.log(data.vegetables);
  res.status(200).json(fruit);
});
/******************************************** */
app.put("/fruits/:id", helpers.validate, (req, res, next) => {
  const { fruits } = data;
  const { id } = req.params;
  const { name, price } = req.body;
  const fruit = fruits.find(fruit => fruit.id === id);

  if (!fruit) {
    const message = `PUT: Could not find ${name} with ID of ${id}`;
    next({ status: 404, message });
  }
  fruit.name = name;
  fruit.price = price;
  res.status(201).json(fruit);
});
/***************************************************************************************************** */
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Could not   ${req.method} ${req.path}`
  });
});

app.use((err, req, res, next) => {
  const { message, status } = err;
  res.status(status).json({ message });
});

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
