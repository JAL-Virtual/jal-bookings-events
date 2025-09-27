"use client";

import { ReactNode, useEffect, useState } from 'react';

interface StartupPopupProps {
  jalId?: string;
  onFinish?: () => void;
  children?: ReactNode;
}

export function StartupPopup({ jalId, onFinish, children }: StartupPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const consoleLines = [
    "Japan Airlines Virtual Event Booking Portal",
    "Initializing system...",
    "Loading authentication modules...",
    "Connecting to JAL servers...",
    "Verifying pilot credentials...",
    "Loading event data...",
    "System ready!",
  ];

  useEffect(() => {
    // Typing effect for current line
    if (currentLine < consoleLines.length) {
      const currentLineText = consoleLines[currentLine];
      const typingInterval = setInterval(() => {
        setCurrentTextIndex(prev => {
          if (prev >= currentLineText.length) {
            clearInterval(typingInterval);
            // Move to next line after typing is complete
            setTimeout(() => {
              setCurrentLine(prev => prev + 1);
              setCurrentTextIndex(0);
              setDisplayedText('');
            }, 500);
            return prev;
          }
          setDisplayedText(currentLineText.slice(0, prev + 1));
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(typingInterval);
    } else {
      // All lines typed, start progress bar
      setTimeout(() => {
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              setTimeout(() => {
                setIsVisible(false);
                onFinish?.();
              }, 500);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
      }, 1000);
    }
  }, [currentLine, onFinish]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-2xl w-full mx-4 font-mono">
        {/* Terminal Header */}
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-sm text-gray-600 ml-2">
              JAL Event Portal Terminal
            </span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 bg-white">
          <div className="space-y-2 text-sm">
            {/* Completed Lines */}
            {consoleLines.slice(0, currentLine).map((line, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-600 mr-2">
                  {jalId ? `[${jalId}]` : '[SYSTEM]'}
                </span>
                <span className="text-gray-800">
                  {line}
                </span>
              </div>
            ))}

            {/* Current Line with Typing Effect */}
            {currentLine < consoleLines.length && (
              <div className="flex items-center">
                <span className="text-green-600 mr-2">
                  {jalId ? `[${jalId}]` : '[SYSTEM]'}
                </span>
                <span className="text-gray-800">
                  {displayedText}
                </span>
                <span className="ml-1 text-green-600 animate-pulse">
                  ▊
                </span>
              </div>
            )}

            {/* Progress Bar */}
            {currentLine >= consoleLines.length && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <span className="text-green-600 mr-2">
                    {jalId ? `[${jalId}]` : '[SYSTEM]'}
                  </span>
                  <span className="text-gray-800">
                    Progress: {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}