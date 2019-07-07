const REQUIRED_KEYS = [ 'name', 'price' ]
const validate = (req, res, next) => {
  const error = { status: 400, message: 'Bad request' }
  if (!req.body) next(error)

  const hasAllKeys = REQUIRED_KEYS.every(key => req.body[key])
  if (!hasAllKeys) next(error)

  const noExtraKeys = Object.keys(req.body).every(key => REQUIRED_KEYS.includes(key))
  if (!noExtraKeys) next(error)

  next()
}


module.exports = { validate }
