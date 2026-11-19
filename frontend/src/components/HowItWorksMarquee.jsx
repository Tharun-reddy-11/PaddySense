import React from 'react';
import { Activity, CloudSun, Compass, ShieldCheck, Zap } from 'lucide-react';

export default function HowItWorksMarquee() {
  const marqueeItems = [
    {
      step: 'FEATURE 01',
      title: 'Continuous Emission Regression',
      text: 'Replaces coarse low/med/high bins with exact seasonal methane intensity in kg CH₄/ha/season.'
    },
    {
      step: 'FEATURE 02',
      title: 'Leakage-Proof Validation',
      text: 'Site-stratified GroupKFold cross-validation ensures no micro-plot data leaks between train and test.'
    },
    {
      step: 'FEATURE 03',
      title: 'NASA POWER Daily Integration',
      text: 'Retrieves actual solar radiation, temperature, and rainfall for the farmer’s exact field coordinates.'
    },
    {
      step: 'FEATURE 04',
      title: 'TreeSHAP Interpretability',
      text: 'Shows the quantitative impact of water depth, fertilizer splits, and soil organic carbon on each assessment.'
    },
    {
      step: 'FEATURE 05',
      title: 'Conformal Prediction Bounds',
      text: 'Statistically rigorous 90% and 95% uncertainty intervals instead of uncalibrated confidence scores.'
    },
    {
      step: 'FEATURE 06',
      title: 'Nitrous Oxide Trade-Off Alerts',
      text: 'Directly informs farmers when alternate wetting & drying (AWD) poses a potential N₂O emission increase.'
    }
  ];

  // Duplicate for seamless loop
  const duplicatedItems = [...marqueeItems, ...marqueeItems];

  return (
    <section
      id="how-it-works"
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #072e20 0%, #0d4631 45%, #176B4D 85%, #0d3827 100%)',
        padding: '5.5rem 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(52, 211, 153, 0.2)',
        borderBottom: '1px solid rgba(52, 211, 153, 0.2)'
      }}
    >
      {/* Ambient background lighting blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6ee7b7',
            background: 'rgba(167, 243, 208, 0.15)',
            border: '1px solid rgba(167, 243, 208, 0.3)',
            padding: '6px 14px',
            borderRadius: '9999px',
            marginBottom: '0.8rem'
          }}
        >
          AGRONOMIC & ML ARCHITECTURE
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.8rem' }}>
          Beyond the Base Research Paper
        </h2>
        <p style={{ color: '#d1fae5', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Resolving Bayesian Belief Network limitations with gradient-boosted decision trees, geospatial APIs, and empirical trade-off awareness.
        </p>
      </div>

      <div className="marquee-container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="marquee-track">
          {duplicatedItems.map((item, index) => (
            <div
              key={index}
              style={{
                width: '320px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '16px',
                padding: '1.6rem',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fbbf24' }}>
                {item.step}
              </span>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
