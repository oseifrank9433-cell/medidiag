import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VitalsPulse from '../components/VitalsPulse';
import loginBg from '../assets/hush-naidoo-jade-photography-ZCO_5Y29s8k-unsplash.jpg';

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const justSignedUpAdmin = location.state?.justSignedUpAdmin;
  const [form, setForm] = useState({ email: location.state?.prefillEmail || '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.accountType === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <button className="theme-toggle theme-toggle--floating" onClick={toggleTheme} type="button">
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <div className="auth-brand" style={{ backgroundImage: `linear-gradient(160deg, rgba(10,61,58,0.92), rgba(14,84,80,0.85)), url(${loginBg})` }}>
        <div className="auth-brand__mark">
          <VitalsPulse className="auth-brand__pulse" />
        </div>
        <h1 className="auth-brand__title">MediDiag</h1>
        <p className="auth-brand__tagline">
          A fever-screening workspace for frontline clinicians — triage malaria and
          typhoid presentations with a consistent, structured symptom review.
        </p>
        <ul className="auth-brand__list">
          <li>Structured symptom capture, every visit</li>
          <li>Side-by-side likelihood comparison</li>
          <li>Trends, filters, and exportable reports</li>
        </ul>
      </div>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__head">
            <h2>Welcome back</h2>
            <p>Sign in to continue screening patients.</p>
          </div>

          {justSignedUpAdmin && !error && (
            <div className="auth-form__success">Admin account created — sign in to continue.</div>
          )}
          {error && <div className="auth-form__error">{error}</div>}

          <label className="field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@hospital.org"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </label>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="auth-form__foot">
            New to MediDiag? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
