import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../hooks/useAuth'


const EyeIcon = ({ hidden }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
    {hidden && <path className="slash" d="M4 4l16 16" />}
  </svg>
)

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const { handleLogin, loading } = useAuth()

  const handleInput = (event) => {
    const { name, value } = event.target
    setUser((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    try {
      const data = await handleLogin({ email: user.email.trim(), password: user.password })
      setStatus({ type: 'success', message: data.message || 'Signed in successfully' })
      navigate('/')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Unable to connect to the server',
      })
    }
  }

  return (
    <AuthLayout
      panelTitle="Build ideas into reality"
      panelText="Create, collaborate, and bring your brightest ideas to life in one thoughtful workspace."
    >
      <div className="auth-content">
        <header className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Lumio</h1>
          <p>Enter your details to continue.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInput}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <span className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={user.password}
                onChange={handleInput}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                className="eye-button"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <EyeIcon hidden={!showPassword} />
              </button>
            </span>
          </label>

          <div className="form-options">
            <label className="check-label">
              <input type="checkbox" name="remember" />
              <span className="custom-check" />
              Remember me
            </label>
            <button type="button" className="text-button">Forgot password?</button>
          </div>

          {status.message && (
            <p className={`auth-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider"><span>or continue with</span></div>

        <button className="social-button" type="button">
          <span className="google-mark">G</span>
          Continue with Google
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login