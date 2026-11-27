import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import authroute from './routes/auth.route.js';
import interviewRouter from './routes/interview.routes.js';
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use('/api/auth',authroute);
app.use('/api/interview',interviewRouter)

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'Resume PDF must be 3MB or smaller.'
      : 'Upload one PDF file using the resume field.'
    return res.status(400).json({ message })
  }

  console.error('Unhandled API error:', error)
  return res.status(500).json({ message: 'Unexpected server error.' })
})

export default app;