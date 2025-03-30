//importing all the required modules after installing
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const User=require('./models/User')
const bcrypt=require('bcryptjs')

//midleware
const PORT=3000
const app=express()
app.use(express.json())

//connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//API landing page http://localhost:3000/
app.get('/',async(req,res)=>{
        try{
            res.send("<h1 align=center>welcome to the backend<h1>")
        }
        catch(err)
        {
            console.log(err)
        }
    })

//API for registration page http://localhost:3000/register
app.post('/register',async(req,res)=>{
    const {user,email,password,phone,address}=req.body
    try{
        const hashPassword=await bcrypt.hash(password,10)
        const newUser=new User({user,email,password:hashPassword,phone,address})
        await newUser.save()
        console.log("new user is registered successfully")
        res.json({message:'user created'})
    }
    catch(err)
    {
        console.log(err)
    }
})

//API for login page
app.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await User.findOne({email})
        if (!user || !(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({message:"Invalid Credentials Try again...!"});
        }
        res.json({message:"Login successfully..!",username:user.username});
    }
    catch(err)
    {
        console.log(err)
    }
})



//server running and testing
app.listen(PORT,(err)=>{
    if (err){
        console.log(err)
    }
    console.log("Server is running on port:"+PORT)
})