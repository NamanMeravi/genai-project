import mongoose from "mongoose";

export const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.DB).then(()=>{
            console.log("database connected successfully");
            
        })
    } catch (error) {
        console.log("database not connected");
        
    }
}