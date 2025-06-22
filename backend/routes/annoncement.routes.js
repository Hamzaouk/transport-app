const express = require("express")
const router = express.Router()
const announcementController = require("../controllers/annoncement.controller")
const authMiddleware = require('../middleware/auth.middleware')
const driverMiddleware = require("../middleware/driver.middleware")

//add validation later
router.get("/getall", authMiddleware ,announcementController.getAnnouncements)
router.get("/getone/:id", authMiddleware , announcementController.getAnnouncement)
router.get("/getdriverannouncement", authMiddleware, driverMiddleware, announcementController.getDriverAnnouncements)
router.post("/create", authMiddleware, driverMiddleware, announcementController.createAnnoncement)
router.put("/update/:id", authMiddleware, driverMiddleware, announcementController.updateAnnouncement)
router.delete("/delete/:id", authMiddleware, driverMiddleware, announcementController.deleteAnnouncement)
router.get("/history", authMiddleware, driverMiddleware, announcementController.getDriverHistory)

module.exports = router