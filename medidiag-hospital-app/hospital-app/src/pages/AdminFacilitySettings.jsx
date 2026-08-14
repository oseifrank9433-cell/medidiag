import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFacilitySettings, saveFacilitySettings } from '../utils/facilitySettingsStore';
import { PHOTO_CLINIC_DESK } from '../assets/photos';

export default function AdminFacilitySettings() {
  const { clinician } = useAuth();
  const facility = clinician?.facility;
  const [form, setForm] = useState({ displayName: facility || '', address: '', contact: '', confidenceThreshold: 60 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!clinician) return;
    getFacilitySettings()
      .then((settings) => setForm(settings))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [clinician]);

  function handleChange(e) {
    setSavedMsg('');
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleThresholdChange(e) {
    setSavedMsg('');
    setForm((f) => ({ ...f, confidenceThreshold: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');
    try {
      const updated = await saveFacilitySettings({
        ...form,
        confidenceThreshold: Number(form.confidenceThreshold),
      });
      setForm(updated);
      setSavedMsg('Facility settings saved.');
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="page"><p>Loading facility settings…</p></div>;
  }

  return (
    <div className="page">
      <header
        className="page-hero page-hero--admin"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(109,90,196,0.85) 0%, rgba(76,63,145,0.82) 55%, rgba(15,58,56,0.88) 130%), url(${PHOTO_CLINIC_DESK})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">Admin console</p>
          <h1 className="page-hero__title">Facility settings</h1>
          <p className="page-hero__sub">Identity and diagnosis confidence settings used for screenings at {facility || 'your facility'}.</p>
        </div>
      </header>

      <section className="panel form-panel">
        <form onSubmit={handleSave}>
          {loadError && <div className="auth-form__error" style={{ marginBottom: 16 }}>{loadError}</div>}
          {savedMsg && <div className="auth-form__success" style={{ marginBottom: 16 }}>{savedMsg}</div>}

          <div className="form-grid form-grid--2">
            <label className="field">
              <span>Display name</span>
              <input name="displayName" value={form.displayName} onChange={handleChange} placeholder={facility} />
            </label>
            <label className="field">
              <span>Contact</span>
              <input name="contact" value={form.contact} onChange={handleChange} placeholder="Phone or email" />
            </label>
          </div>

          <div className="form-grid" style={{ marginTop: 14 }}>
            <label className="field">
              <span>Address</span>
              <input name="address" value={form.address} onChange={handleChange} placeholder="Facility address" />
            </label>
          </div>

          <div className="form-panel__divider" />

          <p className="form-panel__hint">
            The trained model always returns a Malaria/Typhoid probability split. Below this confidence
            level, MediDiag defers to "Unknown / Refer to Clinician" instead of committing to a diagnosis.
            Changes only affect screenings run after saving.
          </p>
          <div className="form-grid form-grid--2">
            <label className="field">
              <span>Diagnosis confidence threshold (%)</span>
              <input
                type="number" min="50" max="99"
                name="confidenceThreshold"
                value={form.confidenceThreshold}
                onChange={handleThresholdChange}
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
  );
}
