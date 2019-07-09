const { NODE_ENV = 'development', PORT = 5000 } = process.env
const express = require('express')
const { generate: generateId } = require('shortid')
const helpers = require('./src/helpers')
const app = express()

if (NODE_ENV === 'development') app.use(require('morgan')('dev'))
app.use(require('body-parser').json())

const data = {
  fruits: [
    {
      "id": "g_wLvXHN4",
      "name": "apple",
      "price": "1.00"
    },
    {
        "id": "SH_kBYDBM",
        "name": "mango",
        "price": "2.00"
    },
    {
        "id": "noXMXa0bK",
        "name": "banana",
        "price": "0.50"
    }
  ],
  vegetables: [
    {
      "id": "gizBnTGnI",
      "name": "tomato",
      "price": "1.00"
    },
    {
        "id": "B-1DtOWS6",
        "name": "potato",
        "price": "2.00"
    },
    {
        "id": "mMKcqFOE8",
        "name": "green pepper",
        "price": "1.20"
    },
    {
        "id": "kOfsVqi6d",
        "name": "red pepper",
        "price": "1.50"
    }
  ]
}

app.get('/vegetables', (req, res, next) => {
  const { vegetables } = data
  // Capture the query in a varaiable
  const name = (req.query.name);

  console.log(name);
  // Check if any query param was sent
  if (name)
  {
    console.log("query present");
    // Check if the requested vegetable matches any of the ones present in the array, while checking remove the quotes
    const results = vegetables.filter(veggie => veggie.name.includes(name.replace(/"/g,"")));
    console.log(results)
    res.json(results);
  }
  // If no query params were sent then return the entire vegetable array
  else
  {
    console.log("no query present")
    res.json(vegetables)
  }
})

app.delete('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  // Check if there is any vegetable that matches the id
  const vegetable = vegetables.find(veggie => veggie.id === id)

  // If we do not find a veggie that matches then return not found along with status 404
  if (!vegetable) 
  {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  // If we find the veggie that matches, then remove that veggie from the array
  // You can check this by doing a successive get which would not have the deleted veggie as a part
  // of its complete list
  else
  {
    vegetables.splice(vegetables.indexOf(vegetable), 1)
  }

  // return the deleted veggie
  res.json(vegetable)
})

app.put('/vegetables/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  // Check if there is any vegetable that matches the id
  const vegetable = vegetables.find(veggie => veggie.id === id)

  // If we do not find a veggie that matches then return not found along with status 404
  if (!vegetable) 
  {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }
  // If we find the veggie with the specified Id then update the same
  else
  {
    // If the request does not have both the name and price return early with a bad request message
    if ((!req.body.name) || (!req.body.price))
    {
      const message = "Bad request";
      res.json({ message })
    }
    else
    {
      vegetable.name = req.body.name;
      vegetable.price = req.body.price
    }
  }

  // return the updated veggie
  res.json(vegetable)
}
)

app.post('/vegetables', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

app.get('/fruits', (req, res, next) => {
  const { fruits } = data
  // Capture the query in a varaiable
  const name = (req.query.name);

  console.log(name);
  // Check if any query param was sent
  if (name)
  {
    console.log("query present");
    // Check if the requested fruits matches any of the ones present in the array, while checking remove the quotes
    const results = fruits.filter(fruit => fruit.name.includes(name.replace(/"/g,"")));
    console.log(results)
    res.json(results);
  }
  // If no query params were sent then return the entire fruits array
  else
  {
    console.log("no query present")
    res.json(fruits)
  }
})


app.get('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  // Check if there is any fruit that matches the id
  const fruit = fruits.find(fruit => fruit.id === id)

  // If we do not find a fruit that matches then return not found along with status 404
  if (!fruit) 
  {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  else
  {
    // return the selected fruit
    res.json(fruit);
  }

})

app.delete('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  // Check if there is any fruit that matches the id
  const fruit = fruits.find(fruit => fruit.id === id)

  // If we do not find a fruit that matches then return not found along with status 404
  if (!fruit) 
  {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  // If we find the veggie that matches, then remove that veggie from the array
  // You can check this by doing a successive get which would not have the deleted veggie as a part
  // of its complete list
  else
  {
    fruits.splice(fruits.indexOf(fruit), 1)
  }

  // return the deleted fruit
  res.json(fruit)
})

app.put('/fruits/:id', (req, res, next) => {
  const { fruits } = data
  const { id } = req.params
  // Check if there is any fruit that matches the id
  const fruit = fruits.find(fruit => fruit.id === id)

  // If we do not find a fruit that matches then return not found along with status 404
  if (!fruit) 
  {
    const message = `Could not find fruit with ID of ${id}`
    next({ status: 404, message })
  }
  // If we find the fruit with the specified Id then update the same
  else
  {
    // If the request does not have both the name and price return early with a bad request message
    if ((!req.body.name) || (!req.body.price))
    {
      const message = "Bad request";
      res.json({ message })
    }
    else
    {
      fruit.name = req.body.name;
      fruit.price = req.body.price
    }
  }

  // return the updated veggie
  res.json(vegetable)
}
)

app.post('/fruits', helpers.validate, (req, res, next) => {
  const { fruits } = data
  const fruit = { id: generateId(), ...req.body }

  fruits.push(fruit)
  res.status(201).json(fruit)
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
