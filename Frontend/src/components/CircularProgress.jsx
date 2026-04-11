const CircularProgress = ({ value }) => {
  const radius = 48;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  return (
    <div className="relative">
      <svg height={radius * 2} width={radius * 2}>

        {/* 🔥 TRACK */}
        <circle
          stroke="var(--bg-hover)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* 🔥 PROGRESS */}
        <circle
          stroke="var(--accent)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.6s ease",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />

        {/* 🔥 TEXT */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          style={{
            fill: "var(--text-primary)",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {value}%
        </text>
      </svg>

      {/* 🔥 SUBTLE GLOW (ONLY IF HIGH PROGRESS) */}
      {value >= 70 && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-30 pointer-events-none"
          style={{
            background: "var(--accent-glow)",
          }}
        />
      )}
    </div>
  );
};

export default CircularProgress;