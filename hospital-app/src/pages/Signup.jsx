import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VitalsPulse from '../components/VitalsPulse';
import signupBg from '../assets/cdc-Y2lUjUiay-o-unsplash.jpg';

export default function Signup() {
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    accountType: 'clinician',
    name: '',
    facility: '',
    role: 'Clinical Officer',
    email: '',
    password: '',
    confirm: '',
    adminPin: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const user = await signup({
        ...form,
        role: form.accountType === 'admin' ? 'Administrator' : form.role,
      });
      if (user.accountType === 'admin') {
        navigate('/login', { state: { justSignedUpAdmin: true, prefillEmail: user.email } });
      } else {
        navigate('/dashboard');
      }
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

      <div className="auth-brand" style={{ backgroundImage: `linear-gradient(160deg, rgba(10,61,58,0.92), rgba(14,84,80,0.85)), url(${signupBg})` }}>
        <div className="auth-brand__mark">
          <VitalsPulse className="auth-brand__pulse" />
        </div>
        <h1 className="auth-brand__title">MediDiag</h1>
        <p className="auth-brand__tagline">
          Set up your workspace in a minute. Clinicians screen patients;
          administrators oversee facility-wide activity.
        </p>
        <ul className="auth-brand__list">
          <li>No setup, works right in the browser</li>
          <li>Built for busy outpatient triage</li>
          <li>Designed with West African clinical presentations in mind</li>
        </ul>
      </div>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__head">
            <h2>Create your account</h2>
            <p>A few details and you are in.</p>
          </div>

          {error && <div className="auth-form__error">{error}</div>}

          <div className="account-type-toggle" role="radiogroup" aria-label="Account type">
            <button
              type="button"
              role="radio"
              aria-checked={form.accountType === 'clinician'}
              className={`account-type-btn${form.accountType === 'clinician' ? ' account-type-btn--active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, accountType: 'clinician' }))}
            >
              Clinician
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={form.accountType === 'admin'}
              className={`account-type-btn${form.accountType === 'admin' ? ' account-type-btn--active' : ''}`}
              onClick={() => setForm((f) => ({ ...f, accountType: 'admin' }))}
            >
              Administrator
            </button>
          </div>

          <label className="field">
            <span>Full name</span>
            <input
              name="name"
              required
              placeholder="Dr. Ama Owusu"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Facility</span>
              <input
                name="facility"
                required
                placeholder="Korle-Bu Teaching Hospital"
                value={form.facility}
                onChange={handleChange}
              />
            </label>
            {form.accountType === 'clinician' && (
              <label className="field">
                <span>Role</span>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option>Clinical Officer</option>
                  <option>Nurse</option>
                  <option>Physician</option>
                  <option>Lab Technician</option>
                  <option>Medical Student</option>
                </select>
              </label>
            )}
            {form.accountType === 'admin' && (
              <label className="field">
                <span>Admin PIN</span>
                <input
                  name="adminPin"
                  required
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4-digit PIN"
                  value={form.adminPin}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>

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

          <div className="field-row">
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </label>
            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirm"
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handleChange}
              />
            </label>
          </div>

          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-form__foot">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
