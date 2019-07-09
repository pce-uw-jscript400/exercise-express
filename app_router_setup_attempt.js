const { NODE_ENV = "development", PORT = 5000 } = process.env;
const express = require("express");
// const { generate: generateId } = require('shortid')
// const helpers = require('./src/helpers')
const app = express();

const produceRoutes = require("./api/routes/vegetables");

if (NODE_ENV === "development") app.use(require("morgan")("dev"));
app.use(require("body-parser").json());

app.use("/vegetables", produceRoutes);

// const data = {
//   fruits: [],
//   vegetables: []
// }

// app.get('/vegetables', (req, res, next) => {
//   const { vegetables } = data
//   res.json(vegetables)
// })

// app.get('/vegetables/:id', (req, res, next) => {
//   const { vegetables } = data
//   const { id } = req.params
//   const vegetable = vegetables.find(veggie => veggie.id === id)

//   if (!vegetable) {
//     const message = `Could not find vegetable with ID of ${id}`
//     next({ status: 404, message })
//   }

//   res.json(vegetable)
// })

// app.post('/vegetables', helpers.validate, (req, res, next) => {
//   const { vegetables } = data
//   const vegetable = { id: generateId(), ...req.body }

//   vegetables.push(vegetable)
//   res.status(201).json(vegetable)
// })

// app.use((req, res, next) => {
//   next({
//     status: 404,
//     message: `Could not ${req.method} ${req.path}`
//   });
// });
// // Error handler
// app.use((err, req, res, next) => {
//   const { message, status } = err;
//   res.status(status).json({ message });
// });

const listener = () => console.log(`Listening on Port ${PORT}!`);
app.listen(PORT, listener);
