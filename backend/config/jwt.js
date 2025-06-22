const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, { expiresIn: "30d"})
}

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

module.exports = { generateToken, verifyToken}