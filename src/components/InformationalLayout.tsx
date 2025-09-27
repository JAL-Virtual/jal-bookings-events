'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InformationalLayoutProps {
  header: React.ReactNode;
  description: React.ReactNode;
  image: React.ReactNode;
  alert?: React.ReactNode;
  children: React.ReactNode;
}

export const InformationalLayout: React.FC<InformationalLayoutProps> = ({
  header,
  description,
  image,
  alert,
  children
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gray-900" />
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-green-900/20"
        animate={{ 
          background: [
            "linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, transparent 50%, rgba(20, 83, 45, 0.2) 100%)",
            "linear-gradient(135deg, rgba(20, 83, 45, 0.2) 0%, transparent 50%, rgba(30, 58, 138, 0.2) 100%)",
            "linear-gradient(135deg, rgba(30, 58, 138, 0.2) 0%, transparent 50%, rgba(20, 83, 45, 0.2) 100%)"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header Section */}
        <motion.div 
          className="flex justify-start items-start px-8 pb-8 -mt-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Left Side - Logo */}
          <div className="flex flex-col">
            <motion.div 
              className="w-[250px] h-[250px] flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image 
                src="/img/jal-logo-dark.png?v=2"
                alt="Japan Airlines Logo"
                width={250}
                height={250}
                className="w-[250px] h-[250px] object-contain drop-shadow-lg"
                priority
                unoptimized
                style={{ width: '250px', height: '250px' }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex items-start justify-center px-8 pt-16 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                {header}
              </div>

              {/* Description */}
              <div>
                {description}
              </div>

              {/* Alert */}
              {alert && (
                <div>
                  {alert}
                </div>
              )}

              {/* Action Button */}
              <div>
                {children}
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="flex justify-center">
              <div className="relative">
                {image}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="bg-gray-800"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto px-8 py-4 text-center">
            <motion.p 
              className="text-gray-300 text-sm mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              © 2024 Japan Airlines Virtual. All Rights Reserved.
            </motion.p>
            <motion.p 
              className="text-gray-300 text-sm mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Create & Maintained by JAL1977 - Yong Zhong Jie
            </motion.p>
            <motion.div 
              className="text-gray-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <a href="#" className="underline hover:text-white mr-4 transition-colors duration-300">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="underline hover:text-white ml-4 transition-colors duration-300">Terms of Use</a>
            </motion.div>
          </div>
          <div className="w-full h-px bg-black"></div>
        </motion.div>
      </div>
    </div>
  );
};
