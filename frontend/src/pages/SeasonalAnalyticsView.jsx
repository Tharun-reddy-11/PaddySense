import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Sprout,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Award,
  Sparkles,
  PieChart as PieIcon,
  Flame,
  Leaf,
  Activity,
  ClipboardCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

export default function SeasonalAnalyticsView({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const handleSaved = () => fetchAnalytics();
    window.addEventListener('paddysense_assessment_saved', handleSaved);
    return () => window.removeEventListener('paddysense_assessment_saved', handleSaved);
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paddysense_token');
      let data = null;
      if (token) {
        try {
          const res = await axios.get('/api/analytics/overview', {
            headers: { Authorization: `Bearer ${token}` }
          });
          data = res.data;
        } catch (apiErr) {
          console.warn('Analytics overview API warning:', apiErr);
        }
      }

      if (!data || data.totalAssessments === 0) {
        const cached = localStorage.getItem('paddysense_latest_assessment');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const em = parsed.estimatedSeasonalCh4KgHa || 538.6;
            const rk = parsed.riskCategory || 'Very High';
            data = {
              totalFields: 1,
              totalAssessments: 1,
              averageEmission: em,
              latestEstimatedEmission: em,
              latestRiskCategory: rk,
              lowRiskCount: rk === 'Low' ? 1 : 0,
              moderateRiskCount: rk === 'Moderate' ? 1 : 0,
              highRiskCount: rk === 'High' ? 1 : 0,
              veryHighRiskCount: rk === 'Very High' ? 1 : 0,
              seasonalTrends: [
                {
                  date: new Date(parsed.createdAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
                  field: parsed.fieldName || 'Delta Sunrise Plot A',
                  emission: em,
                  risk: rk
                }
              ]
            };
          } catch (e) {}
        }
      }
      setStats(data);
    } catch (e) {
      console.warn('Failed to load analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  const trends = stats?.seasonalTrends || [];
  const riskPieData = [
    { name: 'Low Risk', value: stats?.lowRiskCount || 0, color: '#16a34a' },
    { name: 'Moderate Risk', value: stats?.moderateRiskCount || 0, color: '#eab308' },
    { name: 'High Risk', value: stats?.highRiskCount || 0, color: '#ea580c' },
    { name: 'Very High Risk', value: stats?.veryHighRiskCount || 0, color: '#dc2626' }
  ].filter((d) => d.value > 0);

  // Group emissions by field
  const fieldAverages = {};
  trends.forEach((t) => {
    const f = t.field || 'General Plot';
    if (!fieldAverages[f]) {
      fieldAverages[f] = { field: f, total: 0, count: 0 };
    }
    fieldAverages[f].total += t.emission;
    fieldAverages[f].count += 1;
  });

  const fieldBarData = Object.values(fieldAverages).map((item) => ({
    field: item.field,
    avgEmission: Math.round(item.total / item.count)
  }));

  const totalAssessments = stats?.totalAssessments || 0;
  const avgEmission = stats?.averageEmission || 0;
  const avoidedCo2Kg = Math.max(0, (501.5 - avgEmission) * totalAssessments * 28);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.75rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 700 }}>
            Macro Agronomic Intelligence
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Seasonal Trends & Mitigation Analytics
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Longitudinal monitoring of methane emission reductions, field-by-field performance, and climate impact metrics.
          </p>
        </div>

        <button onClick={() => onNavigateTab('new-assessment')} className="btn-primary">
          <Sprout size={18} />
          <span>New Assessment</span>
        </button>
      </div>

      {/* KPI Interactive Pop-Up Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Farm Average Intensity
            </span>
            <div className="card-icon-badge" style={{ color: 'var(--primary-dark)', background: '#e6f4ea' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
            {avgEmission} <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>kg CH₄/ha</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            vs Regional Reference: 501.5 kg/ha
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Avoided Carbon Equivalent
            </span>
            <div className="card-icon-badge" style={{ color: '#16a34a', background: '#dcfce7' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a', letterSpacing: '-0.02em' }}>
            {(avoidedCo2Kg / 1000).toFixed(2)} <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>tonnes CO₂e</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Mitigated across assessed fields
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fields Under Monitoring
            </span>
            <div className="card-icon-badge">
              <Sprout size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {stats?.totalFields || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Active paddy plots mapped
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Evaluations Performed
            </span>
            <div className="card-icon-badge" style={{ color: 'var(--primary)', background: '#ecfdf5' }}>
              <ClipboardCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {totalAssessments}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Completed crop cycle checks
          </div>
        </div>
      </div>

      {/* Main Longitudinal Trend Chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Longitudinal Methane Emission Trajectory
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Sequential assessments plotted against the high-emission regional reference (501.5 kg/ha).
            </p>
          </div>
        </div>

        {trends.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No assessment data recorded yet. Submit your first assessment to begin tracking trends.
          </div>
        ) : (
          <div style={{ height: '280px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="emissionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B4D" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#176B4D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis unit=" kg" tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 'dataMax + 80']} />
                <Tooltip
                  formatter={(val) => [`${val} kg CH₄/ha`, 'Estimated Emission']}
                  contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="emission" stroke="#176B4D" strokeWidth={3} fillOpacity={1} fill="url(#emissionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Two Column Section: Field Comparison & Risk Classification Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        {/* Field-by-Field Averages */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Field-by-Field Emission Intensity
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Average seasonal emission per individual field plot.
          </p>

          {fieldBarData.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No field-level comparisons available yet.
            </div>
          ) : (
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fieldBarData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="field" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis unit=" kg" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(val) => [`${val} kg CH₄/ha`, 'Average Emission']}
                    contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                  <Bar dataKey="avgEmission" fill="#176B4D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Risk Classification Distribution */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
            Farm Risk Class Breakdown
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Proportion of evaluated plots in each methane risk tier.
          </p>

          {riskPieData.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Risk breakdown data will render once assessments are performed.
            </div>
          ) : (
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} Assessments`, name]}
                    contentStyle={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
