const express = require("express")
const connectDB = require("./src/config/database")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

connectDB()

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})