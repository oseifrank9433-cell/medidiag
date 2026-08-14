import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { DIAGNOSIS_META } from '../utils/diagnosisEngine';
import { exportRecordsToCSV, exportRecordsToPDF } from '../utils/exportUtils';
import { PHOTO_HOSPITAL_HALLWAY } from '../assets/photos';

function IconFolder(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...props}>
      <path d="M2.5 5.2c0-.8.6-1.4 1.4-1.4h3.7l1.6 1.8h6.9c.8 0 1.4.6 1.4 1.4v7.8c0 .8-.6 1.4-1.4 1.4H3.9c-.8 0-1.4-.6-1.4-1.4V5.2Z" />
    </svg>
  );
}
function IconAlert(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2.8 18 16.5H2L10 2.8Z" />
      <path d="M10 8.3v3.4M10 14.3v.1" />
    </svg>
  );
}
function IconCheck(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="m6.8 10.2 2.2 2.2 4.2-4.6" />
    </svg>
  );
}

export default function Patients() {
  const { records } = usePatients();
  const { clinician } = useAuth();
  const [search, setSearch] = useState('');
  const [diagnosisFilter, setDiagnosisFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (search && !r.patientName.toLowerCase().includes(search.toLowerCase())) return false;
      if (diagnosisFilter !== 'all' && r.result.diagnosis !== diagnosisFilter) return false;
      const created = new Date(r.createdAt);
      if (fromDate && created < new Date(fromDate)) return false;
      if (toDate && created > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    });
  }, [records, search, diagnosisFilter, fromDate, toDate]);

  const flagged = records.filter((r) => r.result.diagnosis === 'Unknown / Refer to Clinician').length;
  const routine = records.length - flagged;

  function resetFilters() {
    setSearch('');
    setDiagnosisFilter('all');
    setFromDate('');
    setToDate('');
  }

  return (
    <div className="page">
      <header
        className="page-hero"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15,58,56,0.88) 0%, rgba(22,78,99,0.82) 55%, rgba(109,90,196,0.75) 130%), url(${PHOTO_HOSPITAL_HALLWAY})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">Records</p>
          <h1 className="page-hero__title">Patient screenings</h1>
          <p className="page-hero__sub">
            {filtered.length} of {records.length} record{records.length !== 1 ? 's' : ''} shown
          </p>
        </div>
        <Link to="/diagnosis/new" className="btn btn--hero page-hero__cta">+ New Screening</Link>
      </header>

      <div className="stat-row stat-row--3">
        <div className="stat-tile">
          <span className="stat-tile__icon stat-tile__icon--teal"><IconFolder width={19} height={19} /></span>
          <div className="stat-tile__body">
            <span className="stat-tile__value mono">{records.length}</span>
            <span className="stat-tile__label">Total records</span>
            <span className="stat-tile__sub">All screenings on this device</span>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__icon stat-tile__icon--coral"><IconAlert width={19} height={19} /></span>
          <div className="stat-tile__body">
            <span className="stat-tile__value mono">{flagged}</span>
            <span className="stat-tile__label">Inconclusive</span>
            <span className="stat-tile__sub">Refer for lab confirmation</span>
          </div>
        </div>
        <div className="stat-tile">
          <span className="stat-tile__icon stat-tile__icon--teal"><IconCheck width={19} height={19} /></span>
          <div className="stat-tile__body">
            <span className="stat-tile__value mono">{routine}</span>
            <span className="stat-tile__label">Diagnosed</span>
            <span className="stat-tile__sub">Model reached a confident result</span>
          </div>
        </div>
      </div>

      <section className="panel filter-panel">
        <div className="filter-row">
          <label className="field filter-field">
            <span>Search patient</span>
            <input
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label className="field filter-field">
            <span>Diagnosis</span>
            <select value={diagnosisFilter} onChange={(e) => setDiagnosisFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="Malaria">Malaria</option>
              <option value="Typhoid">Typhoid</option>
              <option value="Unknown / Refer to Clinician">Inconclusive</option>
            </select>
          </label>
          <label className="field filter-field">
            <span>From</span>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label className="field filter-field">
            <span>To</span>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <button className="btn btn--ghost" type="button" onClick={resetFilters}>Clear</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel__head">
          <h3>Results</h3>
          <div className="export-actions">
            <button
              className="btn btn--ghost"
              disabled={filtered.length === 0}
              onClick={() => exportRecordsToCSV(filtered, 'medidiag-patient-records.csv')}
            >
              Export CSV
            </button>
            <button
              className="btn btn--ghost"
              disabled={filtered.length === 0}
              onClick={() => exportRecordsToPDF(filtered, { title: 'MediDiag Patient Records', subtitle: clinician?.facility })}
            >
              Export PDF
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            {records.length === 0 ? (
              <>
                <p>No patient records yet.</p>
                <Link to="/diagnosis/new" className="btn btn--primary">Start a screening</Link>
              </>
            ) : (
              <p>No records match your filters.</p>
            )}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Age / Sex</th>
                <th>Diagnosis</th>
                <th>Confidence</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const meta = DIAGNOSIS_META[r.result.diagnosis] || DIAGNOSIS_META['Unknown / Refer to Clinician'];
                const topPct = Math.max(r.result.malariaPct, r.result.typhoidPct);
                return (
                  <tr key={r.id}>
                    <td>{r.patientName}</td>
                    <td className="mono">{r.age || '—'} / {r.sex}</td>
                    <td>
                      <span className="badge" style={{ color: meta.color, background: meta.bg }}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="mono">{topPct}%</td>
                    <td className="mono">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td><Link to={`/patients/${r.id}`}>View →</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
