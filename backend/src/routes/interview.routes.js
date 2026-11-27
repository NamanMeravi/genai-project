import express from 'express'
import { authUser } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/file.middleware.js'
import {
    generateInterViewReportController,
    generateResumePdfController,
    getAllInterviewReportsController,
    getInterviewReportByIdController
} from '../controllers/interview.controller.js'

const interviewRouter = express.Router()

interviewRouter.use(authUser)

interviewRouter.post('/reports', upload.single('resume'), generateInterViewReportController)
interviewRouter.get('/reports', getAllInterviewReportsController)
interviewRouter.get('/reports/:interviewId', getInterviewReportByIdController)
interviewRouter.get('/reports/:interviewReportId/resume.pdf', generateResumePdfController)

export default interviewRouter;




