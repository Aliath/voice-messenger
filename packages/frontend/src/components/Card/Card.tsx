import clsx from 'clsx';
import React from 'react';
import './Card.scss';

type CardProps = {
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={clsx('card', className)}>
      {children}
    </div>
  );
};
