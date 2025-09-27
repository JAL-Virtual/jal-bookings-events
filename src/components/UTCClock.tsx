"use client";

import { useState, useEffect } from 'react';

export function UTCClock() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const utcTime = time.toISOString().substr(11, 8);

  return (
    <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
      UTC: {utcTime}
    </div>
  );
}