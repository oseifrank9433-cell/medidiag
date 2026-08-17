export default function VitalsPulse({ className = '', animated = true }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 40 H120 L140 40 L155 10 L172 70 L188 40 L205 40 L220 20 L235 60 L250 40 H400"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        style={
          animated
            ? {
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: 'draw-pulse 2.6s ease-in-out infinite',
              }
            : undefined
        }
      />
      <style>{`
        @keyframes draw-pulse {
          0% { stroke-dashoffset: 1; }
          45% { stroke-dashoffset: 0; }
          85% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.25; }
        }
      `}</style>
    </svg>
  );
}
