import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useInterview } from '../hooks/useInterview'

const MAX_RESUME_BYTES = 3 * 1024 * 1024

const Interview = () => {
  const navigate = useNavigate()
  const { createReport, loading, error } = useInterview()
  const [resume, setResume] = useState(null)
  const [selfDescription, setSelfDescription] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] || null
    setValidationError('')

    if (file && file.size > MAX_RESUME_BYTES) {
      setResume(null)
      setValidationError('The PDF must be 3MB or smaller.')
      event.target.value = ''
      return
    }

    if (file && (file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))) {
      setResume(null)
      setValidationError('Choose a PDF file.')
      event.target.value = ''
      return
    }

    setResume(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setValidationError('')

    if (!resume) {
      setValidationError('Add your resume as a PDF to continue.')
      return
    }

    try {
      const report = await createReport({ resume, selfDescription, jobDescription })
      navigate(`/interview/${report._id}`)
    } catch {
      // The request error is surfaced by the interview context.
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-10 lg:px-20">
        <Link className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-800 no-underline" to="/">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">L</span>
          <span>Lumio<span className="mt-0.5 block text-[8px] font-bold tracking-[0.18em] text-slate-400">CAREER STUDIO</span></span>
        </Link>
        <Link className="text-sm font-semibold text-slate-500 no-underline hover:text-indigo-600" to="/">← Back to plans</Link>
      </header>

      <section className="mx-auto w-[calc(100%-2rem)] max-w-3xl py-10 sm:py-14">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-3 block text-[10px] font-extrabold tracking-[0.2em] text-indigo-500">A PLAN BUILT AROUND YOU</span>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            Let’s get you <span className="text-indigo-600">interview-ready.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
            Share your resume and the role you’re going for. We’ll shape a focused prep plan from there.
          </p>
        </div>

        <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" onSubmit={handleSubmit}>
          <label className="mb-7 block" htmlFor="resume">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
              Your resume <span className="text-xs font-normal text-slate-400">PDF · up to 3MB</span>
            </span>
            <span className={`flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-dashed p-4 transition ${resume ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-300 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30'}`}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-xl text-indigo-600">{resume ? '✓' : '↑'}</span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-slate-700">{resume ? resume.name : 'Choose a PDF to upload'}</strong>
                <span className="mt-1 block text-xs text-slate-400">{resume ? `${(resume.size / 1024).toFixed(0)} KB · Ready to upload` : 'or drag and drop it here'}</span>
              </span>
              <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-indigo-600">{resume ? 'Change' : 'Browse'}</span>
            </span>
            <input
              className="sr-only"
              id="resume"
              name="resume"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleResumeChange}
            />
          </label>

          <label className="mb-7 block">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
              A little about you <span className="text-xs font-normal text-slate-400">Optional</span>
            </span>
            <textarea
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              value={selfDescription}
              onChange={(event) => setSelfDescription(event.target.value)}
              placeholder="What are you proud of? What kind of work do you enjoy? Add anything that helps us understand your strengths and goals."
              rows={4}
              maxLength={5000}
            />
            <span className="mt-1 block text-right text-[10px] text-slate-400">{selfDescription.length}/5000 characters</span>
          </label>

          <label className="mb-7 block">
            <span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700">
              The job description <span className="text-xs font-normal text-slate-400">Required</span>
            </span>
            <textarea
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the role description, responsibilities, and qualifications here."
              rows={7}
              maxLength={10000}
              required
            />
            <span className="mt-1 block text-right text-[10px] text-slate-400">{jobDescription.length}/10000 characters</span>
          </label>

          {(validationError || error) && (
            <p className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {validationError || error}
            </p>
          )}

          <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
            <p className="m-0 max-w-xs text-xs leading-5 text-slate-400">Your PDF is processed in memory. Its extracted text is saved with the report for resume generation.</p>
            <button
              className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Building your plan…' : 'Generate my interview plan'}
              {!loading && <span aria-hidden="true" className="text-lg">→</span>}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default Interview
