const mongoose = require("mongoose")

const AnnouncementSchema = new mongoose.Schema({
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [ true, "Driver id is required"] 
  },
  startPoint: { 
    type: String, 
    required: [ true, "Start point is required"],
    trim: true
  },
  waypoints: [{ 
    type: String
  }],
  destination: { 
    type: String,
    required: [ true, "Destination is required"],
    trim: true
  },
  maxDimensions: {
    length: { type: Number, min: 0},
    width: { type: Number, min: 0},
    height: { type: Number, min: 0}
  },
  packageTypes: [{ 
      type: String,
      trim: true,
      lowercase: true
  }],
  availableCapacity: {
    type: Number, 
    required: true,
    min: 0
  },
  startDate: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value){
        return value > new Date()
      },
      message: "Start date must be in the future"
    }
  },
  endDate: { 
    type: Date,
    validate: function(value){
      return !value || value > this.startDate
    },
    message: "End date must be after start date"
  },
  status: { 
    type: String, 
    enum: { 
      values: ['pending', 'active', 'completed', 'cancelled'],
      message: "status must be pending, active, completed or cancelled"
    }, 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

const annonceModel = mongoose.model('Announcement', AnnouncementSchema)

module.exports = annonceModel


