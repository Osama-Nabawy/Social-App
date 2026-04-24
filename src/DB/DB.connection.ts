import mongoose from "mongoose";
export function connectDB() {
    mongoose.connect("mongodb://127.0.0.1:27017/Social-App").then(() => {
        console.log("DB connected successfully")
    }).catch((error) => {
        console.log("fail to connect to DB",error)
    })
}