import { useCallback, useMemo, useState } from 'react'
import { InterviewContext } from './interview-context'
import {
  downloadResumePdf as downloadResumePdfRequest,
  generateInterviewReport,
  getInterviewReport as getInterviewReportRequest,
  getInterviewReports,
} from './services/interview.api'

export const InterviewProvider = ({ children }) => {
  const [reports, setReports] = useState([])
  const [activeReport, setActiveReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getInterviewReports()
      setReports(data.interviewReports)
      return data.interviewReports
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your reports.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const createReport = useCallback(async (input) => {
    setLoading(true)
    setError('')
    try {
      const data = await generateInterviewReport(input)
      setActiveReport(data.interviewReport)
      setReports((current) => [data.interviewReport, ...current])
      return data.interviewReport
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate your interview report.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchReport = useCallback(async (interviewId) => {
    setLoading(true)
    setError('')
    try {
      const data = await getInterviewReportRequest(interviewId)
      setActiveReport(data.interviewReport)
      return data.interviewReport
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load this report.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const createResumePdf = useCallback(async (interviewId) => {
    setLoading(true)
    setError('')
    try {
      return await downloadResumePdfRequest(interviewId)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to generate the resume PDF.')
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(''), [])

  const value = useMemo(() => ({
    reports,
    activeReport,
    loading,
    error,
    fetchReports,
    createReport,
    fetchReport,
    createResumePdf,
    clearError,
  }), [reports, activeReport, loading, error, fetchReports, createReport, fetchReport, createResumePdf, clearError])

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  )
}