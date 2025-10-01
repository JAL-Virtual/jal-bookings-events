'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Event } from '../types/Event';

interface AuditLog {
  id: string;
  eventId: string;
  eventName: string;
  eventData: Event;
  action: 'created' | 'updated' | 'deleted';
  timestamp: string;
  adminId: string;
}

interface AuditLogsProps {
  adminApiKey: string;
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ adminApiKey }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'created' | 'updated' | 'deleted'>('all');

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/audit-logs?adminApiKey=${adminApiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      
      const data = await response.json();
      setAuditLogs(data.auditLogs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [adminApiKey]);

  useEffect(() => {
    fetchAuditLogs();
  }, [adminApiKey, fetchAuditLogs]);

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'all') return true;
    return log.action === filter;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-400 bg-green-900/20';
      case 'updated':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'deleted':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return '➕';
      case 'updated':
        return '✏️';
      case 'deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchAuditLogs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-gray-400 mt-1">Track all event changes and deletions</p>
        </div>
        <button 
          onClick={fetchAuditLogs}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'created', 'updated', 'deleted'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            {filterType !== 'all' && (
              <span className="ml-2 text-xs">
                ({auditLogs.filter(log => log.action === filterType).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Audit Logs List */}
      <div className="bg-gray-800 rounded-lg p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <p className="text-gray-400 text-lg">No audit logs found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'all' 
                ? 'No events have been modified yet'
                : `No events have been ${filter} yet`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-gray-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getActionIcon(log.action)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                        {log.action.toUpperCase()}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {log.eventName || `Event ${log.eventId}`}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Event ID:</span>
                        <span className="text-white ml-2 font-mono">{log.eventId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Admin ID:</span>
                        <span className="text-white ml-2">{log.adminId}</span>
                      </div>
                      {log.eventData && (
                        <>
                          <div>
                            <span className="text-gray-400">Date:</span>
                            <span className="text-white ml-2">{log.eventData.date}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Time:</span>
                            <span className="text-white ml-2">{log.eventData.time}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Departure:</span>
                            <span className="text-white ml-2">{log.eventData.departure}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Arrival:</span>
                            <span className="text-white ml-2">{log.eventData.arrival}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Show event data for deleted events */}
                {log.action === 'deleted' && log.eventData && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Deleted Event Details:</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><span className="text-gray-400">Description:</span> {log.eventData.description}</p>
                      {log.eventData.pilotBriefingUrl && (
                        <p><span className="text-gray-400">Briefing URL:</span> {log.eventData.pilotBriefingUrl}</p>
                      )}
                      {log.eventData.banner && (
                        <p><span className="text-gray-400">Banner URL:</span> {log.eventData.banner}</p>
                      )}
                      {log.eventData.picture && (
                        <p><span className="text-gray-400">Picture URL:</span> {log.eventData.picture}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-bold">
              {auditLogs.filter(log => log.action === 'created').length}
            </div>
            <div className="text-gray-400">Created</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 text-2xl font-bold">
              {auditLogs.filter(log => log.action === 'updated').length}
            </div>
            <div className="text-gray-400">Updated</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-2xl font-bold">
              {auditLogs.filter(log => log.action === 'deleted').length}
            </div>
            <div className="text-gray-400">Deleted</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl font-bold">
              {auditLogs.length}
            </div>
            <div className="text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};
