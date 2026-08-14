import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function toCSVValue(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportRecordsToCSV(records, filename = 'medidiag-records.csv') {
  const headers = [
    'ID', 'Patient', 'Age', 'Sex', 'Temperature (C)', 'Fever days',
    'Diagnosis', 'Malaria %', 'Typhoid %', 'Recommended action', 'Date',
  ];
  const rows = records.map((r) => [
    r.id,
    r.patientName,
    r.age,
    r.sex,
    r.vitals?.temperature,
    r.vitals?.feverDays,
    r.result?.diagnosis,
    r.result?.malariaPct,
    r.result?.typhoidPct,
    r.result?.drug,
    new Date(r.createdAt).toLocaleString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(toCSVValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportRecordsToPDF(records, { title = 'MediDiag Patient Records', subtitle = '' } = {}) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(14, 84, 80);
  doc.text(title, 14, 18);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(subtitle, 14, 25);
  }

  autoTable(doc, {
    startY: 30,
    head: [['Patient', 'Age/Sex', 'Diagnosis', 'Malaria %', 'Typhoid %', 'Date']],
    body: records.map((r) => [
      r.patientName,
      `${r.age || '—'} / ${r.sex}`,
      r.result?.diagnosis,
      `${r.result?.malariaPct}%`,
      `${r.result?.typhoidPct}%`,
      new Date(r.createdAt).toLocaleDateString(),
    ]),
    headStyles: { fillColor: [14, 84, 80] },
    styles: { fontSize: 9 },
  });

  doc.save('medidiag-records.pdf');
}
