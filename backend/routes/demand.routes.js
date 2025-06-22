const express = require("express")
const router = express.Router()
const demandController = require("../controllers/demand.controller")
const authMiddleware = require('../middleware/auth.middleware')
const driverMiddleware = require("../middleware/driver.middleware")
const shipperMiddleware = require("../middleware/shipper.middleware")


router.get("/getbyannouncement", authMiddleware, demandController.getDemandsByAnnouncement)
router.get("/getone", authMiddleware, demandController.getDemand)
router.get("/getshipperdemands", authMiddleware, shipperMiddleware, demandController.getShipperDemands)
router.post("/create", authMiddleware, shipperMiddleware, demandController.createDemand)
router.put("/update/:id", authMiddleware, demandController.updateDemand)
router.get("/history", authMiddleware, shipperMiddleware, demandController.getShipperHistory)
router.put("/cancel", authMiddleware, demandController.CancelDemand)

module.exports = router