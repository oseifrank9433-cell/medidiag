// Symptom checklist — ids and order MUST match the trained model's
// feature_names_in_ exactly, since these ids are sent straight to the model
// via /predict. This list was corrected on verification against the actual
// medidiag_model.pkl — a previous version used different symptom names in a
// different order that did not match training (see engine.py for details on
// the bug this caused). Do not hand-edit this list; if the model is
// retrained with a different feature set, regenerate this from
// model.feature_names_in_ again.
export const SYMPTOMS = [
  { id: 'high_fever', label: 'High fever' },
  { id: 'chills', label: 'Chills' },
  { id: 'shivering', label: 'Shivering' },
  { id: 'sweating', label: 'Sweating' },
  { id: 'headache', label: 'Headache' },
  { id: 'muscle_pain', label: 'Muscle pain' },
  { id: 'joint_pain', label: 'Joint pain' },
  { id: 'fatigue', label: 'Fatigue' },
  { id: 'dizziness', label: 'Dizziness' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'vomiting', label: 'Vomiting' },
  { id: 'abdominal_pain', label: 'Abdominal pain' },
  { id: 'diarrhoea', label: 'Diarrhoea' },
  { id: 'constipation', label: 'Constipation' },
  { id: 'loss_of_appetite', label: 'Loss of appetite' },
  { id: 'rash', label: 'Rash' },
  { id: 'weakness', label: 'Weakness' },
  { id: 'confusion', label: 'Confusion' },
  { id: 'cough', label: 'Cough' },
  { id: 'chest_pain', label: 'Chest pain' },
  { id: 'backache', label: 'Backache' },
  { id: 'general_body_malaise', label: 'General body malaise' },
];

// Visual styling per possible diagnosis value returned by the backend.
export const DIAGNOSIS_META = {
  Malaria: { label: 'Malaria likely', color: 'var(--amber)', bg: 'var(--amber-soft)' },
  Typhoid: { label: 'Typhoid likely', color: 'var(--violet-600)', bg: 'var(--violet-100)' },
  'Unknown / Refer to Clinician': { label: 'Inconclusive — refer to clinician', color: 'var(--coral)', bg: 'var(--coral-soft)' },
};

// Below this max(malariaPct, typhoidPct) confidence, the diagnosis is
// downgraded to "Unknown / Refer to Clinician" client-side (see utils/api.js).
// Admin-editable per facility in utils/facilitySettingsStore.js.
export const DEFAULT_CONFIDENCE_THRESHOLD = 60;
