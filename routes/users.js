const express = require('express')
const {authenticateToken} = require('../middlewares/authenticateToken')

const {
  login,
  logout,
  register,
  validateToken
} = require('../controllers/users')

const router = express.Router()

router.get('/validate-token', validateToken)
router.post('/login', login)
router.post('/logout', authenticateToken, logout)
router.post('/register', register)

module.exports = router
