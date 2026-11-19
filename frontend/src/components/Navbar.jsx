import React from 'react';
import { ArrowRight, Leaf } from 'lucide-react';

export default function Navbar({ onNavigate, user, onLogout }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="brand" onClick={() => onNavigate('landing')} style={{ cursor: 'pointer' }}>
        <img src="/assets/branding/logo.png" alt="PaddySense Logo" />
        <div>
          <span>Paddy</span>Sense
          <small className="brand-tagline">Smart Insights. Healthy Harvest.</small>
        </div>
      </div>

      <nav className="nav-links">
        <button onClick={() => scrollTo('hero')} className="nav-link">Home</button>
        <button onClick={() => scrollTo('features')} className="nav-link">Core Features</button>
        <button onClick={() => scrollTo('how-it-works')} className="nav-link">How It Works</button>
        <button onClick={() => scrollTo('about')} className="nav-link">Research & Science</button>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary">
              My Dashboard
            </button>
            <button onClick={onLogout} className="btn-secondary" style={{ color: '#dc2626', borderColor: '#fca5a5' }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button onClick={() => onNavigate('login')} className="btn-secondary">
              Farmer Login
            </button>
            <button onClick={() => onNavigate('register')} className="btn-primary">
              <span>Start Assessment</span>
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
