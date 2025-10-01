'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

type Star = { top: number; left: number; size: number; dur: number; delay: number };

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Always use dark theme

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
    const id = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const formattedTime = useMemo(
    () => (currentTime ? currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"),
    [currentTime]
  );

  const stars: Star[] = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => {
        const hash = (i * 9301 + 49297) % 233280;
        const normalized = hash / 233280;
        return {
          top: normalized * 100,
          left: ((i * 9301 + 49297) % 233280) / 233280 * 100,
          size: ((i * 9301 + 49297) % 233280) / 233280 * 3 + 1,
          dur: ((i * 9301 + 49297) % 233280) / 233280 * 4 + 2,
          delay: ((i * 9301 + 49297) % 233280) / 233280 * 6,
        };
      }),
    []
  );

  const handleGetStarted = () => {
    window.location.href = '/dashboard';
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex items-center justify-center mx-auto mb-4"
          >
            <Image 
              src="/img/jal-logo-dark.png"
              alt="Japan Airlines Logo"
              width={120}
              height={120}
              className="w-30 h-30 object-contain"
            />
          </motion.div>
          <motion.p 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-xl font-comic"
          >
            Loading...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-full overflow-hidden relative">
      <div className="relative w-full h-screen overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white">
      
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/60 via-purple-900/40 to-black/95" />
        
        {/* Dynamic Gradient Overlay */}
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 20%, rgba(239, 68, 68, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mouse-following spotlight effect */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.05) 0%, transparent 40%)`
          }}
          transition={{ duration: 0.1 }}
        />

        {/* Enhanced Animated Stars */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {stars.map((s, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                s.size > 2 ? 'bg-white shadow-xl shadow-white/60' : 
                s.size > 1.5 ? 'bg-white/90 shadow-lg shadow-white/40' : 
                'bg-white/70'
              }`}
              style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
              animate={{ 
                opacity: [0, 1, 0.3, 1, 0],
                scale: [0.5, 1.5, 1, 1.2, 0.5],
                rotate: [0, 180, 360]
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

        {/* Floating Particles with trails */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => {
            const hash1 = (i * 9301 + 49297) % 233280;
            const hash2 = (i * 9301 + 49297 + 1000) % 233280;
            const hash3 = (i * 9301 + 49297 + 2000) % 233280;
            const hash4 = (i * 9301 + 49297 + 3000) % 233280;
            
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-blue-400 shadow-lg"
                style={{
                  top: `${(hash1 / 233280) * 100}%`,
                  left: `${(hash2 / 233280) * 100}%`,
                }}
                animate={{
                  y: [0, -150, 0],
                  x: [0, (hash3 / 233280 - 0.5) * 100, 0],
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.5, 1, 0]
                }}
                transition={{
                  duration: 6 + (hash3 / 233280) * 3,
                  repeat: Infinity,
                  delay: (hash4 / 233280) * 3,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Geometric shapes for depth */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`shape-${i}`}
              className="absolute border border-white/10 rounded-full"
              style={{
                width: 200 + i * 50,
                height: 200 + i * 50,
                top: `${(i * 12.5) % 100}%`,
                left: `${(i * 15) % 100}%`,
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div style={{ y }} className="relative z-10 flex flex-col items-center justify-center h-full py-8 px-6 text-center min-h-screen">
          {/* Enhanced Header with time */}
          <div className="w-full max-w-6xl flex justify-start items-start mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="backdrop-blur-2xl rounded-3xl p-6 border shadow-2xl bg-white/10 border-white/20 shadow-white/10"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div 
                className="text-4xl font-bold font-mono text-white"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 30px rgba(255, 255, 255, 0.8)",
                    "0 0 20px rgba(255, 255, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <time suppressHydrationWarning>{formattedTime}</time>
              </motion.div>
              <div className="text-sm font-medium font-serif text-gray-300 mt-1">
                Local Time
              </div>
            </motion.div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-6xl">
            {/* Enhanced JAL Logo with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="mb-8"
            >
              <motion.div 
                className="flex items-center justify-center mx-auto mb-4"
                animate={{ 
                  filter: [
                    "drop-shadow(0 0 30px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 60px rgba(239, 68, 68, 0.2))",
                    "drop-shadow(0 0 50px rgba(239, 68, 68, 0.6)) drop-shadow(0 0 100px rgba(239, 68, 68, 0.3))",
                    "drop-shadow(0 0 30px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 60px rgba(239, 68, 68, 0.2))"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotateY: 10 }}
              >
                <motion.img 
                  src="/img/jal-logo-dark.png"
                  alt="Japan Airlines Logo"
                  className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Title with 3D Text Effect */}
            <motion.h1
              initial={{ opacity: 0, y: -50, rotateX: -90 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wider mb-6 font-comic"
              style={{
                background: "linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(251, 191, 36, 0.5)"
              }}
            >
              Japan Airlines Virtual
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="backdrop-blur-2xl rounded-3xl p-8 border shadow-2xl w-full max-w-3xl bg-white/10 border-white/20 shadow-white/20"
              whileHover={{ scale: 1.02, y: -10, rotateY: 2 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-4 mb-6"
              >
                <motion.span 
                  className="font-display text-white"
                  whileHover={{ scale: 1.1, color: "#fbbf24" }}
                  transition={{ duration: 0.2 }}
                >
                  EXPERIENCE
                </motion.span>
                <motion.span 
                  className="text-3xl"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✈️
                </motion.span>
                <motion.span 
                  className="font-display text-white"
                  whileHover={{ scale: 1.1, color: "#fbbf24" }}
                  transition={{ duration: 0.2 }}
                >
                  THE BEST
                </motion.span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="text-xl font-medium mb-6 font-comic text-gray-200"
              >
                Manage your bookings on a modern, fast and intuitive way.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="text-lg font-comic text-gray-300 flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✈️
                </motion.span>
                Book premium aviation events and experiences
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✈️
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Enhanced CTA Button */}
            <motion.button
              type="button"
              onClick={handleGetStarted}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                boxShadow: [
                  "0 15px 35px rgba(239, 68, 68, 0.4)",
                  "0 20px 40px rgba(239, 68, 68, 0.6)",
                  "0 15px 35px rgba(239, 68, 68, 0.4)"
                ]
              }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-8 px-16 py-6 rounded-3xl font-bold text-xl flex items-center gap-4 focus:outline-none focus:ring-4 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:via-red-400 hover:to-pink-500 focus:ring-red-500/50 shadow-2xl shadow-red-500/30 backdrop-blur-xl border border-white/20"
              whileTap={{ scale: 0.95 }}
              whileHover={{ 
                y: -12,
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(239, 68, 68, 0.5)"
              }}
            >
              <motion.span 
                className="text-4xl"
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✈️
              </motion.span>
              <span className="font-comic">Get Started!</span>
              <motion.span 
                className="text-2xl"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.button>
          </div>

          {/* Enhanced Footer Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="backdrop-blur-2xl rounded-3xl px-8 py-4 border shadow-xl bg-white/10 border-white/20 text-gray-200 shadow-white/10"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-center gap-3">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-xl"
              >
                ✈️
              </motion.span>
              <span className="font-comic text-lg">Powered by: Japan Airlines Virtual</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-xl"
              >
                ✈️
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="backdrop-blur-xl rounded-2xl px-6 py-3 border shadow-lg mt-4 bg-white/5 border-white/10 text-gray-300 shadow-white/5"
            whileHover={{ scale: 1.01, y: -2 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-comic">Japan Airlines Virtual Event Booking Portal</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}