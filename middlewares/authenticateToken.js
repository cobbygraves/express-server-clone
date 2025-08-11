const { verifyJWTAccessToken } = require('../utils/apiAuthorization')

const authenticateToken = (req, res, next) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  const decodedToken = verifyJWTAccessToken(token)
  if (!decodedToken)
    return res.status(403).json({ message: 'Invalid or expired token' })
  req.user = decodedToken
  next()
}

module.exports = {
  authenticateToken
}
