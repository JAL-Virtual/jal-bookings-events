'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Star = { top: number; left: number; size: number; dur: number; delay: number };

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isDark = true; // Always use dark theme

  useEffect(() => {
    // Mark component as mounted to prevent hydration issues
    setIsMounted(true);
    
    setCurrentTime(new Date());
    const id = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const formattedTime = useMemo(
    () => (currentTime ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"),
    [currentTime]
  );

  const stars: Star[] = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => {
        // Use a simple hash function to generate consistent "random" values
        const hash = (i * 9301 + 49297) % 233280;
        const normalized = hash / 233280;
        return {
          top: normalized * 100,
          left: ((i * 9301 + 49297) % 233280) / 233280 * 100,
          size: ((i * 9301 + 49297) % 233280) / 233280 * 2 + 1,
          dur: ((i * 9301 + 49297) % 233280) / 233280 * 3 + 2,
          delay: ((i * 9301 + 49297) % 233280) / 233280 * 5,
        };
      }),
    []
  );

  const handleGetStarted = () => {
    // Redirect directly to dashboard
    window.location.href = '/dashboard';
  };

  // Prevent hydration mismatch by showing loading state until mounted
  if (!isMounted) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image 
              src="/img/jal-logo-dark.png"
              alt="Japan Airlines Logo"
              width={96}
              height={96}
              className="w-24 h-24 object-contain"
            />
          </div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-full overflow-hidden relative">
      <div className="relative w-full h-screen overflow-hidden transition-all duration-500 bg-black text-white">
      
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0 z-0 transition-all duration-500 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black/90" />
      
      {/* Animated Gradient Overlay */}
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10"
        animate={{ 
          background: [
            "linear-gradient(45deg, rgba(239, 68, 68, 0.1), transparent, rgba(59, 130, 246, 0.1))",
            "linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent, rgba(239, 68, 68, 0.1))",
            "linear-gradient(225deg, rgba(239, 68, 68, 0.1), transparent, rgba(59, 130, 246, 0.1))",
            "linear-gradient(315deg, rgba(59, 130, 246, 0.1), transparent, rgba(239, 68, 68, 0.1))"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Enhanced Animated Stars with Different Sizes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              s.size > 1.5 ? 'bg-white shadow-lg shadow-white/50' : 'bg-white/80'
            }`}
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: s.dur, 
              repeat: Infinity, 
              delay: s.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
          // Use consistent hash-based positioning
          const hash1 = (i * 9301 + 49297) % 233280;
          const hash2 = (i * 9301 + 49297 + 1000) % 233280;
          const hash3 = (i * 9301 + 49297 + 2000) % 233280;
          const hash4 = (i * 9301 + 49297 + 3000) % 233280;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-white/30"
              style={{
                top: `${(hash1 / 233280) * 100}%`,
                left: `${(hash2 / 233280) * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + (hash3 / 233280) * 2,
                repeat: Infinity,
                delay: (hash4 / 233280) * 2,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full py-8 px-6 text-center min-h-screen">
        {/* Enhanced Header with time */}
        <div className="w-full max-w-6xl flex justify-start items-start mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="backdrop-blur-xl rounded-3xl p-6 border shadow-2xl bg-white/5 border-white/10 shadow-white/5"
          >
            <div className="text-3xl font-bold font-mono text-white text-shadow-glow">
              <time suppressHydrationWarning>{formattedTime}</time>
            </div>
            <div className="text-sm font-medium font-serif text-gray-300">
              Local Time
            </div>
          </motion.div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl">
          {/* Enhanced JAL Logo with Glow Effect */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div 
              className="flex items-center justify-center mx-auto mb-4"
              animate={{ 
                filter: [
                  "drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))",
                  "drop-shadow(0 0 40px rgba(239, 68, 68, 0.5))",
                  "drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.img 
                src="/img/jal-logo-dark.png"
                alt="Japan Airlines Logo"
                className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 object-contain"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Title with Gradient Text */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className={`text-2xl md:text-3xl font-light tracking-wider mb-6 font-comic ${
              isDark 
                ? "text-gradient-gold text-shadow-glow" 
                : "text-gradient-red"
            }`}
          >
Japan Airlines Virtual
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className={`backdrop-blur-xl rounded-3xl p-8 border shadow-2xl w-full max-w-2xl ${
              isDark 
                ? "bg-white/5 border-white/10 shadow-white/10" 
                : "bg-white/40 border-white/20 shadow-white/20"
            }`}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl md:text-2xl font-bold flex items-center justify-center gap-4 mb-4"
            >
              <motion.span 
                className={`font-display ${isDark ? "text-white text-shadow-glow" : "text-gray-900"}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                EXPERIENCE
              </motion.span>
              <motion.span 
                className={`text-2xl ${isDark ? "text-red-400" : "text-red-600"}`}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ✈️
              </motion.span>
              <motion.span 
                className={`font-display ${isDark ? "text-white text-shadow-glow" : "text-gray-900"}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                THE BEST
              </motion.span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className={`text-lg font-medium mb-4 font-comic ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Manage your bookings on a modern, fast and intuitive way.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              className={`text-base font-comic ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              ✈️ Book premium aviation events and experiences ✈️
            </motion.div>
          </motion.div>

          <motion.button
            type="button"
            onClick={handleGetStarted}
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              boxShadow: [
                "0 10px 30px rgba(239, 68, 68, 0.3)",
                "0 15px 35px rgba(239, 68, 68, 0.4)",
                "0 10px 30px rgba(239, 68, 68, 0.3)"
              ]
            }}
            transition={{ duration: 1, delay: 1.5 }}
            className={`mt-8 px-12 py-4 rounded-3xl font-bold text-lg flex items-center gap-4 focus:outline-none focus:ring-4 ${
              isDark 
                ? "bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:via-red-400 hover:to-pink-500 focus:ring-red-500/50 shadow-2xl shadow-red-500/30" 
                : "bg-gradient-to-r from-red-500 via-red-400 to-pink-500 hover:from-red-400 hover:via-red-300 hover:to-pink-400 focus:ring-red-500/50 shadow-2xl shadow-red-500/30"
            } backdrop-blur-xl border border-white/20 hover:scale-110 hover:shadow-3xl`}
            whileTap={{ scale: 0.95 }}
            whileHover={{ 
              y: -8
            }}
          >
            <motion.span 
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ✈️
            </motion.span>
            <span className="font-comic">Get Started!</span>
            <motion.span 
              className="text-lg"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.button>

            </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className={`text-base font-medium mt-8 backdrop-blur-xl rounded-3xl px-6 py-3 border shadow-lg ${
            isDark 
              ? "bg-white/5 border-white/10 text-gray-300 shadow-white/5" 
              : "bg-white/40 border-white/20 text-gray-600 shadow-white/20"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-lg"
            >
              ✈️
            </motion.span>
            <span className="font-comic">Powered by: Japan Airlines Virtual</span>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-lg"
            >
              ✈️
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className={`text-sm font-medium mt-4 backdrop-blur-xl rounded-2xl px-4 py-2 border shadow-lg ${
            isDark 
              ? "bg-white/5 border-white/10 text-gray-400 shadow-white/5" 
              : "bg-white/40 border-white/20 text-gray-500 shadow-white/20"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="font-comic">Japan Airlines Virtual Event Booking Portal</span>
          </div>
        </motion.div>
      </div>

      </div>


    </main>
  );
}