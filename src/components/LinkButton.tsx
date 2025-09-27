'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LinkButtonProps {
  icon?: React.ReactNode;
  content: string;
  href: string;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ icon, content, href, className = '' }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className={`inline-flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {icon}
        </motion.div>
        {content}
      </Link>
    </motion.div>
  );
};
