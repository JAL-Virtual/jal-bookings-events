'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  accessLevel: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface StaffManagementProps {
  adminApiKey: string;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({ adminApiKey }) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStaffData, setAddStaffData] = useState({
    apiKey: '',
    role: 'STAFF_MEMBER'
  });
  const [addStaffLoading, setAddStaffLoading] = useState(false);
  const [validatedStaffName, setValidatedStaffName] = useState<string | null>(null);
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false);

  // Fetch staff members
  const fetchStaffMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/staff?adminApiKey=${adminApiKey}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStaffMembers(data.staffMembers || []);
        setError(null);
      } else {
        setError('No staff members have been added yet');
      }
    } catch (err: unknown) {
      console.error('Error fetching staff members:', err);
      setError('No staff members have been added yet');
    } finally {
      setLoading(false);
    }
  }, [adminApiKey]);

  useEffect(() => {
    fetchStaffMembers();
  }, [fetchStaffMembers]);

  // Validate API key and fetch staff name
  const handleValidateApiKey = async () => {
    if (!addStaffData.apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    try {
      setIsValidatingApiKey(true);
      setError(null);
      
      const response = await fetch('/api/staff/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: addStaffData.apiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.staffName) {
        setValidatedStaffName(data.staffName);
        setError(null);
      } else {
        setError(data.error || 'Invalid API key');
        setValidatedStaffName(null);
      }
    } catch (err: unknown) {
      console.error('Error validating API key:', err);
      setError(err instanceof Error ? err.message : 'Failed to validate API key');
      setValidatedStaffName(null);
    } finally {
      setIsValidatingApiKey(false);
    }
  };

  // Handle edit staff
  const handleEditStaff = async (staffData: Partial<StaffMember>) => {
    if (!editingStaff) return;

    try {
      setError(null);
      const response = await fetch('/api/staff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingStaff.id,
          ...staffData,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchStaffMembers(); // Refresh the list
        setEditingStaff(null);
      } else {
        setError(data.error || 'Failed to update staff member');
      }
    } catch (err: unknown) {
      console.error('Error updating staff member:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    }
  };

  // Handle delete staff
  const handleDeleteStaff = async (staffId: string) => {
    try {
      setError(null);
      const response = await fetch('/api/staff', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: staffId,
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchStaffMembers(); // Refresh the list
        setShowDeleteConfirm(null);
      } else {
        setError(data.error || 'Failed to delete staff member');
      }
    } catch (err: unknown) {
      console.error('Error deleting staff member:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    }
  };

  // Handle add staff
  const handleAddStaff = async () => {
    if (!validatedStaffName) {
      setError('Please validate the API key first');
      return;
    }

    try {
      setAddStaffLoading(true);
      setError(null);
      
      const response = await fetch('/api/staff/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validatedStaffName,
          email: '', // Will be empty since we're not collecting it
          apiKey: addStaffData.apiKey,
          role: addStaffData.role,
          department: '', // Will be empty since we're not collecting it
          accessLevel: addStaffData.role === 'ADMINISTRATOR' ? 'ADMIN' : 'STAFF',
          adminApiKey,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchStaffMembers(); // Refresh the list
        setShowAddModal(false);
        setAddStaffData({
          apiKey: '',
          role: 'STAFF_MEMBER'
        });
        setValidatedStaffName(null);
      } else {
        setError(data.error || 'Failed to add staff member');
      }
    } catch (err: unknown) {
      console.error('Error adding staff member:', err);
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setAddStaffLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/20';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/20';
      case 'INACTIVE': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMINISTRATOR': return 'text-red-400 bg-red-400/20';
      case 'STAFF_MEMBER': return 'text-blue-400 bg-blue-400/20';
      case 'EVENT_MANAGER': return 'text-purple-400 bg-purple-400/20';
      case 'EVENT_COORDINATOR': return 'text-indigo-400 bg-indigo-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading staff members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Staff Management</h2>
          <p className="text-gray-400">Manage staff members and their access levels</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add Staff
          </button>
          <button
            onClick={fetchStaffMembers}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <p className="text-blue-400">{error}</p>
        </div>
      )}

      {/* Staff Members Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No staff members found
                  </td>
                </tr>
              ) : (
                staffMembers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{staff.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{staff.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(staff.role)}`}>
                        {staff.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{staff.department || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(staff.status)}`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(staff.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingStaff(staff)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(staff.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Edit Staff Member</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleEditStaff({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                role: formData.get('role') as string,
                department: formData.get('department') as string,
                accessLevel: formData.get('accessLevel') as string,
                status: formData.get('status') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingStaff.name}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStaff.email}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                  <select
                    name="role"
                    defaultValue={editingStaff.role}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ADMINISTRATOR">Administrator</option>
                    <option value="STAFF_MEMBER">Staff Member</option>
                    <option value="EVENT_MANAGER">Event Manager</option>
                    <option value="EVENT_COORDINATOR">Event Coordinator</option>
                    <option value="SUPPORT_STAFF">Support Staff</option>
                    <option value="GENERAL_STAFF">General Staff</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingStaff.department || ''}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Access Level</label>
                  <select
                    name="accessLevel"
                    defaultValue={editingStaff.accessLevel}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={editingStaff.status}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this staff member? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStaff(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-white mb-4">Add New Staff Member</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addStaffData.apiKey}
                    onChange={(e) => setAddStaffData({...addStaffData, apiKey: e.target.value})}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    placeholder="Enter staff API key"
                  />
                  <button
                    onClick={handleValidateApiKey}
                    disabled={isValidatingApiKey || !addStaffData.apiKey.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isValidatingApiKey ? 'Validating...' : 'Validate'}
                  </button>
                </div>
                {validatedStaffName && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ Validated: {validatedStaffName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={addStaffData.role}
                  onChange={(e) => setAddStaffData({...addStaffData, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="STAFF_MEMBER">Staff</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setAddStaffData({ apiKey: '', role: 'STAFF_MEMBER' });
                  setValidatedStaffName(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={addStaffLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={addStaffLoading || !validatedStaffName}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {addStaffLoading ? 'Adding...' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
