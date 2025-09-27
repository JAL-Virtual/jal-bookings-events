"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCookieConsent, ConsentAnwsers } from "../../contexts/CookieConsentContext";

export default function CookieConsentPage() {
  const router = useRouter();
  const { cookieConsent, setCookieConsent } = useCookieConsent();

  useEffect(() => {
    // If user already has consent (ACCEPTED or DECLINED), redirect to dashboard
    if (cookieConsent === ConsentAnwsers.ACCEPTED || cookieConsent === ConsentAnwsers.DECLINED) {
      router.push('/dashboard');
      return;
    }
    
    // If user hasn't given consent yet, show the consent page
  }, [cookieConsent, router]);

  const handleAccept = () => {
    setCookieConsent(ConsentAnwsers.ACCEPTED);
    router.push('/dashboard');
  };

  const handleDecline = () => {
    setCookieConsent(ConsentAnwsers.DECLINED);
    router.push('/dashboard');
  };

  // Show loading while checking consent status
  if (cookieConsent === ConsentAnwsers.ACCEPTED || cookieConsent === ConsentAnwsers.DECLINED) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* JAL Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-12 h-12 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-lg font-bold">JL</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Japan Airlines Virtual
          </h1>
          <p className="text-gray-400">Event Booking Portal</p>
        </div>

        {/* Cookie Consent Content */}
        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Cookie Consent
          </h2>
          
          <div className="text-gray-300 space-y-4 mb-6">
            <p>
              We use cookies to enhance your experience on our Event Booking Portal. 
              Cookies help us provide you with personalized content and improve our services.
            </p>
            
            <div className="bg-gray-700 rounded p-4">
              <h3 className="font-semibold text-white mb-2">Types of cookies we use:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                <li><strong>Authentication Cookies:</strong> Store your login session securely</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
              </ul>
            </div>
            
            <p className="text-sm text-gray-400">
              By continuing to use our platform, you consent to our use of cookies. 
              You can change your preferences at any time in your browser settings.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAccept}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Accept All Cookies
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Decline Non-Essential
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>
            For more information about our cookie policy, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}