import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearFacilityRecords, getAllFacilityRecords } from '../context/PatientContext';
import { createClinicianAccount, deleteUserAccount, fetchFacilityUsers, setUserActive, updateUserRole, useAuth } from '../context/AuthContext';
import { DIAGNOSIS_META } from '../utils/diagnosisEngine';
import { computeAgeSexBreakdown, computeAvgFeverDays, computeMostCommonSymptom, computeTrends } from '../utils/analytics';
import { exportRecordsToCSV, exportRecordsToPDF } from '../utils/exportUtils';
import TrendsChart from '../components/TrendsChart';
import BreakdownChart from '../components/BreakdownChart';
import { PHOTO_LAB_EQUIPMENT } from '../assets/photos';

function IconActivity(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 10.5h3.2l1.8-5 3 9 1.8-5.5h1.6l1.4 2.5H18" />
    </svg>
  );
}
function IconDroplet(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2.5s5.5 6.2 5.5 9.8a5.5 5.5 0 1 1-11 0C4.5 8.7 10 2.5 10 2.5Z" />
    </svg>
  );
}
function IconThermometer(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11.5 11.2V4a1.5 1.5 0 0 0-3 0v7.2a3.3 3.3 0 1 0 3 0Z" />
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
function IconUsers(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="7.2" cy="6.6" r="2.7" />
      <path d="M2 16c.7-2.9 2.6-4.4 5.2-4.4S11.7 13.1 12.4 16" />
      <path d="M13 7a2.4 2.4 0 1 0 0-4.8" />
      <path d="M14.6 11.7c2 .5 3 1.8 3.4 4.3" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6v4.2l2.8 1.8" />
    </svg>
  );
}
function IconTag(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.4 2.7 17 10.3l-6.7 6.7-7.6-7.6V2.7Z" />
      <circle cx="6.4" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ROLE_OPTIONS = ['Clinical Officer', 'Nurse', 'Physician', 'Lab Technician', 'Medical Student'];

export default function AdminDashboard() {
  const { clinician } = useAuth();
  const facility = clinician?.facility;

  const [records, setRecords] = useState([]);
  const [clinicians, setClinicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const [clearText, setClearText] = useState('');
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: ROLE_OPTIONS[0] });
  const [addError, setAddError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!clinician) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getAllFacilityRecords(), fetchFacilityUsers()])
      .then(([recordsData, usersData]) => {
        if (cancelled) return;
        setRecords(recordsData);
        setClinicians(usersData);
        setLoadError('');
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [clinician, refreshKey]);

  const total = records.length;
  const malariaLeading = records.filter((r) => r.result?.diagnosis === 'Malaria').length;
  const typhoidLeading = records.filter((r) => r.result?.diagnosis === 'Typhoid').length;
  const inconclusive = records.filter((r) => r.result?.diagnosis === 'Unknown / Refer to Clinician').length;
  const avgFeverDays = computeAvgFeverDays(records);
  const commonSymptom = computeMostCommonSymptom(records);
  const trends = computeTrends(records);
  const breakdown = computeAgeSexBreakdown(records);

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  const perClinician = useMemo(
    () => clinicians.map((c) => ({
      ...c,
      count: records.filter((r) => r.clinicianEmail === c.email).length,
    })),
    [clinicians, records],
  );

  const recent = records.slice(0, 8);

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  async function toggleClinicianActive(userId, active) {
    setActionError('');
    try {
      await setUserActive(userId, active);
      refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleRoleChange(userId, role) {
    setActionError('');
    try {
      await updateUserRole(userId, role);
      refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleDeleteClinician(userId, name) {
    setActionError('');
    if (!confirm(`Permanently delete ${name}'s account and all their saved screenings? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteUserAccount(userId);
      refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleAddClinician(e) {
    e.preventDefault();
    setAddError('');
    try {
      await createClinicianAccount(addForm);
      setAddForm({ name: '', email: '', password: '', role: ROLE_OPTIONS[0] });
      setShowAddForm(false);
      refresh();
    } catch (err) {
      setAddError(err.message);
    }
  }

  async function handleClearFacilityData() {
    try {
      await clearFacilityRecords();
      setConfirmingClear(false);
      setClearText('');
      refresh();
    } catch (err) {
      setActionError(err.message);
    }
  }

  const stats = [
    { key: 'total', label: 'Total screenings', value: total, sub: 'Across the facility', icon: IconActivity, tone: 'teal' },
    { key: 'malaria', label: 'Malaria-leaning', value: malariaLeading, sub: `${pct(malariaLeading)}% of screenings`, icon: IconDroplet, tone: 'amber' },
    { key: 'typhoid', label: 'Typhoid-leaning', value: typhoidLeading, sub: `${pct(typhoidLeading)}% of screenings`, icon: IconThermometer, tone: 'violet' },
    { key: 'inconclusive', label: 'Inconclusive / refer', value: inconclusive, sub: `${pct(inconclusive)}% need lab confirmation`, icon: IconAlert, tone: 'coral' },
  ];

  if (loading) {
    return <div className="page"><p>Loading facility dashboard…</p></div>;
  }

  return (
    <div className="page">
      <header
        className="page-hero page-hero--admin"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(109,90,196,0.85) 0%, rgba(76,63,145,0.82) 55%, rgba(15,58,56,0.88) 130%), url(${PHOTO_LAB_EQUIPMENT})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">Admin console</p>
          <h1 className="page-hero__title">Facility overview</h1>
          <p className="page-hero__sub">
            Screening activity across every clinician account at {facility || 'your facility'}
          </p>
        </div>
        <button className="btn btn--hero page-hero__cta" onClick={refresh} type="button">
          ↻ Refresh
        </button>
      </header>

      {loadError && <div className="auth-form__error" style={{ marginBottom: 16 }}>{loadError}</div>}

      <div className="stat-row">
        {stats.map(({ key, label, value, sub, icon: Icon, tone }) => (
          <div className="stat-tile" key={key}>
            <span className={`stat-tile__icon stat-tile__icon--${tone}`}><Icon width={19} height={19} /></span>
            <div className="stat-tile__body">
              <span className="stat-tile__value mono">{value}</span>
              <span className="stat-tile__label">{label}</span>
              <span className="stat-tile__sub">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="info-strip">
        <div className="info-strip__item">
          <IconUsers width={16} height={16} />
          <span>Clinicians on record</span>
          <strong>{clinicians.length}</strong>
        </div>
        <div className="info-strip__divider" />
        <div className="info-strip__item">
          <IconClock width={16} height={16} />
          <span>Avg. fever duration</span>
          <strong>{avgFeverDays || '—'} days</strong>
        </div>
        <div className="info-strip__divider" />
        <div className="info-strip__item">
          <IconTag width={16} height={16} />
          <span>Most reported symptom</span>
          <strong>{commonSymptom}</strong>
        </div>
      </div>

      <div className="chart-grid">
        <section className="panel">
          <div className="panel__head">
            <h3>Facility-wide trends</h3>
            <span className="hint">Last 14 days · avg fever: {avgFeverDays || '—'} days</span>
          </div>
          <TrendsChart data={trends} />
        </section>
        <section className="panel">
          <div className="panel__head">
            <h3>Age &amp; sex breakdown</h3>
            <span className="hint">All facility screenings</span>
          </div>
          <BreakdownChart data={breakdown} />
        </section>
      </div>

      <section className="panel">
        <div className="panel__head">
          <h3>Clinicians</h3>
          <button className="btn btn--ghost" type="button" onClick={() => setShowAddForm((s) => !s)}>
            {showAddForm ? 'Cancel' : '+ Add clinician'}
          </button>
        </div>

        {showAddForm && (
          <form className="form-grid" onSubmit={handleAddClinician} style={{ marginBottom: 20 }}>
            {addError && <div className="auth-form__error" style={{ gridColumn: '1 / -1' }}>{addError}</div>}
            <label className="field">
              <span>Full name</span>
              <input
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Email address</span>
              <input
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Temporary password</span>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={addForm.password}
                onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select value={addForm.role} onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>
            <div className="form-panel__actions" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn--primary" type="submit">Create account</button>
            </div>
          </form>
        )}

        {actionError && <div className="auth-form__error" style={{ marginBottom: 16 }}>{actionError}</div>}

        {perClinician.length === 0 ? (
          <div className="empty-state"><p>No clinician accounts yet.</p></div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Screenings</th><th>Joined</th><th>Last login</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {perClinician.map((c) => {
                const isActive = c.active !== false;
                return (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td className="mono">{c.email}</td>
                    <td>
                      <select value={c.role} onChange={(e) => handleRoleChange(c.id, e.target.value)}>
                        {!ROLE_OPTIONS.includes(c.role) && <option value={c.role}>{c.role}</option>}
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </td>
                    <td className="mono">{c.count}</td>
                    <td className="mono">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="mono">{c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <span className="badge" style={{
                        color: `var(${isActive ? '--good' : '--coral'})`,
                        background: `var(${isActive ? '--good-soft' : '--coral-soft'})`,
                      }}>
                        {isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button
                        className={`btn btn--ghost${isActive ? ' btn--danger-ghost' : ''}`}
                        type="button"
                        onClick={() => toggleClinicianActive(c.id, !isActive)}
                      >
                        {isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn--danger-ghost"
                        type="button"
                        onClick={() => handleDeleteClinician(c.id, c.name)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel">
        <div className="panel__head">
          <h3>Clear facility data</h3>
        </div>
        <p className="hint" style={{ display: 'block', marginBottom: 12 }}>
          Permanently deletes every screening record for {facility || 'your facility'}. Clinician accounts are kept, only their recorded screenings are removed. This cannot be undone.
        </p>
        {!confirmingClear ? (
          <button className="btn btn--danger-ghost" type="button" onClick={() => setConfirmingClear(true)} disabled={total === 0}>
            Clear facility data
          </button>
        ) : (
          <div className="field-row" style={{ alignItems: 'flex-end' }}>
            <label className="field">
              <span>Type "{facility}" to confirm</span>
              <input value={clearText} onChange={(e) => setClearText(e.target.value)} placeholder={facility} />
            </label>
            <button className="btn btn--danger-ghost" type="button" disabled={clearText !== facility} onClick={handleClearFacilityData}>
              Confirm delete
            </button>
            <button className="btn btn--ghost" type="button" onClick={() => { setConfirmingClear(false); setClearText(''); }}>
              Cancel
            </button>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__head">
          <h3>Recent facility activity</h3>
          <div className="export-actions">
            <button className="btn btn--ghost" onClick={() => exportRecordsToCSV(records, 'medidiag-facility-records.csv')}>
              Export CSV
            </button>
            <button className="btn btn--ghost" onClick={() => exportRecordsToPDF(records, { title: 'MediDiag Facility Records', subtitle: facility })}>
              Export PDF
            </button>
          </div>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state"><p>No screenings recorded yet.</p></div>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Patient</th><th>Clinician</th><th>Diagnosis</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recent.map((r) => {
                const meta = DIAGNOSIS_META[r.result?.diagnosis] || DIAGNOSIS_META['Unknown / Refer to Clinician'];
                return (
                  <tr key={r.id}>
                    <td>{r.patientName}</td>
                    <td>{r.clinicianName || '—'}</td>
                    <td>
                      <span className="badge" style={{ color: meta.color, background: meta.bg }}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="mono">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <p className="hint" style={{ display: 'block', marginTop: -6 }}>
        Data is now stored in a real backend database, shared across every device and browser at this facility.{' '}
        <Link to="/admin/profile">Manage your admin profile →</Link>
      </p>
    </div>
  );
}
