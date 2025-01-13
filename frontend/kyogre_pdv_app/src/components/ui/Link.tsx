import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export function Link({ children, className = '', ...props }: LinkProps) {
  return (
    <a {...props} className={`text-white no-underline ${className}`}>
      {children}
    </a>
  );
}