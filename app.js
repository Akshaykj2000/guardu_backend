const express = require("express")
const cors = require("cors")
const mongoose =require("mongoose")
const qrCode=require("./controllers/server")
const student=require("./controllers/studentRoute")
const hod=require("./controllers/hodRoute")
const admin=require("./controllers/adminRoute")
const security=require("./controllers/securityRoute")

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://akshaykj:akshaykj@cluster0.3vob5wn.mongodb.net/QRDb?retryWrites=true&w=majority",{
    useNewUrlParser :true
})

app.use("/qr",qrCode)
app.use("/student",student)
app.use("/hod",hod)
app.use("/admin",admin)
app.use("/security",security)

app.listen("3001",()=>{
    console.log("Server running...")
})  



