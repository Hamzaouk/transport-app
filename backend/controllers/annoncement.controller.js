const Annoncement = require("../models/Announcement");
const Demand = require("../models/Demand")

//get for all
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Annoncement.find()
        
        if (announcements.length === 0 ) {
            return res.staus(404).json({ error: "No announcements to display"})
        }

        res.status(201).json(announcements)
    } catch (error) {
        res.status().json({ error: error.message })
    }
}

//get all for driver
const getDriverAnnouncements = async (req, res) => {
    try {
        const announcements = await Annoncement.find({ driver: req.user._id }).sort({ createdAt: -1 })
        
        if (announcements.length === 0 ) {
            return res.staus(404).json({ error: "No announcements to display"})
        }

        res.status(201).json(announcements)
    } catch (error) {
        res.status().json({ error: error.message })
    }
}

//get one for all
const getAnnouncement = async (req, res) => {
    try {
        const announcement = await Annoncement.findById(req.params.id).populate("driver")
        
        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found"})
        }
        
        res.status(201).json(announcement)
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

    const announcement = new Annoncement({
      driver: req.user.id,
      startPoint,
      wayPoints,
      destination,
      maxDimensions,
      packagesTypes, 
      availableCapacity,
      startDate
    });

    await announcement.save()

    res.status(201).json({ message: "Announcement created successfully!"})
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const updateAnnouncement = async (req, res) => {
    try {
        const updatedAnnouncement = await Annoncement.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true}
        ).populate("driver")

        if (!updatedAnnouncement) {
            return res.status(404).json({ error: "Announce not found"})
        }

        res.status(201).json(updatedAnnouncement)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Annoncement.findById({ _id: req.params.id, driver: req.user._id })

        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found" })
        }

        await Demand.updateMany(
            { announcement: announcement._id, status: "pending" },
            { status: "cancelled" }
        )

        await Annoncement.findByIdAndDelete(req.params.id)
        res.status(201).json({ message: "Announcement deleted successfully"})
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

        res.status(201).json(history)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getAnnouncement, getAnnouncements, getDriverAnnouncements, createAnnoncement, updateAnnouncement, deleteAnnouncement, getDriverHistory }





