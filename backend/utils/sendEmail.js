import nodemailer from "nodemailer";

const sendMail = async({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: Number(process.env.MAILTRAP_PORT), // ✅ cast to number
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "hello@musicapp.com",
      to,
      subject,
      html,
    });

    console.log("✅ Mail sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Mail error:", err);
    throw err; // important!
  }
};

export default sendMail;
