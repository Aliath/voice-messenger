import clsx from 'clsx';
import React, { useState } from 'react';
import './Input.scss';

type InputProps =
  Omit<React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement
  >, 'onChange'> & {
    value: string;
    onChange: (value: string) => void;
    className?: string;
  };

export const Input: React.FC<InputProps> = ({ value, onChange, className, ...props }) => {
  const [coreValue, setCoreValue] = useState(value);

  const onCoreChange = (event: React.ChangeEvent) => {
    const target = event.target as HTMLInputElement;

    setCoreValue(target.value);
  };

  const onCoreKeyDown = (event: KeyboardEvent) => {
    if(event.code === 'Enter' && coreValue.length) {
      onChange(coreValue);
    }
  };

  return (
    <input
    className={clsx('input', className)}
    onChange={onCoreChange}
    onKeyDown={onCoreKeyDown as any}
    value={coreValue}
    {...props}
    />
  );
}