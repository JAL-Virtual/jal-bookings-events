'use client';

import React, { useState, useEffect } from 'react';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (key: string, type: 'admin' | 'staff') => void;
  defaultType?: 'admin' | 'staff';
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose, onLogin, defaultType = 'admin' }) => {
  const [key, setKey] = useState<string>('');
  const [loginType, setLoginType] = useState<'admin' | 'staff'>(defaultType);

  useEffect(() => {
    setLoginType(defaultType);
  }, [defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onLogin(key.trim(), loginType);
      setKey('');
      onClose();
    }
  };

  const handleClose = () => {
    setKey('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Login</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors duration-200 hover:scale-110"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Login As:</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="admin"
                  checked={loginType === 'admin'}
                  onChange={(e) => setLoginType(e.target.value as 'admin' | 'staff')}
                  className="mr-2 text-blue-600"
                />
                <span className="text-white">Administrator</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="staff"
                  checked={loginType === 'staff'}
                  onChange={(e) => setLoginType(e.target.value as 'admin' | 'staff')}
                  className="mr-2 text-blue-600"
                />
                <span className="text-white">Staff</span>
              </label>
            </div>
          </div>

          {/* Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {loginType === 'admin' ? 'Administrator Key:' : 'Staff Key:'}
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={`Enter ${loginType === 'admin' ? 'administrator' : 'staff'} key`}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
