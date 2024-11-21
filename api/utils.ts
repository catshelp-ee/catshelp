import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { createTransport } from "nodemailer";
dotenv.config();

const generateKey = () => {
  crypto.subtle
    .generateKey(
      {
        name: "HMAC",
        hash: { name: "SHA-256" },
      },
      true,
      []
    )
    .then((key) => {
      crypto.subtle
        .exportKey("jwk", key)
        .then((exported) => console.log(exported.k));
    });
};

export const sendRequest = async (id: number, email: string) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.LENGTH,
  });
  await sendMagicLink(email, token);
};

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendMagicLink = (email: string, token: string) => {
  return transporter.sendMail({
    from: "Marko <markopeedosk@gmail.com>", // sender address
    to: `${email}`, // list of receivers
    subject: "🐈 Cats Help Sisselogimine", // Subject line
    //text: "Hello world?", // plain text body
    html: `<a href="${process.env.BACKEND_LINK}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
  });
};
