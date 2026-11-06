import React from 'react';

interface Props {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  darkBg?: boolean;
}

export const EMLogo: React.FC<Props> = ({ 
  className = '', 
  variant = 'full',
  size = 'md',
  darkBg = false
}) => {
  const heightClass = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  }[size];

  if (variant === 'badge' || variant === 'icon') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <img
          src="/app-icon.jpg"
          alt="EM SERVICIOS ELÉCTRICOS"
          className={`${heightClass} aspect-square rounded-full object-cover shadow-md border-2 border-amber-400 bg-white`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Company Logo */}
      <img
        src="/em-logo-full.jpg"
        alt="EM SERVICIOS ELÉCTRICOS Logo Oficial"
        className={`${heightClass} object-contain bg-white rounded-lg p-1 shadow-xs`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
