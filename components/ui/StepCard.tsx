'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepCardProps {
  step: number;
  title: string;
  detail: string;
  completed: boolean;
  onToggle: () => void;
}

export default function StepCard({ step, title, detail, completed, onToggle }: StepCardProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`
        w-full text-left min-h-[60px] p-4 rounded-2xl border-2 transition-all duration-200
        ${completed
          ? 'border-success/30 bg-success/5'
          : 'border-border bg-surface hover:border-primary/30'
        }
      `}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex gap-3">
        {/* Step number / check */}
        <div
          className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold
            ${completed
              ? 'bg-success text-white'
              : 'gradient-primary text-white'
            }
          `}
        >
          {completed ? <Check size={16} /> : step}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-sm mb-1 ${
              completed ? 'line-through text-text-muted' : 'text-text'
            }`}
          >
            {title}
          </h4>
          <p
            className={`text-sm leading-relaxed ${
              completed ? 'text-text-muted/60' : 'text-text-muted'
            }`}
          >
            {detail}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
