import { ReactNode } from 'react';
import { CgClose } from 'react-icons/cg';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  children,
  show,
  className,
  onClose,
}: {
  children: ReactNode;
  show: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2 sm:px-4`}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`relative p-5 mt-20 md:mt-36 max-h-[70svh] md:max-h-[75svh] bg-white rounded-2xl shadow-xl overflow-hidden ${className}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 text-gray-500 hover:text-red-500 transition-colors"
            >
              <CgClose className="text-2xl" />
            </button>

            {/* Modal Content */}
            <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
