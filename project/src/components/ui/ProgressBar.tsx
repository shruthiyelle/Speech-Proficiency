import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  color = 'blue',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={clsx('w-full bg-gray-200 rounded-full h-3', className)}>
      <div
        className={clsx(
          'h-3 rounded-full transition-all duration-300 ease-out',
          {
            'bg-gradient-to-r from-blue-500 to-blue-600': color === 'blue',
            'bg-gradient-to-r from-green-500 to-green-600': color === 'green',
            'bg-gradient-to-r from-red-500 to-red-600': color === 'red',
            'bg-gradient-to-r from-yellow-500 to-yellow-600': color === 'yellow',
          }
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};