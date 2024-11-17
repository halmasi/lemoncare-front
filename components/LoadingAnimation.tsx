'use client';

import { motion } from 'framer-motion';
import React from 'react';

const LoadingDot = {
  display: 'block',
  width: '2rem',
  height: '2rem',
  backgroundColor: 'black',
  borderRadius: '50%',
};

const LoadingContainer = {
  width: '10rem',
  height: '5rem',
  display: 'flex',
  justifyContent: 'space-around',
};

const ContainerVariants = {
  initial: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function ThreeDotsWave() {
  return (
    <div className="pt-10 w-full flex items-center justify-center">
      <motion.div
        style={LoadingContainer}
        variants={ContainerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="block w-8 h-8 bg-yellow-500 rounded-full"
          variants={{
            initial: {
              y: '0%',
            },
            animate: {
              y: '100%',
            },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeatType: 'mirror',
            repeat: Infinity,
          }}
        />
        <motion.span
          className="block w-8 h-8 bg-yellow-500 rounded-full"
          variants={{
            initial: {
              y: '0%',
            },
            animate: {
              y: '100%',
            },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeatType: 'mirror',
            repeat: Infinity,
          }}
        />
        <motion.span
          className="block w-8 h-8 bg-yellow-500 rounded-full"
          variants={{
            initial: {
              y: '0%',
            },
            animate: {
              y: '100%',
            },
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeatType: 'mirror',
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}
