/*
© 2025 The Christman AI Project. All rights reserved.

This code is released as part of a trauma-informed, dignity-first AI ecosystem
designed to protect, empower, and elevate vulnerable populations.

By using, modifying, or distributing this software, you agree to uphold the following:
1. Truth — No deception, no manipulation.
2. Dignity — Respect the autonomy and humanity of all users.
3. Protection — Never use this to exploit or harm vulnerable individuals.
4. Transparency — Disclose all modifications and contributions clearly.
5. No Erasure — Preserve the mission and ethical origin of this work.

This is not just code. This is redemption in code.
Contact: lumacognify@thechristmanaiproject.com
https://thechristmanaiproject.com
*/


import React from 'react';

interface AdvancedToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AdvancedToggle: React.FC<AdvancedToggleProps> = ({
  enabled,
  onToggle,
  label,
  description,
  disabled = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-12 h-6', 
    lg: 'w-14 h-7'
  };

  const knobSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: enabled ? 'translate-x-5' : 'translate-x-0.5',
    md: enabled ? 'translate-x-6' : 'translate-x-0.5', 
    lg: enabled ? 'translate-x-7' : 'translate-x-0.5'
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        <h3 className="font-medium text-text-primary mb-1">{label}</h3>
        {description && (
          <p className="text-sm text-text-secondary">{description}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {/* Status indicator */}
        <span className={`text-sm font-medium ${
          enabled ? 'text-green-400' : 'text-gray-500'
        }`}>
          {enabled ? 'ON' : 'OFF'}
        </span>
        
        {/* Toggle switch */}
        <button
          type="button"
          onClick={() => !disabled && onToggle(!enabled)}
          disabled={disabled}
          className={`
            ${sizeClasses[size]}
            relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-cyan
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${enabled 
              ? 'bg-gradient-to-r from-electric-cyan to-accent shadow-lg' 
              : 'bg-gray-600 border border-gray-500'
            }
          `}
        >
          <span
            className={`
              ${knobSizeClasses[size]}
              ${translateClasses[size]}
              inline-block rounded-full transition-transform duration-300 ease-in-out
              ${enabled 
                ? 'bg-white shadow-md' 
                : 'bg-gray-300'
              }
            `}
          />
        </button>
      </div>
    </div>
  );
};

export default AdvancedToggle;