const express = require('express');
const router = express.Router();
const { generate: generateId } = require('shortid')
const helpers = require('../src/helpers');
const data = require('../app')

router.get('/', (req, res, next) => {
  const { vegetables } = data
  res.json(vegetables)
})

router.get('/:id', (req, res, next) => {
  const { vegetables } = data
  const { id } = req.params
  const vegetable = vegetables.find(veggie => veggie.id === id)

  if (!vegetable) {
    const message = `Could not find vegetable with ID of ${id}`
    next({ status: 404, message })
  }

  res.json(vegetable)
})

router.post('/', helpers.validate, (req, res, next) => {
  const { vegetables } = data
  const vegetable = { id: generateId(), ...req.body }

  vegetables.push(vegetable)
  res.status(201).json(vegetable)
})

module.exports = router;