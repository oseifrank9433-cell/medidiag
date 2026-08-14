import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PHOTO_CLINICIAN_PORTRAIT } from '../assets/photos';

export default function Profile() {
  const { clinician, updateProfile } = useAuth();
  const isAdmin = clinician?.accountType === 'admin';

  const [form, setForm] = useState({
    name: clinician?.name || '',
    facility: clinician?.facility || '',
    role: clinician?.role || '',
    email: clinician?.email || '',
  });
  const [passwords, setPasswords] = useState({ next: '', confirm: '' });
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSavedMsg('');

    const updates = { ...form };
    if (passwords.next) {
      if (passwords.next.length < 6) {
        setError('New password should be at least 6 characters.');
        return;
      }
      if (passwords.next !== passwords.confirm) {
        setError('New passwords do not match.');
        return;
      }
      updates.password = passwords.next;
    }

    setSaving(true);
    try {
      await updateProfile(updates);
      setPasswords({ next: '', confirm: '' });
      setSavedMsg('Profile updated.');
    } catch (err) {
      setError(err.message || 'Something went wrong while saving your profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <header
        className="page-hero"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15,58,56,0.88) 0%, rgba(22,78,99,0.82) 55%, rgba(109,90,196,0.75) 130%), url(${PHOTO_CLINICIAN_PORTRAIT})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">{isAdmin ? 'Admin Account' : 'My Account'}</p>
          <h1 className="page-hero__title">Profile settings</h1>
          <p className="page-hero__sub">Update your details. Changes apply immediately.</p>
        </div>
      </header>

      <div className="profile-grid">
        <section className="panel profile-card">
          <div className="profile-card__avatar">{clinician?.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="profile-card__name">{clinician?.name}</div>
          <div className="profile-card__role">{isAdmin ? 'Administrator' : clinician?.role}</div>
          <span className="badge profile-card__badge" style={{ color: 'var(--teal-700)', background: 'var(--teal-100)' }}>
            {isAdmin ? 'Admin account' : 'Clinician account'}
          </span>
          <div className="profile-card__list">
            <div className="profile-card__list-item">
              <span>Facility</span>
              <strong>{clinician?.facility || '—'}</strong>
            </div>
            <div className="profile-card__list-item">
              <span>Email</span>
              <strong>{clinician?.email}</strong>
            </div>
          </div>
        </section>

        <section className="panel form-panel">
          <form onSubmit={handleSave}>
            {error && <div className="auth-form__error" style={{ marginBottom: 16 }}>{error}</div>}
            {savedMsg && <div className="auth-form__success" style={{ marginBottom: 16 }}>{savedMsg}</div>}

            <div className="form-grid form-grid--2">
              <label className="field">
                <span>Full name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Email address</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>

            <div className="form-grid form-grid--2" style={{ marginTop: 14 }}>
              <label className="field">
                <span>Facility</span>
                <input name="facility" value={form.facility} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>{isAdmin ? 'Title' : 'Role'}</span>
                <input name="role" value={form.role} onChange={handleChange} />
              </label>
            </div>

            <div className="form-panel__divider" />

            <p className="form-panel__hint">Leave blank to keep your current password.</p>
            <div className="form-grid form-grid--2">
              <label className="field">
                <span>New password</span>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={passwords.next}
                  onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                />
              </label>
              <label className="field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                />
              </label>
            </div>

            <div className="form-panel__actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn--primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
