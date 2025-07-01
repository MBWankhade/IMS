import React from 'react';
import Navbar from './landingPageComponents/Navbar';
import Hero from './landingPageComponents/Hero';
import Features from './landingPageComponents/Features';
import Team from './landingPageComponents/Team';
import Footer from './landingPageComponents/Footer'; 
import Stats from './landingPageComponents/Stats';
import HowItWorks from './landingPageComponents/HowItWorks';
import FeedPreview from './landingPageComponents/FeedPreview';
import Recruiters from './landingPageComponents/Recruiters';

export default function LandingPage() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks /> 
      <Features />
      <FeedPreview />
      <Recruiters />
      <Team />
      <Footer />
    </div>
  );
}