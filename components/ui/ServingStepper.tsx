'use client';

import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServingStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
}

export default function ServingStepper({
  value,
  min = 1,
  max = 20,
  onChange,
  label = 'Serves',
}: ServingStepperProps) {
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-4">
      {label && (
        <span className="text-sm font-medium text-text-muted">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={decrement}
          disabled={value <= min}
          className="w-10 h-10 rounded-xl border-2 border-border bg-surface flex items-center justify-center
                     text-text hover:border-primary hover:bg-primary/10 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <Minus size={18} />
        </motion.button>
        <motion.span
          key={value}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="w-12 text-center text-xl font-mono font-bold text-text"
        >
          {value}
        </motion.span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={increment}
          disabled={value >= max}
          className="w-10 h-10 rounded-xl border-2 border-border bg-surface flex items-center justify-center
                     text-text hover:border-primary hover:bg-primary/10 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer min-h-[44px] min-w-[44px]"
        >
          <Plus size={18} />
        </motion.button>
      </div>
      <span className="text-sm text-text-muted">
        {value === 1 ? 'person' : 'people'}
      </span>
    </div>
  );
}
