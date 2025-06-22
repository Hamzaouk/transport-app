const User = require("../models/User")
const bcrypt = require("bcrypt")

const getMe = async (req, res) => {
    res.json(req.user)
}

const updateUser = async (req, res)=>{
    try {
        const { confirmationPassword } = req.body

        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            res.status(400).json({message: "User not found!"})
        }

        const isMatch = await bcrypt.compare(confirmationPassword, user.password)

        if (!isMatch) {
            res.status(400).json({ message: "Wrong password!" })
            return
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true, runValidators: true })
        
        res.status(200).json({message: "User updated successfully !", updatedUser})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
module.exports= { updateUser, getMe}