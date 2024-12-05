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
<<<<<<< HEAD
    html: `<a href="${process.env.FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
=======
    html: `<a href="${process.env.VITE_FRONTEND_URL}/api/verify?token=${token}">Vajuta siia sisselogimiseks</a>`,
>>>>>>> 98953bc1f3ab1952841f53674b36a5cbda5fff82
  });
};

export const getFileExtension = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return ""; // No extension found or hidden file without extension
  }
  return filename.slice(lastDotIndex + 1);
};
