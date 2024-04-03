const mongoose = require("mongoose")

const studentExitModel = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
            ref:"student"
          },
        name:{
            type:String,
            required:true
        },
        admissionno:{
            type:String,
            required:true
        },
        department:{
            type:String,
            required:true
        },
        class:{
            type:String,
            required:true
        },
        contactno:{
            type:String,
            required:true
        },
        gender:{
            type:String,
            required:true
        },

        exitTime: {
            type: String, 
        },
    }
)

module.exports = mongoose.model("studentExitModel",studentExitModel)