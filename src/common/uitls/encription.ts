import crypto from "node:crypto";
export function encryption(data: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"),
    iv,
  );
  let encryptedData = cipher.update(data, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
}

export function decryption(encryptedData: string) {
  const [iv, encryptedValue] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from("12345678123456781234567812345678"),
    Buffer.from(iv as string, "hex"),
  );
  let decryptedValue = decipher.update(encryptedValue as string, "hex", "utf-8");

  decryptedValue += decipher.final("utf-8");
  return decryptedValue;
}
