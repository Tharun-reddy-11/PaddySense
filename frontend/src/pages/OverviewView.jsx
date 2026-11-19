import React, { useState, useEffect } from 'react';
import {
  Sprout,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Layers,
  MapPin,
  Compass,
  Flame,
  Activity,
  ClipboardList,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

export default function OverviewView({ user, onNavigateTab, onSelectAssessment }) {
  const [stats, setStats] = useState({
    totalFields: 0,
    totalAssessments: 0,
    latestEstimatedEmission: null,
    latestRiskCategory: '—',
    averageEmission: 0,
    lowRiskCount: 0,
    moderateRiskCount: 0,
    highRiskCount: 0,
    veryHighRiskCount: 0,
    recentAssessments: [],
    seasonalTrends: []
  });
  const [loading, setLoading] = useState(true);

  // Auto-playing 4-Step Carousel (5-second interval) using uploaded images 1-4
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const CAROUSEL_SLIDES = [
    {
      step: 'Practice 01',
      title: 'Synchronized Nitrogen Management',
      desc: 'Applying Neem-Coated Urea in split doses guided by Leaf Color Charts cuts volatilization and early peak emissions.',
      image: '/assets/images/slide_1.jpg'
    },
    {
      step: 'Practice 02',
      title: 'Alternate Wetting and Drying (AWD)',
      desc: 'Allowing soil to dry 15 cm below surface between irrigation cycles reduces anaerobic methane by up to 48%.',
      image: '/assets/images/slide_2.jpg'
    },
    {
      step: 'Science 03',
      title: 'Static Chamber Gas Flux Calibration',
      desc: 'Calibrated against peer-reviewed closed-chamber gas chromatography from ICAR-IARI and Gimje rice experimental plots.',
      image: '/assets/images/slide_3.jpg'
    },
    {
      step: 'Harvest 04',
      title: 'Climate-Resilient High Yields',
      desc: 'Achieving low methane footprint while preserving maximum grain harvest and soil organic matter balance.',
      image: '/assets/images/slide_4.jpg'
    }
  ];

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, CAROUSEL_SLIDES.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paddysense_token');
      if (!token) return;

      const [overviewRes, fieldsRes] = await Promise.allSettled([
        axios.get('/api/analytics/overview', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/fields', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      let data = {};
      if (overviewRes.status === 'fulfilled' && overviewRes.value.data) {
        data = overviewRes.value.data;
      }

      let fieldCount = 0;
      if (fieldsRes.status === 'fulfilled' && Array.isArray(fieldsRes.value.data)) {
        fieldCount = fieldsRes.value.data.length;
      }

      let totAssessments = data.totalAssessments || 0;
      let avgEm = data.averageEmission || 0;
      let latestEm = data.latestEstimatedEmission || null;
      let latestRisk = data.latestRiskCategory || '—';
      let trends = data.seasonalTrends || [];
      let recent = data.recentAssessments || [];

      if (totAssessments === 0) {
        const cached = localStorage.getItem('paddysense_latest_assessment');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            totAssessments = 1;
            avgEm = parsed.estimatedSeasonalCh4KgHa || 538.6;
            latestEm = parsed.estimatedSeasonalCh4KgHa || 538.6;
            latestRisk = parsed.riskCategory || 'Very High';
            trends = [
              {
                date: new Date(parsed.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
                field: parsed.fieldName || 'Delta Sunrise Plot A',
                emission: avgEm,
                risk: latestRisk
              }
            ];
            recent = [parsed];
          } catch (e) {}
        }
      }

      setStats({
        ...data,
        totalFields: Math.max(data.totalFields || 0, fieldCount, 1),
        totalAssessments: totAssessments,
        averageEmission: avgEm,
        latestEstimatedEmission: latestEm,
        latestRiskCategory: latestRisk,
        recentAssessments: recent,
        seasonalTrends: trends
      });
    } catch (e) {
      console.warn('Overview fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    const handleUpdate = () => fetchOverview();
    window.addEventListener('paddysense_field_updated', handleUpdate);
    window.addEventListener('paddysense_assessment_saved', handleUpdate);
    return () => {
      window.removeEventListener('paddysense_field_updated', handleUpdate);
      window.removeEventListener('paddysense_assessment_saved', handleUpdate);
    };
  }, []);

  const slide = CAROUSEL_SLIDES[currentSlide];

  const pieData = [
    { name: 'Low Risk', value: stats.lowRiskCount || 0, color: '#16a34a' },
    { name: 'Moderate Risk', value: stats.moderateRiskCount || 0, color: '#ca8a04' },
    { name: 'High Risk', value: stats.highRiskCount || 0, color: '#ea580c' },
    { name: 'Very High Risk', value: stats.veryHighRiskCount || 0, color: '#dc2626' }
  ].filter(d => d.value > 0);

  const getRiskBadgeClass = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'badge-low';
      case 'moderate': return 'badge-moderate';
      case 'high': return 'badge-high';
      default: return 'badge-very-high';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            Paddy Field Monitoring Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem' }}>
            Monitor your paddy fields, understand estimated methane emissions, and explore sustainable cultivation practices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={() => onNavigateTab('my-fields')} className="btn-secondary">
            <Sprout size={16} />
            <span>Manage Fields</span>
          </button>
          <button onClick={() => onNavigateTab('new-assessment')} className="btn-primary">
            <PlusCircle size={16} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* 4-Card 5-Second Auto-Rotating Feature Carousel using Uploaded Images 1-4 */}
      <div
        className="guide-carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className="carousel-arrow prev" onClick={prevSlide} title="Previous Practice">
          <ChevronLeft size={20} />
        </button>
        <button className="carousel-arrow next" onClick={nextSlide} title="Next Practice">
          <ChevronRight size={20} />
        </button>

        <div className="carousel-slide">
          <img src={slide.image} alt={slide.title} className="carousel-img" />
          <div className="carousel-overlay" />
          <div className="carousel-text">
            <span className="carousel-step-badge">{slide.step}</span>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {slide.title}
            </h3>
            <p style={{ fontSize: '0.96rem', color: '#f1f5f9', lineHeight: 1.6 }}>
              {slide.desc}
            </p>
          </div>
        </div>

        <div className="carousel-dots">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>
      </div>

      {/* KPI Interactive Pop-Up Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
        <div className="metric-hover-card" onClick={() => onNavigateTab('my-fields')} style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registered Fields
            </span>
            <div className="card-icon-badge">
              <Sprout size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
            {stats.totalFields}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Active paddy plots mapped
          </div>
        </div>

        <div className="metric-hover-card" onClick={() => onNavigateTab('history')} style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Completed Assessments
            </span>
            <div className="card-icon-badge" style={{ color: 'var(--primary)', background: '#ecfdf5' }}>
              <ClipboardList size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            {stats.totalAssessments}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Continuous model estimations
          </div>
        </div>

        <div className="metric-hover-card" onClick={() => onNavigateTab('methane-predictions')} style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Latest CH₄ Emission Estimate
            </span>
            <div className="card-icon-badge" style={{ color: '#176B4D', background: '#e6f4ea' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: stats.latestEstimatedEmission ? '#176B4D' : 'var(--text-muted)', letterSpacing: '-0.02em' }}>
            {stats.latestEstimatedEmission ? `${stats.latestEstimatedEmission}` : '—'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            kg CH₄/ha/season
          </div>
        </div>

        <div className="metric-hover-card" onClick={() => onNavigateTab('methane-predictions')} style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Latest Emission Risk
            </span>
            <div className="card-icon-badge" style={{ color: '#ea580c', background: '#fff7ed' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ marginTop: '0.3rem' }}>
            <span className={getRiskBadgeClass(stats.latestRiskCategory)} style={{ fontSize: '0.92rem', padding: '5px 14px' }}>
              {stats.latestRiskCategory || 'No Data'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Calibrated agro-ecological threshold
          </div>
        </div>
      </div>

      {/* Latest Assessment Feature Card */}
      {stats.recentAssessments && stats.recentAssessments.length > 0 && (
        <div className="farmer-card" style={{ padding: '1.8rem', background: 'linear-gradient(135deg, #ffffff 0%, var(--primary-soft) 100%)', border: '1.5px solid rgba(23, 107, 77, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                LATEST FIELD ASSESSMENT
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {stats.recentAssessments[0].fieldName} ({stats.recentAssessments[0].season} Season)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Location: {stats.recentAssessments[0].location || 'Field Location Recorded'}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={getRiskBadgeClass(stats.recentAssessments[0].riskCategory)}>
                {stats.recentAssessments[0].riskCategory} Risk
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginTop: '6px' }}>
                {stats.recentAssessments[0].estimatedSeasonalCh4KgHa} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>kg CH₄/ha</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(23, 107, 77, 0.15)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Assessed on {new Date(stats.recentAssessments[0].createdAt).toLocaleDateString()} via {stats.recentAssessments[0].modelName}
            </span>
            <button
              onClick={() => {
                onSelectAssessment(stats.recentAssessments[0]);
                onNavigateTab('methane-predictions');
              }}
              className="btn-primary"
              style={{ padding: '8px 20px', fontSize: '0.9rem' }}
            >
              <span>View Full Diagnosis & SHAP Factors</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Trend Line Chart */}
        <div className="farmer-card" style={{ padding: '1.6rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
            Seasonal Methane Estimation Trend (kg CH₄/ha)
          </h3>
          {stats.seasonalTrends && stats.seasonalTrends.length > 0 ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#71837a" />
                  <YAxis stroke="#71837a" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(val) => [`${val} kg CH₄/ha/season`, 'Estimated Intensity']}
                  />
                  <Line type="monotone" dataKey="emission" stroke="#176B4D" strokeWidth={3} dot={{ r: 5, fill: '#176B4D' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <TrendingUp size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No historical assessment trends yet.</p>
              <button onClick={() => onNavigateTab('new-assessment')} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginTop: '6px' }}>
                Run first field assessment &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Risk Distribution Chart */}
        <div className="farmer-card" style={{ padding: '1.6rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
            Risk Distribution
          </h3>
          {pieData.length > 0 ? (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '-10px' }}>
                {pieData.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />
                    {d.name}: {d.value}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <Compass size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No risk categories recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
