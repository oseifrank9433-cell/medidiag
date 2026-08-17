import { SYMPTOMS } from './diagnosisEngine';

export function computeTrends(records, days = 14) {
  const buckets = {};
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = { date: key, malaria: 0, typhoid: 0 };
  }
  records.forEach((r) => {
    const key = new Date(r.createdAt).toISOString().slice(0, 10);
    if (!buckets[key]) return;
    if (r.result?.diagnosis === 'Malaria') buckets[key].malaria += 1;
    else if (r.result?.diagnosis === 'Typhoid') buckets[key].typhoid += 1;
  });
  return Object.values(buckets).map((b) => ({
    ...b,
    label: new Date(b.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));
}

export function computeAgeSexBreakdown(records) {
  const bands = [
    { label: '0–5', min: 0, max: 5 },
    { label: '6–17', min: 6, max: 17 },
    { label: '18–35', min: 18, max: 35 },
    { label: '36–60', min: 36, max: 60 },
    { label: '60+', min: 61, max: 999 },
  ];
  return bands.map((band) => {
    const inBand = records.filter((r) => {
      const age = Number(r.age);
      return !Number.isNaN(age) && age >= band.min && age <= band.max;
    });
    return {
      label: band.label,
      male: inBand.filter((r) => r.sex === 'Male').length,
      female: inBand.filter((r) => r.sex === 'Female').length,
      other: inBand.filter((r) => r.sex === 'Other').length,
    };
  });
}

export function computeAvgFeverDays(records) {
  const values = records.map((r) => Number(r.vitals?.feverDays)).filter((v) => !Number.isNaN(v) && v > 0);
  if (values.length === 0) return 0;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export function computeMostCommonSymptom(records) {
  const counts = {};
  records.forEach((r) => {
    (r.symptoms || []).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (!topId) return '—';
  return SYMPTOMS.find((s) => s.id === topId)?.label || '—';
}
