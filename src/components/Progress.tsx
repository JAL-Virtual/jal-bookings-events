'use client';

import React, { useEffect } from 'react';

export interface ProgressProps {
  steps: Array<string>;
  onChange: (step: number) => void;
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({
  steps,
  onChange,
  value,
}) => {
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const getClassStatus = (index: number) => {
    return index <= value ? "completed" : "";
  };

  return (
    <div className="progress-wrapper">
      {steps.map((step, index) => (
        <div
          className={`progress-item ${getClassStatus(index)}`}
          key={step}
          onClick={() => onChange(index)}
          style={{ width: (100 / steps.length).toString() + "%" }}
        >
          <div className="progress-counter"></div>
          <div className="progress-legend">{step}</div>
        </div>
      ))}
    </div>
  );
};
