import React from 'react';

export const BarChart = ({ data, title, color = '#adc6ff' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium truncate">{item.label}</div>
            <div className="flex-1 flex items-center space-x-2">
              <div className="flex-1 h-6 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color
                  }}
                />
              </div>
              <span className="text-sm font-bold w-12 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PieChart = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  const createSlice = (item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;
    
    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return (
      <g key={index}>
        <path
          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={item.color}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        />
      </g>
    );
  };
  
  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex items-center space-x-6">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {data.map((item, index) => createSlice(item, index))}
        </svg>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm">{item.label}</span>
              <span className="text-sm font-bold">({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LineChart = ({ data, title, color = '#adc6ff' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value / maxValue) * 100);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="h-40 relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#424754"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value / maxValue) * 100);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="hover:r-4 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-on-surface-variant">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
