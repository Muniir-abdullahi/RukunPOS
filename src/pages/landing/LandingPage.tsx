import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { Features } from '@/components/landing/Features';
import { POSPreview } from '@/components/landing/POSPreview';
import { ReportsPreview } from '@/components/landing/ReportsPreview';
import { TargetAudience } from '@/components/landing/TargetAudience';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { FAQ } from '@/components/landing/FAQ';

export function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProblemSolution />
      <Features />
      <POSPreview />
      <ReportsPreview />
      <TargetAudience />
      <Pricing />
      <FAQ />
      <CTA />
    </div>
  );
}
