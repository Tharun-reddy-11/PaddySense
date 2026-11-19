import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{ backgroundColor: 'var(--primary-dark)', color: '#ffffff', padding: '4rem 2rem 2rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <img src="/assets/branding/logo.png" alt="PaddySense Logo" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>PaddySense</span>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '380px', marginBottom: '1rem' }}>
            Smart Insights. Healthy Harvest.<br />
            AI-based methane emission estimation platform driving climate-resilient, sustainable rice production worldwide.
          </p>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Based on Journal of Cleaner Production (2026, Article 147994).
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
            Platform
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
            <li><button onClick={() => onNavigate('landing')} style={{ color: 'inherit' }}>Home</button></li>
            <li><button onClick={() => onNavigate('login')} style={{ color: 'inherit' }}>Farmer Dashboard</button></li>
            <li><button onClick={() => onNavigate('register')} style={{ color: 'inherit' }}>New Assessment</button></li>
            <li><button onClick={() => onNavigate('landing')} style={{ color: 'inherit' }}>Scenario Simulator</button></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
            Science & APIs
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#e2e8f0' }}>
            <li>NASA POWER Daily API</li>
            <li>IARI Gas Flux Dataset</li>
            <li>Gimje Daily Series</li>
            <li>TreeSHAP Explainability</li>
            <li>Conformal Prediction</li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
            Agronomic Notice
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5 }}>
            Predictions represent statistical estimations derived from calibrated models. Methane reduction strategies such as AWD must be adapted to local soil conditions and canal irrigation control.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1240px', margin: '0 auto', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        <div>&copy; {new Date().getFullYear()} PaddySense. All rights reserved.</div>
        <div>Smarter Insights. Sustainable Rice Cultivation.</div>
      </div>
    </footer>
  );
}
