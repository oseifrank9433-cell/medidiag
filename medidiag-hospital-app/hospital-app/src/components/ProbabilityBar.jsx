export default function ProbabilityBar({ label, percent, color, sublabel }) {
  return (
    <div className="prob-bar">
      <div className="prob-bar__head">
        <span className="prob-bar__label">{label}</span>
        <span className="prob-bar__pct mono">{percent}%</span>
      </div>
      <div className="prob-bar__track">
        <div
          className="prob-bar__fill"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
      {sublabel && <span className="prob-bar__sub">{sublabel}</span>}
    </div>
  );
}
