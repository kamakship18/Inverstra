import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, AlertCircle, Info } from 'lucide-react';

const Toast = ({
  message,
  type = 'success', 
  duration = 3000,
  position = 'bottom-right',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const typeStyles = {
    success: {
      bg: 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 dark:from-green-600/90 dark:to-emerald-600/90',
      border: 'border-green-400 dark:border-green-700',
      icon: <Check className="w-5 h-5 text-white" />,
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500/90 to-pink-500/90 dark:from-red-600/90 dark:to-pink-600/90',
      border: 'border-red-400 dark:border-red-700',
      icon: <AlertCircle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 dark:from-blue-600/90 dark:to-indigo-600/90',
      border: 'border-blue-400 dark:border-blue-700',
      icon: <Info className="w-5 h-5 text-white" />,
    },
  };

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed z-50 ${positionClasses[position]} flex items-center max-w-xs shadow-lg backdrop-blur-sm border ${styles.border} rounded-xl overflow-hidden`}
        >
          <div className={`${styles.bg} py-3 px-4 flex items-center text-white`}>
            <div className="flex-shrink-0 mr-2">{styles.icon}</div>
            <p className="text-white font-medium text-sm">{message}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                if (onClose) setTimeout(onClose, 300);
              }}
              className="ml-4 text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
