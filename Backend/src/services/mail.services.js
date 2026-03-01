import nodemailer from 'nodemailer'

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({to , subject , html}) => {
  try {
    const info = await transporter.sendMail({
      from: `"CoWorkingSpace" <${process.env.SENDER_EMAIL}>`, // sender address
      to, // list of recipients
      subject, // subject line
      html, // HTML body
    });

    console.log("Message sent: ", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
}