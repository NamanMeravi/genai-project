import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview'

const InterviewReport = () => {
  const { interviewId } = useParams()
  const { activeReport, fetchReport, createResumePdf, loading, error } = useInterview()
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const report = activeReport?._id === interviewId ? activeReport : null

  useEffect(() => {
    fetchReport(interviewId).catch(() => {})
  }, [interviewId, fetchReport])

  const handleDownload = async () => {
    setPdfLoading(true)
    setPdfError('')
    try {
      const pdf = await createResumePdf(interviewId)
      const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `tailored-resume-${interviewId}.pdf`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (requestError) {
      setPdfError(requestError.response?.data?.message || 'Could not create the resume PDF. Please try again.')
    } finally {
      setPdfLoading(false)
    }
  }

  if (loading && !report) {
    return <main className="min-h-screen bg-slate-50 p-10 text-center text-sm text-slate-500">Loading your report…</main>
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <InterviewHeader />
        <section className="mx-auto mt-20 flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <h1 className="text-2xl font-bold">We couldn’t find that report</h1>
          <p className="mt-2 mb-5 text-sm text-slate-500">{error || 'It may have been removed or belong to another account.'}</p>
          <Link className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white no-underline" to="/">Back to your plans</Link>
        </section>
      </main>
    )
  }

  const score = Math.min(100, Math.max(0, report.matchScore || 0))

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <InterviewHeader />
      <section className="mx-auto w-[calc(100%-2rem)] max-w-6xl py-8 sm:py-12">
        <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <Link className="mb-6 inline-block text-xs font-semibold text-slate-500 no-underline hover:text-indigo-600" to="/">← Your plans</Link>
            <span className="mb-2 block text-[10px] font-extrabold tracking-[0.2em] text-indigo-500">YOUR INTERVIEW BRIEF</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl">{report.title}</h1>
            <p className="mt-2 text-xs text-slate-400">
              Generated {new Date(report.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60"
            type="button"
            onClick={handleDownload}
            disabled={pdfLoading}
          >
            {pdfLoading ? 'Creating PDF…' : 'Download tailored resume'}
            {!pdfLoading && <span aria-hidden="true">↓</span>}
          </button>
        </div>

        {(error || pdfError) && (
          <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{pdfError || error}</p>
        )}

        <section className="grid gap-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/60 p-5 shadow-sm sm:grid-cols-[140px_1fr] sm:items-center sm:p-7">
          <div className="border-b border-slate-200 pb-4 text-center sm:border-r sm:border-b-0 sm:pb-0 sm:pr-5">
            <strong className="block text-5xl font-extrabold tracking-tight text-indigo-600">{report.matchScore ?? '—'}</strong>
            <span className="mt-1 block text-[10px] text-slate-400">out of 100 match score</span>
          </div>
          <div>
            <span className="mb-1 block text-[10px] font-extrabold tracking-[0.18em] text-indigo-500">YOUR PROFILE AT A GLANCE</span>
            <h2 className="text-lg font-bold text-slate-800">{score >= 75 ? 'You have a strong foundation.' : 'Here’s where to focus next.'}</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Use this brief to focus your practice on the skills and stories most relevant to this role.</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${score}%` }} />
            </div>
          </div>
        </section>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <ReportSection number="01" title="Technical questions" subtitle="Practice explaining your thinking, trade-offs, and impact.">
              {report.technicalQuestions?.map((item, index) => <QuestionCard key={`${item.question}-${index}`} item={item} index={index} />)}
            </ReportSection>
            <ReportSection number="02" title="Behavioral questions" subtitle="Bring specific stories and outcomes to your answers.">
              {report.behavioralQuestions?.map((item, index) => <QuestionCard key={`${item.question}-${index}`} item={item} index={index} />)}
            </ReportSection>
          </div>

          <aside className="space-y-5">
            <ReportSection number="03" title="Skills to strengthen" subtitle="Topics worth a little extra attention.">
              {report.skillGaps?.length ? (
                <ul className="divide-y divide-slate-100">
                  {report.skillGaps.map((gap, index) => (
                    <li className="flex items-center justify-between gap-3 py-3 text-xs" key={`${gap.skill}-${index}`}>
                      <span className="font-medium text-slate-600">{gap.skill}</span>
                      <span className={`rounded-full px-2 py-1 text-[9px] font-bold capitalize ${
                        gap.severity === 'high' ? 'bg-red-50 text-red-700' :
                          gap.severity === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>{gap.severity}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-xs text-slate-500">No notable skill gaps were identified.</p>}
            </ReportSection>

            <ReportSection number="04" title="Your prep plan" subtitle="A practical path to interview day.">
              <div className="divide-y divide-slate-100">
                {report.preparationPlan?.map((day) => (
                  <article className="py-3" key={day.day}>
                    <span className="text-[9px] font-extrabold tracking-[0.15em] text-indigo-500">DAY {day.day}</span>
                    <h3 className="mt-1 text-xs font-bold text-slate-700">{day.focus}</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] leading-5 text-slate-500">
                      {day.tasks?.map((task, index) => <li key={`${task}-${index}`}>{task}</li>)}
                    </ul>
                  </article>
                ))}
              </div>
            </ReportSection>
          </aside>
        </div>
      </section>
    </main>
  )
}

const InterviewHeader = () => (
  <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-10 lg:px-20">
    <Link className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-800 no-underline" to="/">
      <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">L</span>
      <span>Lumio<span className="mt-0.5 block text-[8px] font-bold tracking-[0.18em] text-slate-400">CAREER STUDIO</span></span>
    </Link>
    <Link className="text-sm font-semibold text-slate-500 no-underline hover:text-indigo-600" to="/">All plans</Link>
  </header>
)

const ReportSection = ({ number, title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-start gap-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[10px] font-extrabold text-indigo-600">{number}</span>
      <div>
        <h2 className="text-sm font-bold text-slate-800">{title}</h2>
        <p className="mt-1 text-[10px] leading-4 text-slate-400">{subtitle}</p>
      </div>
    </div>
    {children || <p className="text-xs text-slate-500">No details were generated for this section.</p>}
  </section>
)

const QuestionCard = ({ item, index }) => (
  <article className="mb-3 last:mb-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
    <span className="text-[9px] font-extrabold tracking-[0.15em] text-indigo-500">QUESTION {String(index + 1).padStart(2, '0')}</span>
    <h3 className="mt-2 text-xs leading-5 font-bold text-slate-700">{item.question}</h3>
    <div className="mt-3 border-t border-slate-200 pt-3">
      <strong className="text-[10px] text-slate-600">What they’re looking for</strong>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.intention}</p>
    </div>
    <div className="mt-2">
      <strong className="text-[10px] text-slate-600">How to approach it</strong>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.answer}</p>
    </div>
  </article>
)

export default InterviewReport
