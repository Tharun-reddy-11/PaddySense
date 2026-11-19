import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sprout,
  BarChart3,
  GitCompare,
  Lightbulb,
  Activity,
  Flame,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';

export default function AssessmentHistoryView({
  onNavigateTab,
  onSelectAssessment
}) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedSeason, setSelectedSeason] = useState('ALL');

  useEffect(() => {
    fetchHistory();
    const handleSaved = () => fetchHistory();
    window.addEventListener('paddysense_assessment_saved', handleSaved);
    return () => window.removeEventListener('paddysense_assessment_saved', handleSaved);
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paddysense_token');
      let data = [];
      if (token) {
        try {
          const res = await axios.get('/api/assessments', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (Array.isArray(res.data) && res.data.length > 0) {
            data = res.data;
          }
        } catch (apiErr) {
          console.warn('API assessments fetch warning:', apiErr);
        }
      }
      if (data.length === 0) {
        const cached = localStorage.getItem('paddysense_latest_assessment');
        if (cached) {
          try {
            data = [JSON.parse(cached)];
          } catch (e) {}
        }
      }
      setAssessments(data);
    } catch (e) {
      console.warn('Failed to load assessments:', e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Low':
        return { bg: '#dcfce7', text: '#16a34a', border: '#86efac' };
      case 'Moderate':
        return { bg: '#fef3c7', text: '#d97706', border: '#fde68a' };
      case 'High':
        return { bg: '#ffedd5', text: '#ea580c', border: '#fdba74' };
      case 'Very High':
        return { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' };
      default:
        return { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1' };
    }
  };

  // Filtered assessments
  const filtered = assessments.filter((a) => {
    const matchesQuery =
      (a.fieldName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.season || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === 'ALL' || a.riskCategory === selectedRisk;
    const matchesSeason = selectedSeason === 'ALL' || a.season === selectedSeason;

    return matchesQuery && matchesRisk && matchesSeason;
  });

  const totalCount = assessments.length;
  const avgEmission = totalCount > 0
    ? (assessments.reduce((acc, cur) => acc + (cur.estimatedSeasonalCh4KgHa || 0), 0) / totalCount).toFixed(1)
    : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.75rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 700 }}>
            Audit & Longitudinal Records
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Historical Field Assessments
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Review past seasonal evaluations, track mitigation progress across seasons, and reload diagnosis profiles.
          </p>
        </div>

        <button onClick={() => onNavigateTab('new-assessment')} className="btn-primary">
          <Sprout size={18} />
          <span>New Assessment</span>
        </button>
      </div>

      {/* Summary Stat Interactive Pop-Up Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.2rem' }}>
        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Evaluations
            </span>
            <div className="card-icon-badge">
              <ClipboardList size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {totalCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Recorded seasonal assessments
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Average Emission
            </span>
            <div className="card-icon-badge" style={{ color: 'var(--primary-dark)', background: '#e6f4ea' }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
            {avgEmission} <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>kg CH₄/ha</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Seasonal average intensity
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Low-Risk Assessments
            </span>
            <div className="card-icon-badge" style={{ color: '#16a34a', background: '#dcfce7' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#16a34a', letterSpacing: '-0.02em' }}>
            {assessments.filter((a) => a.riskCategory === 'Low').length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Fields below 150 kg CH₄/ha
          </div>
        </div>

        <div className="metric-hover-card" style={{ padding: '1.3rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              High / Very High Risk
            </span>
            <div className="card-icon-badge" style={{ color: '#dc2626', background: '#fee2e2' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#dc2626', letterSpacing: '-0.02em' }}>
            {assessments.filter((a) => a.riskCategory === 'High' || a.riskCategory === 'Very High').length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Fields exceeding 350 kg CH₄/ha
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by field name, season, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="High">High Risk</option>
            <option value="Very High">Very High Risk</option>
          </select>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="ALL">All Seasons</option>
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Boro">Boro (Summer)</option>
          </select>
        </div>
      </div>

      {/* Assessments Table */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <div style={{ display: 'inline-block', width: '36px', height: '36px', border: '3px solid var(--border-light)', borderTop: '3px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading assessment logs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem' }}>
          <History size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No Assessments Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            No records match the selected filters or query.
          </p>
          <button onClick={() => { setSearchQuery(''); setSelectedRisk('ALL'); setSelectedSeason('ALL'); }} className="btn-secondary">
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-main)', borderBottom: '1.5px solid var(--border-light)' }}>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700 }}>Field & Location</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700 }}>Season</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700 }}>Emission Intensity</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700 }}>Risk Level</th>
                <th style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const badge = getRiskBadge(item.riskCategory);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.fieldName || `Field #${item.fieldId}`}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{item.location || 'India'}</div>
                    </td>

                    <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                      <span style={{ fontWeight: 600 }}>{item.season}</span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                        {item.estimatedSeasonalCh4KgHa ? item.estimatedSeasonalCh4KgHa.toFixed(1) : '—'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        kg/ha
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`
                      }}>
                        {item.riskCategory || 'Moderate'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            if (onSelectAssessment) onSelectAssessment(item.id);
                            onNavigateTab('methane-predictions');
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="View Full Diagnosis"
                        >
                          <BarChart3 size={14} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectAssessment) onSelectAssessment(item.id);
                            onNavigateTab('recommendations');
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="View Recommendations"
                        >
                          <Lightbulb size={14} />
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectAssessment) onSelectAssessment(item.id);
                            onNavigateTab('scenario-comparison');
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="Simulate Scenario"
                        >
                          <GitCompare size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
