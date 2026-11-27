import { generateInterviewReport,generateResumePdf } from "../services/ai.service.js";
import { interviewReportModel } from "../models/interviewReport.model.js";
import { PDFParse } from 'pdf-parse'
import mongoose from 'mongoose'



export const generateInterViewReportController=async(req, res)=> {
    if (!req.file) {
        return res.status(400).json({ message: "A PDF resume is required." })
    }

    const { selfDescription, jobDescription } = req.body
    const candidateSummary = typeof selfDescription === 'string' ? selfDescription.trim() : ''
    const roleDescription = typeof jobDescription === 'string' ? jobDescription.trim() : ''
    if (!roleDescription) {
        return res.status(400).json({ message: "Job description is required." })
    }
    if (candidateSummary.length > 5000 || roleDescription.length > 10000) {
        return res.status(400).json({ message: "Descriptions exceed the allowed length." })
    }

    if (req.file.buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
        return res.status(400).json({ message: "The uploaded file is not a valid PDF." })
    }

    const pdfParser = new PDFParse({ data: req.file.buffer })
    let resumeText
    try {
        const resumeContent = await pdfParser.getText()
        if (!resumeContent.text?.trim()) {
            return res.status(400).json({ message: "The uploaded PDF does not contain readable text." })
        }
        resumeText = resumeContent.text
    } catch (error) {
        console.warn("Unable to parse uploaded resume PDF:", error.message)
        return res.status(400).json({ message: "Unable to read the uploaded PDF." })
    } finally {
        await pdfParser.destroy()
    }

    try {
        const reportData = await generateInterviewReport({
            resume: resumeText,
            selfDescription: candidateSummary,
            jobDescription: roleDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: candidateSummary,
            jobDescription: roleDescription,
            ...reportData
        })

        const reportResponse = interviewReport.toObject()
        delete reportResponse.resume
        delete reportResponse.selfDescription
        delete reportResponse.jobDescription
        delete reportResponse.user
        delete reportResponse.__v

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport: reportResponse
        })
    } catch (error) {
        console.error("Interview report generation failed:", error)
        return res.status(500).json({ message: "Unable to generate interview report." })
    }
}

export const getInterviewReportByIdController=async(req, res)=> {

    const { interviewId } = req.params
    if (!mongoose.isValidObjectId(interviewId)) {
        return res.status(400).json({ message: "Invalid interview report ID." })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        .select("-resume -selfDescription -jobDescription -user -__v")

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
export const getAllInterviewReportsController=async(req, res)=> {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50)
        .select("title matchScore createdAt")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export const generateResumePdfController=async(req, res)=> {
    const { interviewReportId } = req.params
    if (!mongoose.isValidObjectId(interviewReportId)) {
        return res.status(400).json({ message: "Invalid interview report ID." })
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    let pdfBuffer
    try {
        pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })
    } catch (error) {
        console.error("Resume PDF generation failed:", error)
        return res.status(500).json({ message: "Unable to generate resume PDF." })
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}