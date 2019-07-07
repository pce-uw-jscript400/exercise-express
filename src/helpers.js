const REQUIRED_KEYS = [ 'name', 'price' ]
const REQUIRED_KEYS_PUT = ['id', 'name', 'price']

const validate = (req, res, next) => {
  const error = { status: 400, message: 'Bad request' }
  if (!req.body) next(error)

  const hasAllKeys = REQUIRED_KEYS.every(key => req.body[key])
  if (!hasAllKeys) next(error)

  const noExtraKeys = Object.keys(req.body).every(key => REQUIRED_KEYS.includes(key))
  if (!noExtraKeys) next(error)

  next()
}

const validatePut = (req, res, next) => {
  const error = { status: 400, message: 'Bad request' }
  if (!req.body) next(error)

  const hasAllKeys = REQUIRED_KEYS_PUT.every(key => req.body[key])
  if (!hasAllKeys) next(error)

  const noExtraKeys = Object.keys(req.body).every(key => REQUIRED_KEYS_PUT.includes(key))
  if (!noExtraKeys) next(error)

  next()
}
module.exports = { validate, validatePut }
