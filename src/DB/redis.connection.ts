import { createClient } from "redis";
import { Redis_Url } from "../config";
export const redisClient = createClient({
    url: Redis_Url
})

export function connectRedis() {
    redisClient.connect().then(() => {
        console.log("redis connected successfully")
    }).catch((error) => {
        console.log("fail to connect redis db",error)
    })
}