const express = require("express")
const router = express.Router()
const announcementController = require("../controllers/annoncement.controller")
const authMiddleware = require('../middleware/auth.middleware')
const driverMiddleware = require("../middleware/driver.middleware")

// Public route - anyone can view all announcements (with or without auth)
router.get("/getall", (req, res, next) => {
    // Check if authorization header exists
    const token = req.header("Authorization")?.replace('Bearer ', '')
    
    if (token) {
        // If token exists, use auth middleware
        authMiddleware(req, res, next)
    } else {
        // If no token, continue without authentication
        next()
    }
}, announcementController.getAnnouncements)

// Public route - anyone can view single announcement (with or without auth)
router.get("/getone/:id", (req, res, next) => {
    // Check if authorization header exists
    const token = req.header("Authorization")?.replace('Bearer ', '')
    
    if (token) {
        // If token exists, use auth middleware
        authMiddleware(req, res, next)
    } else {
        // If no token, continue without authentication
        next()
    }
}, announcementController.getAnnouncement)

// Protected routes - require authentication
router.get("/getdriverannouncement", authMiddleware, driverMiddleware, announcementController.getDriverAnnouncements)
router.post("/create", authMiddleware, driverMiddleware, announcementController.createAnnoncement)
router.put("/update/:id", authMiddleware, driverMiddleware, announcementController.updateAnnouncement)
router.delete("/delete/:id", authMiddleware, driverMiddleware, announcementController.deleteAnnouncement)

module.exports = router