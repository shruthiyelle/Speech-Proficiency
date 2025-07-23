import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, gradient = false }) => {
  return (
    <div
      className={clsx(
        'rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl',
        gradient
          ? 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
          : 'bg-white border border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={clsx('p-6 pb-3', className)}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={clsx('p-6 pt-3', className)}>{children}</div>;
};