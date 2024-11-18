'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';

import Logo from '/public/loading.svg';

export default function ThreeDotsWave() {
  return (
    <div className="pt-10 w-full flex items-center justify-center">
      <motion.div
        className="w-40 h-20 flex justify-around"
        variants={{
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
        }}
        initial="initial"
        animate="animate"
      >
        <motion.span
          className="block w-8 h-8 rounded-full"
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
        >
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="Logo"
          />
        </motion.span>
        <motion.span
          className="block w-8 h-8 rounded-full"
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
        >
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="Logo"
          />
        </motion.span>
        <motion.span
          className="block w-8 h-8 rounded-full"
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
        >
          <Image
            src={Logo.src}
            width={Logo.width}
            height={Logo.height}
            alt="Logo"
          />
        </motion.span>
      </motion.div>
    </div>
  );
}
