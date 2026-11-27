import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
})

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const formData = new FormData()
  formData.append('resume', resume)
  formData.append('selfDescription', selfDescription)
  formData.append('jobDescription', jobDescription)

  const response = await api.post('/api/interview/reports', formData)
  return response.data
}

export async function getInterviewReports() {
  const response = await api.get('/api/interview/reports')
  return response.data
}

export async function getInterviewReport(interviewId) {
  const response = await api.get(`/api/interview/reports/${encodeURIComponent(interviewId)}`)
  return response.data
}

export async function downloadResumePdf(interviewId) {
  const response = await api.get(
    `/api/interview/reports/${encodeURIComponent(interviewId)}/resume.pdf`,
    { responseType: 'blob' },
  )
  return response.data
}