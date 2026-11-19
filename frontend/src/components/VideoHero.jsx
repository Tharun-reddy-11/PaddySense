import React from 'react';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export default function VideoHero({ onStartAssessment, onExploreFeatures }) {
  return (
    <section id="hero" className="hero">
      {/* Smooth Zoom Motion Agricultural Background */}
      <div className="hero-motion-bg-wrap">
        <img
          src="/assets/images/slide_4.jpg"
          alt="PaddySense Lush Rice Cultivation"
          className="hero-motion-bg"
        />
      </div>

      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-title">
          Smarter Insights.<br />
          <em>Sustainable Rice Cultivation.</em>
        </h1>

        <p className="hero-subtitle">
          An intelligent, farmer-friendly decision-support system estimating paddy methane emissions (kg CH₄/ha/season) 
          through field management, soil biogeochemistry, water aeration regimes, and daily NASA agroclimatology.
        </p>

        <div className="hero-cta">
          <button
            onClick={onStartAssessment}
            className="btn-primary"
            style={{ padding: '14px 34px', fontSize: '1.05rem', gap: '10px' }}
          >
            <span>Start Free Field Assessment</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onExploreFeatures}
            className="btn-secondary"
            style={{
              padding: '13px 28px',
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            <Compass size={18} />
            <span>Explore How It Works</span>
          </button>
        </div>
      </div>
    </section>
  );
}
