import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VitalsPulse from '../components/VitalsPulse';
import { PHOTO_DOCTOR_PORTRAIT, PHOTO_CONSULT_COUCH } from '../assets/photos';

function IconStack(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}
function IconGauge(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 15.2 10" />
      <path d="M12 15h.01" />
    </svg>
  );
}
function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
function IconChecklist(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}
function IconLayers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}
function IconExport(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

const STEPS = [
  {
    num: '01',
    title: 'Tick the symptoms',
    text: 'Record what the patient reports from a checklist built around 22 clinically documented malaria and typhoid presentations.',
  },
  {
    num: '02',
    title: 'The model compares patterns',
    text: 'A classifier trained on confirmed case data weighs the whole combination of symptoms not one red flag in isolation.',
  },
  {
    num: '03',
    title: 'Get a confidence-scored result',
    text: 'See the probability split for both conditions and a recommended next step, including when to defer straight to lab testing.',
  },
];

const FEATURES = [
  {
    icon: IconChecklist,
    tone: 'teal',
    title: 'Structured Symptom Capture',
    text: 'A consistent checklist replaces free-form notes, so two clinicians screening the same case land on the same inputs.',
  },
  {
    icon: IconLayers,
    tone: 'violet',
    title: 'Side-by-Side Likelihood',
    text: "Malaria and typhoid probabilities sit next to each other, with a plain refer-to-clinician fallback whenever the model isn't confident enough to call it.",
  },
  {
    icon: IconExport,
    tone: 'amber',
    title: 'Facility-Wide Oversight',
    text: 'Admins track trends, export records, and set how confident the model must be before committing to a diagnosis — tuned per facility.',
  },
];

function DiagnosisDemo() {
  return (
    <div className="diagnosis-demo" aria-hidden="true">
      <p className="diagnosis-demo__label">Live example</p>
      <div className="diagnosis-demo__chips">
        <span className="diagnosis-demo__chip diagnosis-demo__chip--1">Fever</span>
        <span className="diagnosis-demo__chip diagnosis-demo__chip--2">Chills</span>
        <span className="diagnosis-demo__chip diagnosis-demo__chip--3">Headache</span>
        <span className="diagnosis-demo__chip diagnosis-demo__chip--4">Joint pain</span>
      </div>
      <div className="diagnosis-demo__bars">
        <div className="diagnosis-demo__bar-row">
          <span>Malaria</span>
          <div className="diagnosis-demo__track"><div className="diagnosis-demo__fill diagnosis-demo__fill--malaria" /></div>
          <strong>78%</strong>
        </div>
        <div className="diagnosis-demo__bar-row">
          <span>Typhoid</span>
          <div className="diagnosis-demo__track"><div className="diagnosis-demo__fill diagnosis-demo__fill--typhoid" /></div>
          <strong>22%</strong>
        </div>
      </div>
      <span className="diagnosis-demo__badge">Malaria likely</span>
    </div>
  );
}

export default function Landing() {
  const { clinician } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dashboardPath = clinician?.accountType === 'admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="landing">
      <div className="landing-topbar">
        <span>Support: 24/7 AI-Assisted Screening</span>
        <span>Email Us: support@medidiag.app</span>
      </div>

      <header className="landing-nav">
        <div className="landing-nav__brand">
          <VitalsPulse className="landing-nav__pulse" />
          <span>MediDiag</span>
        </div>
        <nav className="landing-nav__links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </nav>
        <div className="landing-nav__actions">
          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {clinician ? (
            <Link className="btn btn--primary" to={dashboardPath}>Go to Dashboard</Link>
          ) : (
            <>
              <Link className="landing-nav__signin" to="/login">Sign In</Link>
              <Link className="btn btn--primary" to="/signup">Get Started</Link>
            </>
          )}
        </div>
      </header>

      <section
        id="home"
        className="landing-hero"
        style={{ backgroundImage: `linear-gradient(120deg, rgba(10,61,58,0.94), rgba(14,84,80,0.82)), url(${PHOTO_DOCTOR_PORTRAIT})` }}
      >
        <div className="landing-hero__content">
          <p className="landing-hero__eyebrow">Clinical Decision Support · Fever Screening</p>
          <h1 className="landing-hero__title">
            One fever. Two likely causes. Now you can tell which.
          </h1>
          <p className="landing-hero__text">
            MediDiag compares a patient's symptom pattern against a model trained on confirmed
            malaria and typhoid cases giving frontline clinicians in resource limited settings a
            confidence scored second opinion, no lab wait required to start deciding.
          </p>
          <div className="landing-hero__actions">
            <Link className="btn btn--hero" to={clinician ? dashboardPath : '/signup'}>
              {clinician ? 'Go to Dashboard' : 'Start Screening'} <span aria-hidden="true">→</span>
            </Link>
            <div className="landing-hero__contact">
              <span className="landing-hero__contact-icon"><IconPhone width={18} height={18} /></span>
              <div>
                <div className="landing-hero__contact-label">Need Support?</div>
                <div className="landing-hero__contact-value">support@medidiag.app</div>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-hero__demo-wrap">
          <DiagnosisDemo />
        </div>
      </section>

      <section id="how-it-works" className="landing-steps">
        <div className="landing-steps__head">
          <p className="eyebrow">How It Works</p>
          <h2>From symptoms to a confidence-scored result</h2>
        </div>
        <div className="landing-steps__grid">
          {STEPS.map((s) => (
            <div className="landing-step" key={s.num}>
              <div className="landing-step__num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="landing-about">
        <div className="landing-about__media">
          <img src={PHOTO_CONSULT_COUCH} alt="Clinician reviewing a patient case" />
          <div className="landing-about__badge">
            <span className="landing-about__badge-icon"><IconStack width={18} height={18} /></span>
            <div>
              <strong>Consistent Care</strong>
              <p>Every screening follows the same structured, evidence-based flow.</p>
            </div>
          </div>
        </div>

        <div className="landing-about__content">
          <p className="eyebrow">About MediDiag</p>
          <h2>Built for outpatient triage, not a hospital lab</h2>
          <p className="landing-about__text">
            Malaria and typhoid fever look nearly identical at first presentation, yet call for
            different treatment. MediDiag is built for the clinics where a rapid diagnostic test or
            blood culture is not always on hand so the symptom pattern itself becomes the first,
            fast signal.
          </p>

          <div className="landing-about__stats">
            <div className="landing-about__stat">
              <span className="landing-about__stat-icon"><IconChecklist width={20} height={20} /></span>
              <strong>22</strong>
              <p>Symptoms in the checklist</p>
            </div>
            <div className="landing-about__stat">
              <span className="landing-about__stat-icon"><IconClock width={20} height={20} /></span>
              <strong>&lt; 1 min</strong>
              <p>To run a screening</p>
            </div>
            <div className="landing-about__stat">
              <span className="landing-about__stat-icon"><IconGauge width={20} height={20} /></span>
              <strong>Facility-set</strong>
              <p>Confidence threshold</p>
            </div>
          </div>

          <Link className="btn btn--primary" to={clinician ? dashboardPath : '/signup'}>
            Learn More <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section id="features" className="landing-features">
        <div className="landing-features__head">
          <p className="eyebrow">Features</p>
          <h2>Our Diagnostic Capabilities</h2>
        </div>

        <div className="landing-features__grid">
          {FEATURES.map(({ icon: Icon, tone, title, text }) => (
            <div className="landing-feature-card" key={title}>
              <div className={`landing-feature-card__icon landing-feature-card__icon--${tone}`}>
                <Icon width={22} height={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="landing-footer">
        <div className="landing-nav__brand">
          <VitalsPulse className="landing-nav__pulse" animated={false} />
          <span>MediDiag</span>
        </div>
        <p>A fever-screening workspace for frontline clinicians.</p>
        <p className="landing-footer__copy">© {new Date().getFullYear()} MediDiag. All rights reserved.</p>
      </footer>
    </div>
  );
}
