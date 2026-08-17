import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function BreakdownChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 6, right: 12, left: -18, bottom: 0 }}>
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
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="female" name="Female" stackId="a" fill="var(--violet-600)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="male" name="Male" stackId="a" fill="var(--teal-500)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="other" name="Other" stackId="a" fill="var(--gold)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
