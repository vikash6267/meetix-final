import React from 'react';

function Input({
  handleChange,
  value,
  placeholder,
  className,
  onKeyDown,
}) {
  return (
    <input
      onChange={handleChange}
      value={value}
      placeholder={placeholder}
      type="text"
      className={className}
      onKeyDown={onKeyDown}
    />
  );
}

export default Input;
