const nodemailer = require('nodemailer');

async function sendTestEmail() {
    try {
        // Create test account
        let testAccount = await nodemailer.createTestAccount();

        // Create transporter object using Ethereal's SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // True for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // Dummy recipient details
        const email = "recipient@example.com";  // Replace with any email for testing
        const name = "Atul"; // Replace with dynamic name if needed

        // Send mail
        let info = await transporter.sendMail({
            from: '"Funded Capital Group" <noreply@fundedcapitalgroup.com>', // Sender address
            to: email, // Recipient's email
            subject: "New User Registration", // Subject line
            html: `
                 <div style="text-align: center;">
                    <h2 style="font-size: clamp(32px, 5vw, 70px); margin-bottom: 15px;">Hello <b>${name}</b>,</h2>
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
                    filename: 'welcome.jpg', // What the file is named in the email
                    path: './welcome.PNG', // Path to the image file
                    cid: 'unique@spydernet' // Same as referenced in the HTML
                }
            ],
        });

        console.log("✅ Email sent! Preview URL:", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

// Call the function
sendTestEmail();
