const express = require("express")
const cors = require ("cors")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const annoncementRoutes = require("./routes/annoncement.routes")
const demandRoutes = require("./routes/demand.routes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 7460

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/announcements", annoncementRoutes)
app.use("/api/demands", demandRoutes)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})