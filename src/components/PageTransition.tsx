'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

// Slide transition variants for different directions
const slideVariants = {
  initial: (direction: 'left' | 'right' | 'up' | 'down') => ({
    opacity: 0,
    x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
    y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0,
  }),
  in: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  out: (direction: 'left' | 'right' | 'up' | 'down') => ({
    opacity: 0,
    x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
    y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
  }),
};

const slideTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

// Fade transition variants
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const fadeTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.2,
};

// Scale transition variants
const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.2,
  },
};

const scaleTransition = {
  type: 'tween',
  ease: 'backOut',
  duration: 0.4,
};

export type TransitionType = 'fade' | 'slide' | 'scale' | 'page';

interface TransitionProps extends PageTransitionProps {
  type?: TransitionType;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
}

export const PageTransition: React.FC<TransitionProps> = ({
  children,
  className = '',
  type = 'page',
  direction = 'up',
  delay = 0,
}) => {
  const getVariants = () => {
    switch (type) {
      case 'slide':
        return slideVariants;
      case 'fade':
        return fadeVariants;
      case 'scale':
        return scaleVariants;
      default:
        return pageVariants;
    }
  };

  const getTransition = () => {
    switch (type) {
      case 'slide':
        return slideTransition;
      case 'fade':
        return fadeTransition;
      case 'scale':
        return scaleTransition;
      default:
        return pageTransition;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={getVariants()}
      transition={{
        ...getTransition(),
        delay,
      }}
      custom={direction}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation
interface StaggeredTransitionProps extends PageTransitionProps {
  staggerDelay?: number;
}

export const StaggeredTransition: React.FC<StaggeredTransitionProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
}) => {
  const containerVariants = {
    initial: {},
    in: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
    out: {
      transition: {
        staggerChildren: staggerDelay,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="in"
      exit="out"
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
};

// Loading transition component
interface LoadingTransitionProps {
  isLoading: boolean;
  children: ReactNode;
  loadingComponent?: ReactNode;
}

export const LoadingTransition: React.FC<LoadingTransitionProps> = ({
  isLoading,
  children,
  loadingComponent = (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  ),
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loadingComponent}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Route transition wrapper for Next.js pages
interface RouteTransitionProps extends PageTransitionProps {
  route: string;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  route,
  className = '',
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
