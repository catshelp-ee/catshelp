import * as dotenv from "dotenv";

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

export const getFileExtension = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return ""; // No extension found or hidden file without extension
  }
  return filename.slice(lastDotIndex + 1);
};
