import React from 'react';
import { Hero } from '@/Components/landing/Hero';
import { ProblemSolution } from '@/Components/landing/ProblemSolution';
import { Features } from '@/Components/landing/Features';
import { POSPreview } from '@/Components/landing/POSPreview';
import { ReportsPreview } from '@/Components/landing/ReportsPreview';
import { TargetAudience } from '@/Components/landing/TargetAudience';
import { Pricing } from '@/Components/landing/Pricing';
import { CTA } from '@/Components/landing/CTA';
import { FAQ } from '@/Components/landing/FAQ';

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
