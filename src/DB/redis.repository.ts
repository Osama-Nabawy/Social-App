import { redisClient } from "./redis.connection";
export async function setCache(key: string, value: string | number, expireTimeInSeconds?: number) {
  if (expireTimeInSeconds) {
    await redisClient.set(key, value, {"EX": expireTimeInSeconds});
  }
}
export async function getCache(key: string) {
  return await redisClient.get(key);
}
export async function deleteCache(key: string) {
  await redisClient.del(key);
}
export async function existsCache(key: string) {
  return await redisClient.exists(key);
}