'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, FolderOpen, ScanSearch, SlidersHorizontal, ChefHat } from 'lucide-react';

const floatingEmojis = ['🍕', '🥑', '🍳', '🥩', '🧀', '🍋', '🌶️', '🥕'];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Floating food emojis background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingEmojis.map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl opacity-10"
              initial={{
                x: `${10 + (i * 12) % 80}%`,
                y: `${15 + (i * 17) % 70}%`,
              }}
              animate={{
                y: [`${15 + (i * 17) % 70}%`, `${10 + (i * 13) % 60}%`, `${15 + (i * 17) % 70}%`],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 6 + i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI-Powered Kitchen Scanner
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-text leading-tight mb-6">
            The Best{' '}
            <span className="gradient-text">Supper</span>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl text-text-muted mb-10 font-body"
          >
            Your kitchen.{' '}
            <span className="text-primary font-medium">Infinite possibilities.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/scan?mode=camera">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl
                           gradient-primary text-white font-semibold text-lg
                           shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
                           transition-shadow min-h-[56px] cursor-pointer"
              >
                <Camera size={22} />
                Scan My Kitchen
              </motion.button>
            </Link>

            <Link href="/scan?mode=upload">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl
                           bg-surface border-2 border-border text-text font-semibold text-lg
                           hover:border-primary/50 hover:bg-surface/80
                           transition-all min-h-[56px] cursor-pointer"
              >
                <FolderOpen size={22} />
                Upload Photos
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: <ScanSearch size={28} />,
              emoji: '📸',
              title: 'Scan',
              description: 'Photograph your fridge, pantry, or countertop. AI identifies every ingredient instantly.',
              color: 'from-primary/20 to-secondary/10',
            },
            {
              icon: <SlidersHorizontal size={28} />,
              emoji: '🎛️',
              title: 'Filter',
              description: 'Set your health goal, meal complexity, occasion, servings, and dietary restrictions.',
              color: 'from-secondary/20 to-highlight/10',
            },
            {
              icon: <ChefHat size={28} />,
              emoji: '👨‍🍳',
              title: 'Cook',
              description: 'Get personalised recipes with step-by-step instructions, nutrition info, and pro tips.',
              color: 'from-success/20 to-deep/10',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
              className={`relative p-6 rounded-3xl border border-border bg-gradient-to-br ${feature.color}
                         hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
                {feature.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-text mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
