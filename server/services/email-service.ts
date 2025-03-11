import * as jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
import "dotenv/config";

export const sendRequest = async (id: number, email: string) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  await sendMagicLink(email, token);
};

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMagicLink = (email: string, token: string) => {
  return transporter.sendMail({
    from: process.env.MAGIC_LINK_SENDER, // sender address
    to: `${email}`, // list of receivers
    subject: "🐈 Cats Help Sisselogimine", // Subject line
    //text: "Hello world?", // plain text body
    html: `<a href="${process.env.VITE_FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
  });
};