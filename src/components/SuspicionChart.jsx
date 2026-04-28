import React from 'react';

const SuspicionChart = ({ data, datasets, height = 60, max: manualMax }) => {
  const plotDatasets = datasets || (data ? [{ data, color: '#39ff14' }] : []);
  if (plotDatasets.length === 0) return null;

  const padding = 5;
  const width = 200;

  // Find max value across all datasets if not provided
  const allValues = plotDatasets.flatMap(ds => ds.data);
  const max = manualMax || Math.max(10, ...allValues);

  return (
    <div className="relative group w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(tick => (
          <line key={tick} x1="0" y1={height * tick} x2={width} y2={height * tick} stroke="white" strokeOpacity="0.05" strokeDasharray="2,2" />
        ))}
        
        {plotDatasets.map((ds, dsIdx) => {
          const points = ds.data.map((val, i) => {
            const x = (i / (Math.max(1, ds.data.length - 1))) * (width - padding * 2) + padding;
            const y = height - ((val / max) * (height - padding * 2) + padding);
            return `${x},${y}`;
          }).join(' ');

          return (
            <React.Fragment key={dsIdx}>
              {/* Glow Path */}
              <polyline
                fill="none"
                stroke={ds.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                className="opacity-20 blur-sm"
              />
              
              {/* Main Path */}
              <polyline
                fill="none"
                stroke={ds.color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
                style={{ filter: `drop-shadow(0 0 4px ${ds.color})` }}
              />

              {/* Last Point Indicator */}
              {ds.data.length > 0 && (
                <circle
                  cx={(ds.data.length - 1) / (Math.max(1, ds.data.length - 1)) * (width - padding * 2) + padding}
                  cy={height - ((ds.data[ds.data.length - 1] / max) * (height - padding * 2) + padding)}
                  r="2.5"
                  fill={ds.color}
                  className="animate-pulse"
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>
      
      {/* Legend for multiple datasets */}
      {plotDatasets.length > 1 && (
        <div className="absolute -top-6 left-0 flex gap-3">
          {plotDatasets.map((ds, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: ds.color }} />
              <span className="text-[8px] font-black text-white/40 uppercase">{ds.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuspicionChart;
