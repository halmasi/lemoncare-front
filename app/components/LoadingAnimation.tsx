'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

import Logo from '@/public/loading.svg';

export default function ThreeDotsWave({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const wh = size ? `${'w-' + size * 2} ${'h-' + size}` : 'w-40 h-20';
  return (
    <div
      className={`pt-10 w-full flex items-center justify-center ${className}`}
    >
      <motion.div
        className={`${wh} flex justify-around`}
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
            width={size || Logo.width}
            height={size || Logo.height}
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
            width={size || Logo.width}
            height={size || Logo.height}
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
            width={size || Logo.width}
            height={size || Logo.height}
            alt="Logo"
          />
        </motion.span>
      </motion.div>
    </div>
  );
}
