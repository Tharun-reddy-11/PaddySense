import React from 'react';
import { BookOpen, CheckCircle2, Award, Globe, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AboutSection({ onRegister }) {
  const improvements = [
    {
      title: 'Continuous Methane Regression',
      desc: 'Overcomes BBN discrete classification limits by predicting exact seasonal intensity in kg CH₄/ha/season.'
    },
    {
      title: 'Leakage-Proof Group Cross-Validation',
      desc: 'Prevents experimental plot replicates from appearing in both train and test splits, guaranteeing genuine generalization.'
    },
    {
      title: 'Empirical Flux Harmonization',
      desc: 'Harmonizes static chamber gas chromatography data (IARI & Gimje) with trapezoidal time-integration.'
    },
    {
      title: 'Daily NASA POWER Integration',
      desc: 'Automatically retrieves actual solar radiation, rainfall, and temperature rather than generic static averages.'
    },
    {
      title: 'Local TreeSHAP Interpretability',
      desc: 'Quantifies exact positive and negative feature attributions without falsely asserting causation.'
    },
    {
      title: 'AWD & N₂O Trade-Off Awareness',
      desc: 'Directly informs growers that alternate wetting & drying curbs CH₄ but may elevate nitrous oxide under high nitrogen.'
    }
  ];

  return (
    <section id="about" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <span className="section-tag">SCIENTIFIC FOUNDATION & RIGOR</span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.2rem' }}>
              Translating Greenhouse Gas Research into Farm Decision Intelligence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              PaddySense is built upon the research published in the <em>Journal of Cleaner Production (2026, Article 147994)</em>. 
              Rather than reproducing simplified graphs, PaddySense addresses key methodological limitations to provide a robust, 
              field-calibrated agricultural SaaS platform.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {improvements.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <CheckCircle2 size={20} color="#176B4D" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.96rem' }}>{item.title}: </strong>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={onRegister} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              <span>Create Free Account & Assess Field</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '2px solid rgba(23, 107, 77, 0.2)'
            }}>
              <img
                src="/assets/images/slide_3.jpg"
                alt="Static Chamber Gas Flux Measurement"
                style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '1.8rem', background: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <Award size={18} />
                  <span>Field Gas Chromatography Calibrated</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Empirical Flux Integration
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Calibrated on closed-chamber gas flux datasets from ICAR-IARI New Delhi and Gimje Plains, 
                  coupling soil redox kinetics, flooding days, and nitrogen treatments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
