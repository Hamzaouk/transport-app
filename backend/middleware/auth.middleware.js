const { verifyToken } = require("../config/jwt")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', '')

        if(!token) {
            return res.status(401).json({ message: "No token, authorization denied"})
        }

        const decoded = verifyToken(token)
        const user = await User.findById(decoded.id)

        if(!user) {
            return res.status(401).json({message: "Token is not valid"})
        }

        req.user = user
        next()

    } catch (err) {
        res.status(401).json({message: "Error: Token is not valid"})
    }
}

module.exports = authMiddleware