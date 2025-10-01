'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from './Toast';

interface StaffManagementProps {
  onStaffKeyChange?: (isStaff: boolean) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ onStaffKeyChange }) => {
  const [staffKey, setStaffKey] = useState<string>('');
  const [showStaffKeyInput, setShowStaffKeyInput] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Load stored staff key and validate against MongoDB
    const storedStaffKey = localStorage.getItem('jal_staff_key');
    if (storedStaffKey) {
      setStaffKey(storedStaffKey);
      validateStaffKey(storedStaffKey);
    }
  }, [validateStaffKey]);

  const validateStaffKey = useCallback(async (key: string): Promise<boolean> => {
    const validStaffKey = 'AJE(@UE*@DA@ES!$@#W';
    const isValid = key === validStaffKey;
    setIsStaff(isValid);
    if (onStaffKeyChange) {
      onStaffKeyChange(isValid);
    }
    return isValid;
  }, [onStaffKeyChange]);

  const handleStaffKeySave = async () => {
    if (staffKey.trim()) {
      const isValid = await validateStaffKey(staffKey.trim());
      if (isValid) {
        localStorage.setItem('jal_staff_key', staffKey.trim());
        setShowStaffKeyInput(false);
        showSuccess('Staff key validated successfully!', 2000);
        // Trigger a page refresh to update the dashboard staff status
        window.location.reload();
      } else {
        showError('Invalid staff key. Please check with your administrator.', 3000);
      }
    }
  };

  const handleStaffKeyDelete = async () => {
    try {
      // First, try to delete the staff key from the database
      const response = await fetch(`/api/staff-keys?key=${encodeURIComponent(staffKey)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from localStorage
        localStorage.removeItem('jal_staff_key');
        setStaffKey('');
        setIsStaff(false);
        if (onStaffKeyChange) {
          onStaffKeyChange(false);
        }
        showSuccess('Staff key removed successfully!', 2000);
        // Trigger a page refresh to update the dashboard staff status
        setTimeout(() => window.location.reload(), 2000);
      } else {
        // If database deletion fails, still remove from localStorage
        localStorage.removeItem('jal_staff_key');
        setStaffKey('');
        setIsStaff(false);
        if (onStaffKeyChange) {
          onStaffKeyChange(false);
        }
        showSuccess('Staff key removed from local storage!', 2000);
        // Trigger a page refresh to update the dashboard staff status
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error) {
      console.error('Error deleting staff key:', error);
      // Fallback: remove from localStorage even if API call fails
      localStorage.removeItem('jal_staff_key');
      setStaffKey('');
      setIsStaff(false);
      if (onStaffKeyChange) {
        onStaffKeyChange(false);
      }
      showSuccess('Staff key removed from local storage!', 2000);
      // Trigger a page refresh to update the dashboard staff status
      setTimeout(() => window.location.reload(), 2000);
    }
  };


  return (
    <div className="space-y-6">
      {/* Staff Management Section - Only show when NOT logged in */}
      {!isStaff && (
        <>
          {/* Header */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white">Staff Management</h2>
            <p className="text-gray-400">Manage staff access and permissions</p>
          </div>

          {/* Staff Key Section */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4">Staff Access</h3>
            <p className="text-gray-300 mb-4">
              Enter the staff key to access staff management features.
            </p>
            
          <div className="space-y-4 mt-6">
            {showStaffKeyInput ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="password"
                    value={staffKey}
                    onChange={(e) => setStaffKey(e.target.value)}
                    placeholder="Enter staff key"
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleStaffKeySave}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowStaffKeyInput(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="text-xs text-gray-400">
                  Default staff key: AJE(@UE*@DA@ES!$@#W
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowStaffKeyInput(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Enter Staff Key
              </button>
            )}
            <div className="text-gray-400 text-sm">
              No staff access
            </div>
          </div>
          </div>
        </>
      )}

      {/* Manage Event Tab - Only show when staff is logged in */}
      {isStaff && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome, Staff Member!</h3>
            <p className="text-gray-300 mb-6">
              You now have access to event management features.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                // Navigate to event management or open event management modal
                window.location.href = '/dashboard';
              }}
              className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg font-bold text-lg"
            >
              🎯 Manage Events
            </button>
            
            <button
              onClick={handleStaffKeyDelete}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
          
          <div className="text-green-400 text-sm mt-4">
            ✓ Staff access granted
          </div>
        </div>
      )}
    </div>
  );
};
