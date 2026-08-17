import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TrendsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--paper-raised)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            fontSize: 12.5,
          }}
        />
        <Line type="monotone" dataKey="malaria" name="Malaria" stroke="var(--amber)" strokeWidth={2.4} dot={false} />
        <Line type="monotone" dataKey="typhoid" name="Typhoid" stroke="var(--teal-500)" strokeWidth={2.4} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
