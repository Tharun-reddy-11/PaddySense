import React from 'react';
import Navbar from '../components/Navbar';
import VideoHero from '../components/VideoHero';
import WorkingFlowCards from '../components/WorkingFlowCards';
import HowItWorksMarquee from '../components/HowItWorksMarquee';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

export default function LandingPage({ onNavigate, user, onLogout }) {
  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <Navbar onNavigate={onNavigate} user={user} onLogout={onLogout} />
      
      <main style={{ flex: 1 }}>
        <VideoHero
          onStartAssessment={() => onNavigate(user ? 'new-assessment' : 'register')}
          onExploreFeatures={handleScrollToFeatures}
        />
        <WorkingFlowCards />
        <HowItWorksMarquee />
        <AboutSection onRegister={() => onNavigate(user ? 'new-assessment' : 'register')} />
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
