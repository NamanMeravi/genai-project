import dotenv from 'dotenv'
import app from "./src/app.js";
import { connectDb } from './src/config/DB.js';

dotenv.config()

const PORT =process.env.PORT || 5000;


app.listen(PORT,()=>{
    connectDb()
    console.log(`server is running on port ${PORT}`);
})