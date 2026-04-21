import React from 'react';

const AXES = ['ifs', 'toc', 'du', 'ai', 'mrp', 'ap', 'co'];

export default function RadarChart({ userVector, targetVector, size = 200, isSecondary = false }) {
  const center = size / 2;
  const radius = size / 2.5; // leaving room for labels

  const getPoint = (val, index) => {
    // 7 axes
    const angle = (Math.PI * 2 * index) / 7 - Math.PI / 2; // start at top
    // val is 0 to 100
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const userPoints = AXES.map((axis, i) => getPoint(userVector[axis] || 50, i)).join(' ');
  const targetPoints = targetVector ? AXES.map((axis, i) => getPoint(targetVector[axis] || 50, i)).join(' ') : '';

  // Background webs
  const webs = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
    const pts = AXES.map((_, i) => getPoint(scale * 100, i)).join(' ');
    return <polygon key={scale} points={pts} fill="none" stroke="rgba(255,255,255,0.05)" />;
  });

  const axisLines = AXES.map((axis, i) => {
    const pt = getPoint(100, i);
    return <line key={axis} x1={center} y1={center} x2={pt.split(',')[0]} y2={pt.split(',')[1]} stroke="rgba(255,255,255,0.05)" />;
  });

  const axisLabels = AXES.map((axis, i) => {
    // push labels slightly further out than radius
    const angle = (Math.PI * 2 * i) / 7 - Math.PI / 2;
    const r = radius + 15;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return (
      <text key={axis} x={x} y={y} fill="#8A8F98" fontSize="10" textAnchor="middle" alignmentBaseline="middle">
        {axis.toUpperCase()}
      </text>
    );
  });

  const targetColor = isSecondary ? '#FF7A18' : '#1FE0C9';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {webs}
      {axisLines}
      {axisLabels}

      {/* Target Vector */}
      {targetVector && (
        <polygon 
          points={targetPoints} 
          fill={targetColor} 
          fillOpacity="0.15" 
          stroke={targetColor} 
          strokeWidth="2" 
        />
      )}

      {/* User Vector */}
      <polygon 
        points={userPoints} 
        fill="transparent" 
        stroke="#FF7A18" 
        strokeWidth="2" 
      />
    </svg>
  );
}
