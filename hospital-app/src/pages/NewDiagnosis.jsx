import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDiagnosis } from '../utils/api';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { SYMPTOMS, DEFAULT_CONFIDENCE_THRESHOLD } from '../utils/diagnosisEngine';
import { getFacilitySettings } from '../utils/facilitySettingsStore';
import { PHOTO_CLINICIAN_NOTES } from '../assets/photos';

const STEPS = ['Patient details', 'Vitals', 'Symptoms', 'Review'];

export default function NewDiagnosis() {
  const navigate = useNavigate();
  const { addRecord } = usePatients();
  const { clinician } = useAuth();
  const [step, setStep] = useState(0);

  const symptomsList = SYMPTOMS;
  const [confidenceThreshold, setConfidenceThreshold] = useState(DEFAULT_CONFIDENCE_THRESHOLD);

  useEffect(() => {
    if (!clinician) return;
    getFacilitySettings()
      .then((settings) => setConfidenceThreshold(settings.confidenceThreshold))
      .catch(() => setConfidenceThreshold(DEFAULT_CONFIDENCE_THRESHOLD));
  }, [clinician]);

  const [patient, setPatient] = useState({ name: '', age: '', sex: 'Female' });
  const [vitals, setVitals] = useState({ temperature: '', feverDays: '' });
  const [selected, setSelected] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function toggleSymptom(id) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    setSubmitError(null);
    setSubmitting(true);
    try {
      const result = await getDiagnosis(selected, confidenceThreshold);
      const record = await addRecord({
        patientName: patient.name,
        age: patient.age,
        sex: patient.sex,
        vitals,
        symptoms: selected,
        result,
      });
      navigate(`/patients/${record.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong while running the diagnosis. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header
        className="page-hero"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15,58,56,0.88) 0%, rgba(22,78,99,0.82) 55%, rgba(109,90,196,0.75) 130%), url(${PHOTO_CLINICIAN_NOTES})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">New Screening</p>
          <h1 className="page-hero__title">Malaria &amp; typhoid symptom review</h1>
          <p className="page-hero__sub">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </div>
      </header>

      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`stepper__item${i === step ? ' stepper__item--active' : ''}${i < step ? ' stepper__item--done' : ''}`}>
            <span className="stepper__dot">{i < step ? '✓' : i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="panel form-panel">
        {step === 0 && (
          <div className="form-grid">
            <label className="field">
              <span>Patient full name</span>
              <input value={patient.name} onChange={(e) => setPatient({ ...patient, name: e.target.value })} placeholder="Kwame Mensah" />
            </label>
            <label className="field">
              <span>Age</span>
              <input type="number" min="0" value={patient.age} onChange={(e) => setPatient({ ...patient, age: e.target.value })} placeholder="34" />
            </label>
            <label className="field">
              <span>Sex</span>
              <select value={patient.sex} onChange={(e) => setPatient({ ...patient, sex: e.target.value })}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="form-grid">
            <label className="field">
              <span>Temperature (°C)</span>
              <input type="number" step="0.1" value={vitals.temperature} onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })} placeholder="38.9" />
            </label>
            <label className="field">
              <span>Days with fever</span>
              <input type="number" min="0" value={vitals.feverDays} onChange={(e) => setVitals({ ...vitals, feverDays: e.target.value })} placeholder="4" />
            </label>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="form-panel__hint">Select every symptom the patient currently reports.</p>
            <div className="symptom-grid">
              {symptomsList.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`symptom-chip${selected.includes(s.id) ? ' symptom-chip--active' : ''}`}
                  onClick={() => toggleSymptom(s.id)}
                >
                  <span className="symptom-chip__check" aria-hidden>
                    {selected.includes(s.id) ? '✓' : ''}
                  </span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="review">
            <div className="review__row"><span>Patient</span><strong>{patient.name || '—'}, {patient.age || '—'} yrs, {patient.sex}</strong></div>
            <div className="review__row"><span>Temperature</span><strong>{vitals.temperature || '—'} °C</strong></div>
            <div className="review__row"><span>Fever duration</span><strong>{vitals.feverDays || '—'} days</strong></div>
            <div className="review__row review__row--block">
              <span>Symptoms selected ({selected.length})</span>
              <div className="review__tags">
                {selected.length === 0 && <em>None selected</em>}
                {selected.map((id) => (
                  <span key={id} className="tag">{symptomsList.find((s) => s.id === id)?.label}</span>
                ))}
              </div>
            </div>

            {submitError && (
              <div className="review__row review__row--block" style={{ color: '#A32D2D' }}>
                <span>Error</span>
                <strong>{submitError}</strong>
              </div>
            )}
          </div>
        )}

        <div className="form-panel__actions">
          {step > 0 && <button className="btn btn--ghost" onClick={back} disabled={submitting}>Back</button>}
          {step < STEPS.length - 1 && (
            <button className="btn btn--primary" onClick={next} disabled={step === 0 && !patient.name}>
              Continue
            </button>
          )}
          {step === STEPS.length - 1 && (
            <button className="btn btn--primary" onClick={submit} disabled={selected.length === 0 || submitting}>
              {submitting ? 'Running screening…' : 'Run screening'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
