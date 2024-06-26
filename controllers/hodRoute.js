const express=require("express")
const hodModel=require("../models/hod")

const router=express.Router()

const bcrypt=require("bcryptjs")

hashPasswordgenerator=async(pass)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(pass,salt)
}

router.post("/signup",async(req,res)=>{
    let{data}={"data":req.body}
    let password=data.hodpassword
    const hashedPassword=await hashPasswordgenerator(password)
    data.hodpassword=hashedPassword
    let user=new hodModel(data)
    let result=await user.save()
    res.json(
        {
            status:"success"
        }
    )
})


router.post("/login",async(req,res)=>{
    let input=req.body
    let email=req.body.email
    let data=await hodModel.findOne({"email":email})
    
    if (!data) {
        return res.json({
            status:"Invalid user"
        })
    }

    console.log(data)
    let dbpassword=data.hodpassword
    let inputpassword=req.body.hodpassword
    console.log(dbpassword)
    console.log(inputpassword)
    const match=await bcrypt.compare(inputpassword,dbpassword)
    if (!match) {
        return res.json({
            status:"Incorrect password"
        })
    }
    else {
        res.json({status:"success","userdata":data,"requestStatus":data.status })
    }
    
})


// API endpoint to retrieve names and IDs of HODs with specified department

router.post("/getHODsByDepartment", async (req, res) => {
    try {
        const { department } = req.body; // Assuming department is sent through the request body
        const hodList = await hodModel.find({ department }, { _id: 1, hodname: 1 ,department:1, phone:1,email:1 }); // Projection to include only _id and name fields
        res.json(hodList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports=router


