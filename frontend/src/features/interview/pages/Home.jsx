import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { useInterview } from '../hooks/useInterview'

const Home = () => {
  const navigate = useNavigate()
  const { user, handleLogout, loading: authLoading } = useAuth()
  const { reports, fetchReports, loading, error } = useInterview()
  const [logoutError, setLogoutError] = useState('')

  useEffect(() => {
    fetchReports().catch(() => {})
  }, [fetchReports])

  const onLogout = async () => {
    setLogoutError('')
    try {
      await handleLogout()
      navigate('/login', { replace: true })
    } catch (requestError) {
      setLogoutError(requestError.response?.data?.message || 'Unable to log out. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-10 lg:px-20">
        <Link className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-800 no-underline" to="/">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">L</span>
          <span>Lumio<span className="mt-0.5 block text-[8px] font-bold tracking-[0.18em] text-slate-400">CAREER STUDIO</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <span className="hidden text-sm font-medium text-slate-600 sm:inline">{user?.username || 'Your account'}</span>
          <button
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-50"
            type="button"
            onClick={onLogout}
            disabled={authLoading}
          >
            Log out
          </button>
        </div>
      </header>

      <section className="relative mx-auto my-6 flex min-h-72 w-[calc(100%-2rem)] max-w-6xl items-center overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-white to-indigo-50 px-7 py-10 shadow-sm sm:my-10 sm:px-12 lg:px-16">
        <div className="relative z-10 max-w-xl">
          <span className="mb-3 block text-[10px] font-extrabold tracking-[0.2em] text-indigo-500">YOUR NEXT MOVE, MADE CLEAR</span>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            Prepare with a little more <span className="text-indigo-600">confidence.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
            Get a focused interview plan tailored to your experience and the role you want.
          </p>
          <Link
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white no-underline shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            to="/interview/new"
          >
            <span aria-hidden="true" className="text-xl font-normal">＋</span> Create interview plan
          </Link>
        </div>
        <div className="absolute -right-10 top-1/2 hidden size-64 -translate-y-1/2 items-center justify-center rounded-full border border-indigo-200/70 sm:flex lg:right-16" aria-hidden="true">
          <div className="grid size-48 place-items-center rounded-full border border-dashed border-indigo-200">
            <div className="flex h-36 w-28 rotate-6 flex-col items-center justify-center gap-3 rounded-2xl border border-white bg-white shadow-xl shadow-indigo-100">
              <span className="text-3xl text-indigo-500">✦</span>
              <span className="h-1 w-16 rounded bg-indigo-100" />
              <span className="ml-4 h-1 w-10 self-start rounded bg-indigo-100" />
              <span className="h-3 w-12 rounded-full bg-indigo-500" />
            </div>
          </div>
          <span className="absolute right-8 top-8 size-3 rounded-full border-2 border-white bg-indigo-400 shadow" />
        </div>
      </section>

      <section className="mx-auto mb-16 w-[calc(100%-2rem)] max-w-6xl">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <span className="mb-1 block text-[10px] font-extrabold tracking-[0.2em] text-indigo-500">YOUR WORKSPACE</span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Interview plans</h2>
          </div>
          <span className="text-xs text-slate-400">{reports.length} {reports.length === 1 ? 'plan' : 'plans'}</span>
        </div>

        {(error || logoutError) && (
          <p className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {logoutError || error}
          </p>
        )}

        {loading && reports.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading your interview plans…</div>
        ) : reports.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Link
                className="flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-white p-5 text-inherit no-underline shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60"
                key={report._id}
                to={`/interview/${report._id}`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-lg text-indigo-600">✳</span>
                  {typeof report.matchScore === 'number' && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      {report.matchScore}% match
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-800">{report.title}</h3>
                <p className="mt-1 mb-5 text-xs leading-5 text-slate-500">
                  Personalized questions, skill insights, and a preparation plan.
                </p>
                <div className="mt-auto flex justify-between text-[11px] text-slate-400">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-indigo-600">Open plan <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-11 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">✳</div>
            <h3 className="mt-4 text-lg font-bold text-slate-800">Your next opportunity starts here</h3>
            <p className="mt-1 mb-5 max-w-md text-sm leading-6 text-slate-500">
              Create your first interview plan with a resume PDF and the job description.
            </p>
            <Link
              className="inline-flex min-h-10 items-center rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white no-underline hover:bg-indigo-700"
              to="/interview/new"
            >
              Build my first plan
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
