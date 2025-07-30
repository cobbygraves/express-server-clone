const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const DEFAULT_SIGN_OPTION = {
  expiresIn: '1d'
}

function signJWTAccessToken(payload, options = DEFAULT_SIGN_OPTION) {
  const secretKey = process.env.SECRET
  const token = jwt.sign(payload, secretKey, options)
  return token
}

function verifyJWTAccessToken(token) {
  try {
    const secretKey = process.env.SECRET
    const decodedToken = jwt.verify(token, secretKey)
    return decodedToken
  } catch (error) {
    console.log(error)
    return null
  }
}

function compareBcryptAsync(param1, param2) {
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, param2, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = {
  signJWTAccessToken,
  verifyJWTAccessToken,
  compareBcryptAsync
}
