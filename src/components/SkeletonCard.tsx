import React from 'react';
import { motion } from 'motion/react';

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`animate-pulse space-y-4 p-4 ${className}`}>
      <motion.div
        className="h-6 bg-ink/10 rounded w-3/4"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-ink/10 rounded"
          style={{ width: i === lines - 1 ? '85%' : '100%' }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonEventPanel: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse space-y-4">
        {/* Title skeleton */}
        <div className="h-8 bg-ink/10 rounded w-3/4" />
        
        {/* Date skeleton */}
        <div className="h-4 bg-ink/10 rounded w-1/2" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-ink/10 rounded w-full" />
          <div className="h-4 bg-ink/10 rounded w-full" />
          <div className="h-4 bg-ink/10 rounded w-5/6" />
        </div>
        
        {/* Details skeleton */}
        <div className="space-y-3 mt-6">
          <div className="h-6 bg-ink/10 rounded w-1/3" />
          <div className="h-4 bg-ink/10 rounded w-full" />
          <div className="h-4 bg-ink/10 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonTimeline: React.FC = () => {
  return (
    <div className="flex gap-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse flex-shrink-0">
          <div className="w-32 h-20 bg-ink/10 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// Made with Bob
