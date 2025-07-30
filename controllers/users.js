const { UserModel } = require('../models/users.js')
const bcrypt = require('bcryptjs')
const {
  signJWTAccessToken,
  verifyJWTAccessToken,
  compareBcryptAsync
} = require('../utils/apiAuthorization.js')
const { v4: uuidv4 } = require('uuid')

const login = async (req, res) => {
  const user = req.body

  const userData = await UserModel.findOne({ email: user.username }).select(
    '+password'
  )

  if (
    userData &&
    (await compareBcryptAsync(user.password, userData.password))
  ) {
    const { password, ...userInfo } = userData._doc
    const accessToken = signJWTAccessToken(userInfo)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true, // Use secure in production
      sameSite: 'strict',
      maxAge: 24 * 3600 // 1 day
    })
    return res.json(userInfo)
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

const register = async (req, res) => {
  const { email, password, name } = req.body
  try {
    const userData = await UserModel.findOne({ email })
    if (!userData) {
      const newUser = new UserModel({
        id: uuidv4(),
        name,
        email,
        password: await bcrypt.hash(password, 10)
      })
      await newUser.save()

      return res.status(201).json({ message: 'User created successfully' })
    } else {
      return res
        .status(401)
        .json({ message: 'User already exist, please login' })
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const validateToken = (req, res) => {
  const token = req.cookies.accessToken
  if (token) {
    const decodedToken = verifyJWTAccessToken(token)
    if (!decodedToken) return res.status(403).json({ valid: false })
    return res.status(200).json({ valid: true })
  } else {
    return res.status(401).json({ valid: false })
  }
}

const logout = (req, res) => {
  console.log(req.user)
  res.clearCookie('accessToken')
  return res.status(200).json({ message: 'User logged out successfully' })
}

module.exports = {
  login,
  logout,
  register,
  validateToken
}
