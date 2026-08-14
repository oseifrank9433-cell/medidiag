import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { DIAGNOSIS_META, SYMPTOMS } from '../utils/diagnosisEngine';
import ProbabilityBar from '../components/ProbabilityBar';
import { PHOTO_STETHOSCOPE } from '../assets/photos';

export default function PatientDetail() {
  const { id } = useParams();
  const { getRecord, deleteRecord } = usePatients();
  const navigate = useNavigate();
  const record = getRecord(id);
  const symptomsList = SYMPTOMS;
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  if (!record) {
    return (
      <div className="page">
        <p>Record not found. <Link to="/patients">Back to patient records</Link></p>
      </div>
    );
  }

  const { result } = record;
  const diagnosisMeta = DIAGNOSIS_META[result.diagnosis] || DIAGNOSIS_META['Unknown / Refer to Clinician'];

  async function handleDelete() {
    if (!confirm('Delete this record permanently?')) return;
    setDeleteError('');
    setDeleting(true);
    try {
      await deleteRecord(id);
      navigate('/patients');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete this record.');
      setDeleting(false);
    }
  }

  return (
    <div className="page">
      <header
        className="page-hero"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15,58,56,0.88) 0%, rgba(22,78,99,0.82) 55%, rgba(109,90,196,0.75) 130%), url(${PHOTO_STETHOSCOPE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow"><Link to="/patients" style={{ color: 'inherit' }}>Patient Records</Link> / {record.id}</p>
          <h1 className="page-hero__title">{record.patientName}</h1>
          <p className="page-hero__sub">
            {record.age || '—'} years · {record.sex} · Screened {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <button className="btn btn--danger-ghost page-hero__cta" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete record'}
        </button>
      </header>

      {deleteError && <div className="auth-form__error" style={{ marginBottom: 16 }}>{deleteError}</div>}

      <div className="result-grid">
        <section className="panel">
          <div className="panel__head">
            <h3>Likelihood comparison</h3>
            <span className="badge" style={{ color: diagnosisMeta.color, background: diagnosisMeta.bg }}>
              {diagnosisMeta.label}
            </span>
          </div>

          <div className="prob-bars">
            <ProbabilityBar
              label="Malaria"
              percent={result.malariaPct}
              color="var(--amber)"
              sublabel={`${result.malariaPct}% model confidence`}
            />
            <ProbabilityBar
              label="Typhoid fever"
              percent={result.typhoidPct}
              color="var(--teal-500)"
              sublabel={`${result.typhoidPct}% model confidence`}
            />
          </div>

          <div className="callout">
            <strong>Screening note:</strong> This tool compares symptom patterns only.
            {result.diagnosis === 'Unknown / Refer to Clinician'
              ? ' Malaria and typhoid indicators are too close to call — refer for laboratory confirmation.'
              : ` The model's prediction is ${result.diagnosis}.`} Confirm with rapid diagnostic
            testing (RDT / blood film for malaria; Widal, blood or stool culture for typhoid)
            before treatment.
          </div>

          {result.drug && (
            <div className="callout" style={{ marginTop: 12 }}>
              <strong>Recommended action:</strong> {result.drug}
            </div>
          )}
        </section>

        <section className="panel">
          <h3>Vitals</h3>
          <div className="review">
            <div className="review__row"><span>Temperature</span><strong className="mono">{record.vitals?.temperature || '—'} °C</strong></div>
            <div className="review__row"><span>Fever duration</span><strong className="mono">{record.vitals?.feverDays || '—'} days</strong></div>
          </div>

          <h3 style={{ marginTop: 24 }}>Reported symptoms</h3>
          <div className="review__tags" style={{ marginTop: 10 }}>
            {record.symptoms.map((id) => (
              <span key={id} className="tag">{symptomsList.find((s) => s.id === id)?.label}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
