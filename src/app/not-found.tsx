import React from 'react';
import Link from 'next/link';
import { STYLE_CLASSES } from '@/constants';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-700 dark:text-purple-300 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className={STYLE_CLASSES.typography.eyebrow}>404 — Masterpiece Not Found</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Lost in the Gallery?
          </h1>
          <p className={STYLE_CLASSES.typography.bodySmall}>
            The artwork, artist studio, or exhibition page you are searching for does not exist or has been curated into another collection.
          </p>
        </div>
        <div className="pt-2 flex justify-center">
          <Link
            href="/artworks"
            className={STYLE_CLASSES.buttons.primary}
          >
            <ArrowLeft className="w-4 h-4" />
            Explore Gallery Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
