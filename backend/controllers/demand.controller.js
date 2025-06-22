const Demand = require("../models/Demand")
const Annoncement = require("../models/Announcement")

const getDemandsByAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.body
        const demands = await Demand.find({ announcement: announcementId})

        if (!demands) {
            return res.status(404).json({ error: "No demands to display"})
        }

        res.status(201).json(demands)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getDemand = async (req, res) => {
    try {
        const demand = await Demand.findById(req.query.id)
        .populate('shipper')
        .populate('announcement')

        if (!demand) {
            return res.status(404).json({ error: "Demand not found"})
        }

        res.status(201).json(demand)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getShipperDemands =  async (req, res) => {
    try {
        const demands = await Demand.find({ shipper: req.user.id })
            .populate("announcement").sort({ createdAt: -1})

        if (demands.length === 0) {
            return res.status(404).json({ error: error.message })
        }

        res.status(201).json(demands)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const createDemand = async (req, res) => {
    try {
        const { announcementId, packages } = req.body

        const announcement = await Annoncement.findById(announcementId)

        if (!announcement) {
            return res.status(404).json({ error: "Announcement not found"})
        }

        const totalVolume = packages.reduce((sum, pkg) => {
            return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height )
        }, 0)

        if (totalVolume > announcement.availableCapacity) {
            return res.status(400).json({ error: "Total package volume exceeds available capacity"})
        }

        const demand = new Demand({
            shipper: req.user._id,
            announcement: announcementId,
            packages
        })
        
        await demand.save()
        
        announcement.availableCapacity -= totalVolume
        await announcement.save()

        res.status(201).json(demand)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


const updateDemand = async (req, res) => {
    try {
        const updatedDemand = await Demand.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true}
        ).populate("announcement")

        if (!updatedDemand) {
            return res.status(404).json({ error: "Demand not found"})
        }

        res.status(201).json(updatedDemand)

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getShipperHistory = async (req, res) => {
    try {
        const history = await Demand.find({
            shipper: req.user.id,
            status: "delivered"
        }).populate({
            path: "announcement",
            populate: {
                path: "driver",
                select: "name"
            }
        }).sort({ deliveredAt: -1 })

        res.status(201).json(history)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const CancelDemand = async (req, res) => {
    try {
        const demand = await Demand.findById(req.query.id)
            .populate("announcement")

        if (!demand) {
            return res.status(404).json({ error: "Demand not found"})
        }
        if (demand.status === "cancelled") {
            return res.status(400).json({ error: "Demand is already cancelled"})
        }
        if (demand.status === "delivered") {
            return res.status(400).json({ error: "Cannot cancel a delivered demand" })
        }
        const totalVolume = demand.packages.reduce((sum, pkg) =>{
            return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height)
        }, 0)

        demand.status = "cancelled"
        await demand.save()

        if (demand.announcement) {
            demand.announcement.availableCapacity += totalVolume
            await demand.announcement.save()
        }

        res.status(201).json({ message: "Demand cancelled"})

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = { getDemandsByAnnouncement, getDemand, getShipperDemands, createDemand, updateDemand, getShipperHistory, CancelDemand }
