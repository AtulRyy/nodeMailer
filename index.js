const express = require('express')
require('dotenv').config()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const transporter = nodemailer.createTransport({
    host: "us2.smtp.mailhostbox.com", // Replace with your Webmail SMTP server
    port: 587, // Use 587 for TLS, or 465 for SSL
    secure: false, // true for SSL, false for TLS
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

function capitalizeName(name) {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Example usage:

app.post('/register', async (req, res) => {
    const { email, name, message } = req.body;
    const name1=capitalizeName(name)
    if (!name || !email) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.CLIENT_EMAIL,
            subject: "New User Registration",
            text: `New Registration:\n\nName: ${name1}\nEmail: ${email}\nMessage: ${message}`
        })
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "New User Registration",
            html: `
                <div style="text-align: center;">
                    <h2 style="font-size: clamp(32px, 5vw, 70px); margin-bottom: 15px;">Hello <b>${name1}</b>,</h2>
                    <img src="cid:unique@spydernet" alt="Welcome Image" style="width:100%; max-width:600px;"/>
                </div>
                <div style="text-align: center; margin-top: 20px; ">
                    <a href="mailto:info@fundedcapitalgroup.com" style="font-size: 18px; text-decoration: none; color: #007bff;">
                        info@fundedcapitalgroup.com
                    </a>
                </div>

            `,
            attachments: [
                {
                    filename: 'welcome.jpg', // Name of the file when received
                    path: './welcome.PNG', // Path to your image file
                    cid: 'unique@spydernet' // Unique ID for referencing in HTML if needed
                }
            ]
        })
        console.log("Registration successful! Email sent.");

        res.status(200).json({ message: "Registration successful! Email sent." });
    }
    catch (error) {
        res.status(500).json({ message: "Error sending email", error });
    }

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})