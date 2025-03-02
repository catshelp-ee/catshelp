import * as jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";

export const sendRequest = async (id: number, email: string) => {
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_LENGTH,
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
      from: "Marko <markopeedosk@gmail.com>", // sender address
      to: `${email}`, // list of receivers
      subject: "🐈 Cats Help Sisselogimine", // Subject line
      //text: "Hello world?", // plain text body
      html: `<a href="${process.env.VITE_FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
    });
  };