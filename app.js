const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  // fruits: [],
  // vegetables: []
  fruits: [{ "id": "14r5y6", "name": "apple", "price": "0.49" }],
  vegetables: [{ "id": "y7474u", "name": "cilantro", "price": "1.00" },
  { "id": "8ue38u", "name": "onion", "price": "2.00" }]
}
  //{ "id": "i86y3r", "name": "berries      ", "price": 0.79 }]


  // IE compatibility polyfill for string.prototype.includes()
  // Sunho Hong https://stackoverflow.com/a/39744409
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
      enumerable: false,
      value: function(obj) {
          var newArr = this.filter(function(el) {
            return el == obj;
          });
          return newArr.length > 0;
        }
    });
  }
  // IE compatibility pollyfill for string.prototype.filter
  // http://independent-software.com/extending-the-javascript-array-prototype-with-polyfills.html
  if (!Array.prototype.filter) {
    Array.prototype.filter = function (callbackfn, /*optional*/ thisArg) {
      var k, len, result = [];
      
      // Method cannot be run on an array that does not exist.
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
      
      // The callback must be a function.
      if (typeof callbackfn !== 'function') {
        throw new TypeError();
      }
      
      // Loop through array.
      len = this.length;
      k = 0;
      while (k < len) {
        if (k in this) {
          // For each element, if callback returns truthy, add it to
          // result array.
          if (callbackfn.call(thisArg, this[k], k, this)) {
            result.push(this[k]);
          }
        }
        k = k + 1;
      }
      return result;
    };
  }

/* Vegetables */
// [GET /vegetables?name=[partial-query]](#get-vegetablesnamepartial-query)
app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  const { name } = req.query
  res.status(200)

  // if no query, return vegetables' data
  if (!name) {
    res.json(vegetables)
  } else {  // query exists
    // Filter data for vegetable name
    const veg = vegetables.filter( el => el.name.includes(name))
    res.json(veg)
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

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)                       
  res.status(201).json(vegetable)
})                         
                            
app.delete('/vegetables/:id', ( req, res, next) => { 
  const { vegetables } = data
  const { id } = req.params

  const veg = vegetables.filter(el => el.id.includes(id))[0]
  if (!veg) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  const vegIndex = vegetables.indexOf(veg)
  vegetables.splice(vegIndex,1)
  res.status(200).json(veg)
})

app.put('/vegetables/:id', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params

  const veg = vegetables.filter(el => el.id.includes(id))[0]
  if (!veg) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  const { name, price } = req.body
  if (!name || !price) {
    const message = `Bad request.`
    next({ status: 400, message })
  }
  veg.name = name
  veg.price = price
  res.status(200).json(veg)
}) 




  // //Make vegetable name lowercase
  // const veg = id.toLowerCase()

/* Fruits */
app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  const { name } = req.query
  res.status(200)

  // if no query, return vegetables' data
  if (!name) {
    res.json(fruits)
  } else {  // query exists
    // Filter data for vegetable name
    const fruit = fruits.filter( el => el.name.includes(name))
    res.json(fruit)
  }  
})

app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  const fruit = fruits.find(el => el.id === id)

  if (!fruit) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.status(200).json(fruit)
})


app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { name, price } = req.body
  if (!name || !price) {
    const message = `Bad request.`
    next({ status: 400, message })
  }
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)                       
  res.status(201).json(fruit)
})                         

app.delete('/fruits/:id', ( req, res, next) => { 
  const { fruits } = data
  const { id } = req.params

  const fruit = fruits.filter(el => el.id.includes(id))[0]
  console.log(fruit)
  if (!fruit) {
    const message = `Could not find a fruit with ID of ${id}`
    next({ status: 404, message })
  }
  const fruitIndex = fruits.indexOf(fruit)
  fruits.splice(fruitIndex,1)
  res.status(200).json(fruit)
})

app.put('/fruits/:id', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const { id } = req.params

  const fruit = fruits.filter(el => el.id.includes(id))[0]
  if (!fruit) {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  const { name, price } = req.body
  if (!name || !price) {
    const message = `Bad request.`
    next({ status: 400, message })
  }
  fruit.name = name
  fruit.price = price
  res.status(200).json(fruit)
})   


// Default responses
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