const User = require("../models/User")
const bcrypt = require("bcrypt")

const getMe = async (req, res) => {
    res.json(req.user)
}

const updateUser = async (req, res) => {
    try {
        const { confirmationPassword, password, ...otherUpdates } = req.body

        console.log('Update request received for user:', req.params.id)
        console.log(' Fields to update:', Object.keys(req.body))
        console.log(' Password change requested:', !!password)

        const user = await User.findOne({ _id: req.params.id })

        if (!user) {
            console.log('❌ User not found')
            return res.status(400).json({ message: "User not found!" })
        }

        console.log('✅ User found, verifying current password...')
        const isMatch = await bcrypt.compare(confirmationPassword, user.password)

        if (!isMatch) {
            console.log('❌ Current password verification failed')
            return res.status(400).json({ message: "Wrong password!" })
        }

        console.log('✅ Current password verified successfully')

        // Prepare the update data
        let updateData = { ...otherUpdates }

        // If password is being updated, hash it first
        if (password && password.trim()) {
            console.log('🔐 Hashing new password...')
            try {
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                updateData.password = hashedPassword
                console.log('✅ New password hashed successfully')
            } catch (hashError) {
                console.error('❌ Error hashing password:', hashError)
                return res.status(500).json({ message: "Error processing new password" })
            }
        }

        // Remove confirmationPassword from update data (we don't want to save it)
        delete updateData.confirmationPassword

        console.log('🔄 Updating user in database...')
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        console.log('✅ User updated successfully')

        // Remove password from response for security
        const userResponse = updatedUser.toObject()
        delete userResponse.password

        res.status(200).json({ 
            message: "User updated successfully!", 
            updatedUser: userResponse 
        })

    } catch (error) {
        console.error('❌ Error in updateUser:', error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = { updateUser, getMe }