const mongoose = require('mongoose')

const DemandSchema = new mongoose.Schema({
    shipper: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    announcement: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Announcement',
        required: [ true, "Announce id is required"]
    },
    packages: [{
        title: String,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        weight: Number,
        type: String
    }],
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'in-transit', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    deliveredAt: {
        type: Date
    }
});

const demandModel = mongoose.model('Demand', DemandSchema)

module.exports = demandModel

