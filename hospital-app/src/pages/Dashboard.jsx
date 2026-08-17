import { Link } from 'react-router-dom';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { DIAGNOSIS_META } from '../utils/diagnosisEngine';
import { computeAgeSexBreakdown, computeAvgFeverDays, computeMostCommonSymptom, computeTrends } from '../utils/analytics';
import TrendsChart from '../components/TrendsChart';
import BreakdownChart from '../components/BreakdownChart';
import { PHOTO_CLINIC_ROOM } from '../assets/photos';

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
function IconPlusCircle(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="10" cy="10" r="7.3" />
      <path d="M10 6.5v7M6.5 10h7" />
    </svg>
  );
}
function IconFolder(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...props}>
      <path d="M2.5 5.2c0-.8.6-1.4 1.4-1.4h3.7l1.6 1.8h6.9c.8 0 1.4.6 1.4 1.4v7.8c0 .8-.6 1.4-1.4 1.4H3.9c-.8 0-1.4-.6-1.4-1.4V5.2Z" />
    </svg>
  );
}
function IconUser(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" {...props}>
      <circle cx="10" cy="6.6" r="3.2" />
      <path d="M3 17.2c.9-3.4 3.6-5.2 7-5.2s6.1 1.8 7 5.2" />
    </svg>
  );
}

export default function Dashboard() {
  const { records } = usePatients();
  const { clinician } = useAuth();

  const total = records.length;
  const malariaLeading = records.filter((r) => r.result.diagnosis === 'Malaria').length;
  const typhoidLeading = records.filter((r) => r.result.diagnosis === 'Typhoid').length;
  const inconclusive = records.filter((r) => r.result.diagnosis === 'Unknown / Refer to Clinician').length;
  const avgFeverDays = computeAvgFeverDays(records);
  const commonSymptom = computeMostCommonSymptom(records);
  const trends = computeTrends(records);
  const breakdown = computeAgeSexBreakdown(records);

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  const recent = records.slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  const stats = [
    { key: 'total', label: 'Total screenings', value: total, sub: 'All time on this device', icon: IconActivity, tone: 'teal' },
    { key: 'malaria', label: 'Malaria-leaning', value: malariaLeading, sub: `${pct(malariaLeading)}% of screenings`, icon: IconDroplet, tone: 'amber' },
    { key: 'typhoid', label: 'Typhoid-leaning', value: typhoidLeading, sub: `${pct(typhoidLeading)}% of screenings`, icon: IconThermometer, tone: 'violet' },
    { key: 'inconclusive', label: 'Inconclusive / refer', value: inconclusive, sub: `${pct(inconclusive)}% need lab confirmation`, icon: IconAlert, tone: 'coral' },
  ];

  const quickActions = [
    { to: '/diagnosis/new', label: 'New screening', text: 'Start a structured symptom review', icon: IconPlusCircle, tone: 'teal' },
    { to: '/patients', label: 'Patient records', text: 'Browse and filter past screenings', icon: IconFolder, tone: 'violet' },
    { to: '/profile', label: 'My profile', text: 'Update your account details', icon: IconUser, tone: 'amber' },
  ];

  return (
    <div className="page overview">
      <header
        className="page-hero"
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15,58,56,0.88) 0%, rgba(22,78,99,0.82) 55%, rgba(109,90,196,0.75) 130%), url(${PHOTO_CLINIC_ROOM})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="page-hero__pattern" aria-hidden="true" />
        <div className="page-hero__text">
          <p className="page-hero__eyebrow">{greeting}, {clinician?.name?.split(' ')[0] || 'Doctor'}</p>
          <h1 className="page-hero__title">Welcome back to MediDiag</h1>
          <p className="page-hero__sub">
            {today} · Screening activity at {clinician?.facility || 'your facility'}
          </p>
        </div>
        <Link to="/diagnosis/new" className="btn btn--hero page-hero__cta">+ New Screening</Link>
      </header>

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
            <h3>Screening trends</h3>
            <span className="hint">Last 14 days · diagnosis</span>
          </div>
          <TrendsChart data={trends} />
        </section>
        <section className="panel">
          <div className="panel__head">
            <h3>Age &amp; sex breakdown</h3>
            <span className="hint">All screenings</span>
          </div>
          <BreakdownChart data={breakdown} />
        </section>
      </div>

      <div className="quick-links">
        {quickActions.map(({ to, label, text, icon: Icon, tone }) => (
          <Link className="quick-link" to={to} key={to}>
            <span className={`quick-link__icon quick-link__icon--${tone}`}><Icon width={19} height={19} /></span>
            <span className="quick-link__body">
              <strong>{label}</strong>
              <span>{text}</span>
            </span>
            <span className="quick-link__arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>

      <section className="panel">
        <div className="panel__head">
          <h3>Recent screenings</h3>
          <Link to="/patients">View all →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <p>No screenings recorded yet on this device.</p>
            <Link to="/diagnosis/new" className="btn btn--primary">Start your first screening</Link>
          </div>
        ) : (
          <ul className="activity-list">
            {recent.map((r) => {
              const meta = DIAGNOSIS_META[r.result.diagnosis] || DIAGNOSIS_META['Unknown / Refer to Clinician'];
              return (
                <li className="activity-item" key={r.id}>
                  <span
                    className="activity-item__dot"
                    style={{ background: meta.color }}
                    aria-hidden="true"
                  />
                  <div className="activity-item__main">
                    <span className="activity-item__name">{r.patientName}</span>
                    <span className="activity-item__meta">
                      {Math.max(r.result.malariaPct, r.result.typhoidPct)}% confidence · {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="badge" style={{ color: meta.color, background: meta.bg }}>
                    {meta.label}
                  </span>
                  <Link to={`/patients/${r.id}`} className="activity-item__link">View →</Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
