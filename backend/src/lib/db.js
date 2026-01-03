import mongoose from "mongoose"


import {ENV} from "./env.js"


export const connectDB = async() => {    
    try{
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("conneced to mongoDB: ",conn.connection.host);
    }catch(error){
        console.error("Error connecting to MongoDb", error)
        process.exit(1) //0 mean  success, 1 mean failure
    }
}