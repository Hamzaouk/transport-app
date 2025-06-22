const mongoose = require("express")

const NotificationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    type: { 
        type: String, 
        enum: ['demand', 'announcement', 'system'], 
        required: true 
    },
    relatedEntity: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const NotificationModel = mongoose.model('Notification', NotificationSchema)

module.exports = NotificationModel