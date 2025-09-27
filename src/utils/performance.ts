'use client';

import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for label: ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return fn().finally(() => {
      this.endTiming(label);
    });
  }

  measureSync<T>(label: string, fn: () => T): T {
    this.startTiming(label);
    const result = fn();
    this.endTiming(label);
    return result;
  }
}

// Hook for measuring component render times
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.startTiming(`${componentName}-render`);
    
    return () => {
      monitor.endTiming(`${componentName}-render`);
    };
  }, [componentName]);
}

// Utility for measuring API call performance
export async function measureApiCall<T>(
  apiCall: () => Promise<T>,
  endpoint: string
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  return monitor.measureAsync(`api-${endpoint}`, apiCall);
}

// Utility for measuring database operations
export async function measureDbOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance();
  return monitor.measureAsync(`db-${operationName}`, operation);
}

// Web Vitals monitoring
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log('Web Vital:', metric.name, metric.value);
    
    // Send to analytics service if needed
    // analytics.track('web-vital', {
    //   name: metric.name,
    //   value: metric.value,
    //   delta: metric.delta,
    //   id: metric.id
    // });
  }
}

// Memory usage monitoring
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
    };
  }
  return null;
}

// Bundle size monitoring
export function logBundleSize() {
  if (typeof window !== 'undefined') {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.log('Bundle Analysis:', {
      scripts: scripts.length,
      stylesheets: stylesheets.length,
      memory: getMemoryUsage(),
    });
  }
}
