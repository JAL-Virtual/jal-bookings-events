'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartupPopupProps {
  jalId: string;
  onFinish: () => void;
}

export default function StartupPopup({ jalId, onFinish }: StartupPopupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [currentCommand, setCurrentCommand] = useState('');

  const commands = useMemo(() => [
    { 
      command: "jal-system --init", 
      output: "Initializing JAL Virtual System...",
      delay: 1200,
      icon: "🚀"
    },
    { 
      command: "load-events --database", 
      output: "Loading Event Database...",
      delay: 1400,
      icon: "📅"
    },
    { 
      command: "connect --booking-portal", 
      output: "Connecting to Booking Portal...",
      delay: 1100,
      icon: "🌐"
    },
    { 
      command: "sync-user --profile", 
      output: "Synchronizing User Profile...",
      delay: 1300,
      icon: "👤"
    },
    { 
      command: "prepare-interface --dashboard", 
      output: "Preparing Event Interface...",
      delay: 1000,
      icon: "✈️"
    },
    { 
      command: "system-ready --complete", 
      output: "System Ready! Welcome to JAL Event Booking Portal",
      delay: 800,
      icon: "🎉"
    },
  ], []);

  // Typewriter effect for command output
  useEffect(() => {
    if (currentStep < commands.length) {
      const currentCmd = commands[currentStep];
      let index = 0;
      setCurrentCommand(currentCmd.command);
      setDisplayedText('');
      
      const typeInterval = setInterval(() => {
        if (index < currentCmd.output.length) {
          setDisplayedText(currentCmd.output.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
        }
      }, 30);

      return () => clearInterval(typeInterval);
    }
  }, [currentStep, commands]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (currentStep < commands.length) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, commands[currentStep].delay);
    } else {
      // All steps completed, finish after a short delay
      timeoutId = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onFinish, 600);
      }, 1200);
    }

    return () => clearTimeout(timeoutId);
  }, [currentStep, onFinish, commands]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-black border-2 border-green-500/30 rounded-lg p-6 max-w-4xl w-full mx-4 shadow-2xl font-mono"
            style={{
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
              boxShadow: '0 0 30px rgba(34, 197, 94, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-green-400 text-sm font-bold">JAL-VIRTUAL-TERMINAL</span>
              </div>
              <div className="text-green-400 text-xs">
                Pilot ID: <span className="text-green-300">{jalId}</span>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="space-y-4 mb-6">
              {/* Welcome Message */}
              <div className="text-green-400 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">$</span>
                  <span>JAL Event Booking Portal v2.0.1</span>
                </div>
                <div className="text-gray-400 text-xs ml-4">
                  Copyright (c) 2025 Japan Airlines Virtual. All rights reserved.
                </div>
              </div>

              {/* Command History */}
              <div className="space-y-2">
                {commands.slice(0, currentStep).map((cmd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2 text-green-500 mb-1">
                      <span>$</span>
                      <span>{cmd.command}</span>
                      <span className="text-gray-500">{/* {cmd.icon} */}</span>
                    </div>
                    <div className="text-green-300 ml-4 text-xs">
                      ✓ {cmd.output}
                    </div>
                  </motion.div>
                ))}

                {/* Current Command */}
                {currentStep < commands.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm"
                  >
                    <div className="flex items-center gap-2 text-green-500 mb-1">
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        $
                      </motion.span>
                      <span>{currentCommand}</span>
                      <span className="text-gray-500">{/* {commands[currentStep].icon} */}</span>
                    </div>
                    <div className="text-green-300 ml-4 text-xs">
                      <span>{displayedText}</span>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-green-400"
                      >
                        _
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-400 text-xs">Progress:</span>
                  <span className="text-green-300 text-xs">
                    {Math.round(((currentStep + 1) / commands.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-sm h-2 overflow-hidden border border-gray-700">
                  <motion.div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-sm"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((currentStep + 1) / commands.length) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Terminal Footer */}
            <div className="border-t border-green-500/20 pt-3">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>Status: <span className="text-green-400">RUNNING</span></span>
                  <span>Mode: <span className="text-green-400">PRODUCTION</span></span>
                </div>
                <div className="text-green-400">
                  Japan Airlines Virtual • Event Booking Portal
                </div>
              </div>
            </div>

            {/* Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px bg-green-400"
                  style={{ top: `${i * 5}%` }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
