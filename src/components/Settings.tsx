'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';

export const Settings: React.FC = () => {
  const [vaId, setVaId] = useState<string>('');
  const { showSuccess } = useToast();

  useEffect(() => {
    // Load stored VA ID
    const storedVaId = localStorage.getItem('jal_va_id');
    if (storedVaId) {
      setVaId(storedVaId);
    }
  }, []);

  const handleVaIdSave = () => {
    if (vaId.trim()) {
      localStorage.setItem('jal_va_id', vaId.trim());
      showSuccess('Virtual Airline ID saved successfully!', 2000);
    }
  };

  const handleVaIdChange = (value: string) => {
    // Format as XXX 0000
    const formatted = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (formatted.length <= 7) {
      if (formatted.length > 3) {
        setVaId(formatted.slice(0, 3) + ' ' + formatted.slice(3));
      } else {
        setVaId(formatted);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-gray-400">Manage your account settings</p>
      </div>

      {/* Virtual Airline ID Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Virtual Airline ID</h3>
        <p className="text-gray-300 mb-4">
          Your Virtual Airline ID is used to identify you in the system.
        </p>
        
        <div className="flex items-center gap-4 mt-6">
          <input
            type="text"
            value={vaId}
            onChange={(e) => handleVaIdChange(e.target.value)}
            placeholder="JAL 1234"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-center text-lg tracking-widest"
            maxLength={8}
          />
          <button
            onClick={handleVaIdSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            Save
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Information</h3>
        <div className="space-y-2 text-gray-300">
          <p>• Virtual Airline ID format: XXX 0000 (e.g., JAL 1234)</p>
        </div>
      </div>
    </div>
  );
};