import React from 'react';

interface FooterProps {
  companyName?: string;
  year?: number;
  privacyPolicyUrl?: string;
  termsOfUseUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  companyName = 'Japan Airlines Virtual - Event Booking Portal',
  year = 2025,
  privacyPolicyUrl = '#',
  termsOfUseUrl = '#'
}) => {
  return (
    <footer className="mt-16 text-center text-white text-sm">
      <div className="mb-2">©{year} {companyName}. All Rights Reserved.</div>
      <div className="space-x-4">
        <a href={privacyPolicyUrl} className="hover:underline">Privacy Policy</a>
        <span>|</span>
        <a href={termsOfUseUrl} className="hover:underline">Terms of Use</a>
      </div>
    </footer>
  );
};
