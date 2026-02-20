import React from 'react';

export interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  const clamped = Math.max(0, Math.min(percent, 100));
  return (
    <div
      style={{
        width: '80%',
        height: '42px',
        border: 'solid #218e79 8px',
        borderRadius: '21px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: '#218e79',
          width: `${clamped}%`,
          transition: 'width 0.1s'
        }}
      />
    </div>
  );
};

export default ProgressBar;
