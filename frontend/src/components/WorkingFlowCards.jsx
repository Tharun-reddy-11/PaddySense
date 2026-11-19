import React from 'react';

export default function WorkingFlowCards() {
  const cards = [
    {
      step: 'Step 01',
      title: 'Field & Water Management',
      desc: 'Log continuous flooding duration, water depth, and intermittent drying schedules to calculate redox dynamics.',
      image: '/assets/cards/card_2.jpg'
    },
    {
      step: 'Step 02',
      title: 'Precision Nitrogen & Residue',
      desc: 'Account for Neem-Coated Urea split applications, farmyard manure, and straw incorporation rates.',
      image: '/assets/cards/card_1.jpg'
    },
    {
      step: 'Step 03',
      title: 'Empirical Flux Modeling',
      desc: 'XGBoost and CatBoost models benchmarked against IARI and Gimje static chamber gas chromatography.',
      image: '/assets/cards/card_3.jpg'
    },
    {
      step: 'Step 04',
      title: 'SHAP Insights & Mitigation',
      desc: 'Receive local TreeSHAP explanations and actionable AWD Pani-Pipe recommendations with N₂O trade-off alerts.',
      image: '/assets/cards/card_4.jpg'
    }
  ];

  return (
    <section id="features" className="workflow-section">
      <div className="section-head">
        <span className="section-tag">FOUR-STEP SUSTAINABLE CYCLE</span>
        <h2 className="section-title">How PaddySense Drives Climate-Smart Farming</h2>
        <p className="section-desc">
          Built for agronomic precision in real-world farmer fields. Practical, transparent, and grounded in empirical science.
        </p>
      </div>

      <div className="workflow-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="workflow-card">
            <img
              src={card.image}
              alt={card.title}
              className="workflow-card-bg"
            />
            <div className="workflow-card-overlay" />
            <div className="workflow-card-content">
              <span className="workflow-card-step">{card.step}</span>
              <h3 className="workflow-card-title">{card.title}</h3>
              <p className="workflow-card-desc">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
