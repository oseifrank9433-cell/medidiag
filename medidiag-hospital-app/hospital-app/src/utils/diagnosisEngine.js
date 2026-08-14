// Symptom checklist — ids and order MUST match the trained model's
// feature_names_in_ exactly, since these ids are sent straight to the model
// via /predict. This list was corrected on verification against the actual
// medidiag_model.pkl — a previous version used different symptom names in a
// different order that did not match training (see engine.py for details on
// the bug this caused). Do not hand-edit this list; if the model is
// retrained with a different feature set, regenerate this from
// model.feature_names_in_ again.
export const SYMPTOMS = [
  { id: "Abdominal_Pain",label: "Abdominal Pain"},
  {id: "Backache",label: "Backache"},
  {id: "Chest_Pain",label: "Chest Pain"},
  {id: "Confusion",label: "Confusion"},
  {id: "Constipation",label: "Constipation"},
  {id: "Coughing",label: "Coughing"},
  {id: "Diarrhea",label: "Diarrhea"},
  {id: "Dizziness",label: "Dizziness"},
  {id: "Fever",label: "Fever"},
  {id: "General_Body_Malaise",label: "General Body Malaise"},
  {id: "Headache",label: "Headache"},
  {id: "Joint_Pain",label: "Joint Pain"},
  {id: "Loss_Of_Appetite",label: "Loss Of Appetite"},
  {id: "Vomiting",label: "Vomiting"},
  {id: "Weakness",label: "Weakness"}
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
