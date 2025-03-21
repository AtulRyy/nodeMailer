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
    host: "fcg.spydernet.in", // Replace with your Webmail SMTP server
    port: 465, // Use 587 for TLS, or 465 for SSL
    secure: true, // true for SSL, false for TLS
    auth: {
        user: process.env.EMAIL_USER, // Your Webmail email (e.g., info@yourdomain.com)
        pass: process.env.EMAIL_PASS // Your email password
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
    const {email,name,message}=req.body;

    if(!name||!email)
    {
        return res.status(400).json({message:"All fields are required"})
    }
    try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CLIENT_EMAIL,
            subject: "New User Registration",
            text: `New Registration:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
        })
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "New User Registration",
            text: `Hello ${name} welcome to spydernet`
        })
        console.log("Registration successful! Email sent.");
        
        res.status(200).json({ message: "Registration successful! Email sent." });
    }
    catch (error) {
        res.status(500).json({ message: "Error sending email", error });
    }

})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})