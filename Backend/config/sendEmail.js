import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: `TP <${process.env.EMAIL_USER}>`,
      to: sendTo,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("SendEmail Error:", error); 
    return null;
  }
};

export default sendEmail;
