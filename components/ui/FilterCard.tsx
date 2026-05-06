'use client';

import { motion } from 'framer-motion';

interface FilterCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function FilterCard({ icon, label, selected, onClick, size = 'md' }: FilterCardProps) {
  const sizeClasses = {
    sm: 'min-h-[48px] px-4 py-2 text-sm',
    md: 'min-h-[80px] px-5 py-4 text-base',
    lg: 'min-h-[100px] px-6 py-5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        relative rounded-2xl border-2 transition-all duration-200 cursor-pointer
        flex flex-col items-center justify-center gap-2 text-center
        ${
          selected
            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
            : 'border-border bg-surface hover:border-primary/40 hover:bg-surface/80'
        }
      `}
    >
      <span className="text-2xl" role="img">{icon}</span>
      <span className={`font-body font-medium leading-tight ${selected ? 'text-primary' : 'text-text'}`}>
        {label}
      </span>
      {selected && (
        <motion.div
          layoutId="filter-ring"
          className="absolute inset-0 rounded-2xl border-2 border-primary"
          initial={false}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}
