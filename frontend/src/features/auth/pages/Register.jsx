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

const Register = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    terms: false,
  })
  const [status, setStatus] = useState({ type: '', message: '' })
  const { handleRegister, loading } = useAuth()

  const handleInput = (event) => {
    const { name, value, type, checked } = event.target
    setUser((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    if (!user.terms) {
      setStatus({ type: 'error', message: 'Please accept the Terms and Privacy Policy' })
      return
    }

    try {
      const data = await handleRegister({
        username: `${user.firstName.trim()} ${user.lastName.trim()}`.trim(),
        email: user.email.trim(),
        password: user.password,
      })
      setStatus({ type: 'success', message: data.message || 'Account created successfully' })
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
      panelTitle="Turn possibility into progress"
      panelText="A calm space to organize your work, share ideas, and move every project forward."
    >
      <div className="auth-content register-content">
        <header className="auth-heading">
          <p className="eyebrow">Get started</p>
          <h1>Create your account</h1>
          <p>Start your journey with Lumio.</p>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="name-grid">
            <label className="field">
              <span>First name</span>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInput}
                placeholder="Alex"
                autoComplete="given-name"
                required
              />
            </label>
            <label className="field">
              <span>Last name</span>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInput}
                placeholder="Morgan"
                autoComplete="family-name"
                required
              />
            </label>
          </div>

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
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
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

          <label className="check-label terms">
            <input
              type="checkbox"
              name="terms"
              checked={user.terms}
              onChange={handleInput}
            />
            <span className="custom-check" />
            <span>I agree to the <button type="button" className="inline-link">Terms</button> and <button type="button" className="inline-link">Privacy Policy</button></span>
          </label>

          {status.message && (
            <p className={`auth-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>
              {status.message}
            </p>
          )}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="divider"><span>or continue with</span></div>

        <button className="social-button" type="button">
          <span className="google-mark">G</span>
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register