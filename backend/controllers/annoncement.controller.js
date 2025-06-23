const Annoncement = require("../models/Announcement");
const Demand = require("../models/Demand")

//get for all
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Annoncement.find().populate("driver", "firstName lastName email")
        
        if (announcements.length === 0 ) {
            return res.status(404).json({ error: "No announcements to display"})
        }

        res.status(200).json(announcements)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//get all for driver
const getDriverAnnouncements = async (req, res) => {
    try {
        const announcements = await Annoncement.find({ driver: req.user._id }).sort({ createdAt: -1 })
        
        if (announcements.length === 0 ) {
            return res.status(404).json({ error: "No announcements to display"})
        }

        res.status(200).json(announcements)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//get one for all
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Annoncement.findById(req.params.id).populate("driver", "firstName lastName email phoneNumber")
        
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found"})
        }
        
        res.status(200).json(announcement)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

//post ou bein create annonce
const createAnnoncement = async (req, res) => {
  try {
    const {
      startPoint,
      wayPoints,
      destination,
      maxDimensions,
      packagesTypes,
      availableCapacity,
      startDate,
    } = req.body;

    // Validate required fields
    if (!startPoint || !destination || !availableCapacity || !startDate) {
        return res.status(400).json({ 
            error: "Missing required fields: startPoint, destination, availableCapacity, and startDate are required" 
        });
    }

    // Validate start date is in the future
    if (new Date(startDate) <= new Date()) {
        return res.status(400).json({ 
            error: "Start date must be in the future" 
        });
    }

    const announcement = new Annoncement({
      driver: req.user._id,
      startPoint,
      waypoints: wayPoints, // Note: model uses 'waypoints' not 'wayPoints'
      destination,
      maxDimensions,
      packageTypes: packagesTypes, // Note: model uses 'packageTypes' not 'packagesTypes'
      availableCapacity,
      startDate
    });

    await announcement.save()

    res.status(201).json({ message: "Announcement created successfully!", announcement })
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(400).json({ error: error.message })
  }
};

const updateAnnouncement = async (req, res) => {
    try {
        // Check if the announcement belongs to the current driver
        const existingAnnouncement = await Annoncement.findOne({
            _id: req.params.id,
            driver: req.user._id
        });

        if (!existingAnnouncement) {
            return res.status(404).json({ error: "Announcement not found or you don't have permission to update it"});
        }

        const updatedAnnouncement = await Annoncement.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true}
        ).populate("driver", "firstName lastName email")

        res.status(200).json(updatedAnnouncement)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Annoncement.findOne({ 
            _id: req.params.id, 
            driver: req.user._id 
        })

        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found or you don't have permission to delete it" })
        }

        // Update any pending demands to cancelled status
        await Demand.updateMany(
            { announcement: announcement._id, status: "pending" },
            { status: "cancelled" }
        )

        await Annoncement.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Announcement deleted successfully"})
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getDriverHistory = async (req, res) => {
    try {
        const history = await Annoncement.find({ 
            driver: req.user._id, 
            status: "completed"
        }).populate({ 
            path: "demands", 
            match: { status: "delivered"},
            strictPopulate: false
        }).sort({ endDate: -1})

        res.status(200).json(history)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getAnnouncement, getAnnouncements, getDriverAnnouncements, createAnnoncement, updateAnnouncement, deleteAnnouncement, getDriverHistory }