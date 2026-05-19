import React from 'react';

export const Logo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Black 'I' */}
    <rect x="25" y="35" width="45" height="12" fill="#111111" />
    <rect x="41.5" y="47" width="12" height="25" fill="#111111" />
    <rect x="25" y="72" width="45" height="12" fill="#111111" />
    
    {/* Purple Accent Arrow */}
    <path d="M55 15 H 85 V 45 H 73 V 27 H 55 V 15 Z" fill="#6c3ce9" />
  </svg>
);
