const SparkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.75c.45 5.38 3.87 8.8 9.25 9.25-5.38.45-8.8 3.87-9.25 9.25C11.55 15.87 8.13 12.45 2.75 12 8.13 11.55 11.55 8.13 12 2.75Z" />
  </svg>
)

const AuthLayout = ({ children, panelTitle, panelText }) => (
  <main className="auth-page">
    <section className="auth-card">
      <div className="auth-form-side">
        <a className="brand" href="/login" aria-label="Lumio home">
          <span className="brand-mark"><SparkIcon /></span>
          <span>Lumio</span>
        </a>
        {children}
      </div>

      <aside className="auth-showcase">
        <div className="showcase-glow showcase-glow-one" />
        <div className="showcase-glow showcase-glow-two" />
        <div className="showcase-content">
          <div className="showcase-illustration" aria-hidden="true">
            <div className="orbit orbit-one"><span /></div>
            <div className="orbit orbit-two"><span /></div>
            <div className="orbit orbit-three"><span /></div>
            <div className="center-spark"><SparkIcon /></div>
          </div>
          <h2>{panelTitle}</h2>
          <p>{panelText}</p>
          <div className="showcase-dots" aria-hidden="true">
            <span className="active" />
            <span />
            <span />
          </div>
        </div>
      </aside>
    </section>
  </main>
)

export default AuthLayout
