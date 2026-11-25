import dotenv from 'dotenv'
import app from "./src/app.js";
import { connectDb } from './src/config/DB.js';
import {dummyCandidateInput} from './test-data/ai-service.dummy-data.js'
import {generateInterviewReport} from './src/services/ai.service.js'
dotenv.config()

const{resume,jobDescription,selfDescription} = dummyCandidateInput

generateInterviewReport({resume,jobDescription,selfDescription})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    connectDb()
    console.log(`server is running on port ${PORT}`);
})