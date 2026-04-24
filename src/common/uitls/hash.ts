import bcrypt from "bcrypt";
export async function hash(data: string ) {
  return await bcrypt.hash(data.toString(), 10);
}
export async function compare(data: string, hashedData: string) {
  return await bcrypt.compare(data.toString(), hashedData);
}