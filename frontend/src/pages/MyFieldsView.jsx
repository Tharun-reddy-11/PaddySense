import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sprout, Plus, MapPin, Trash2, Edit3, ArrowRight, ShieldCheck, Check, Camera, Image as ImageIcon } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, getDistrictGeo } from '../utils/geoData';

export default function MyFieldsView({ onNavigateTab, onSelectFieldForAssessment }) {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const getSavedUser = () => {
    try {
      return JSON.parse(localStorage.getItem('paddysense_user') || '{}');
    } catch {
      return {};
    }
  };

  const getInitialFormData = () => {
    const user = getSavedUser();
    const st = user.state || 'Andhra Pradesh';
    const distList = INDIAN_STATES_DISTRICTS[st] || ['West Godavari'];
    const dist = user.district || distList[0];
    const geo = getDistrictGeo(st, dist);

    return {
      fieldName: '',
      areaHectares: 1.5,
      state: st,
      district: dist,
      village: user.village || '',
      latitude: user.latitude || geo.lat,
      longitude: user.longitude || geo.lon,
      soilTexture: 'Clay Loam',
      soilPh: 7.8,
      soilOrganicCarbonPct: 0.85,
      riceVariety: 'Semi-dwarf High Yielding',
      currentSeason: 'Kharif',
      fieldImage: null
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const fetchFields = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paddysense_token');
      const res = await axios.get('/api/fields', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFields(res.data || []);
    } catch (e) {
      console.warn('Fields fetch failed:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    const firstDistrict = districts.length > 0 ? districts[0] : '';
    const geo = getDistrictGeo(newState, firstDistrict);

    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: firstDistrict,
      latitude: geo.lat,
      longitude: geo.lon
    }));
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    const geo = getDistrictGeo(formData.state, newDistrict);

    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      latitude: geo.lat,
      longitude: geo.lon
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData(getInitialFormData());
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, fieldImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (field) => {
    setEditId(field.id);
    setFormData({
      fieldName: field.fieldName || '',
      areaHectares: field.areaHectares || 1.5,
      state: field.state || 'Andhra Pradesh',
      district: field.district || 'West Godavari',
      village: field.village || '',
      latitude: field.latitude || 16.71,
      longitude: field.longitude || 81.34,
      soilTexture: field.soilTexture || 'Clay Loam',
      soilPh: field.soilPh || 7.8,
      soilOrganicCarbonPct: field.soilOrganicCarbonPct || 0.85,
      riceVariety: field.riceVariety || 'Semi-dwarf High Yielding',
      currentSeason: field.currentSeason || 'Kharif',
      fieldImage: field.fieldImage || null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('paddysense_token');
      if (editId) {
        await axios.put(`/api/fields/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/fields', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      fetchFields();
      window.dispatchEvent(new Event('paddysense_field_updated'));
    } catch (err) {
      alert('Failed to save field: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this paddy field?')) return;
    try {
      const token = localStorage.getItem('paddysense_token');
      await axios.delete(`/api/fields/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFields();
      window.dispatchEvent(new Event('paddysense_field_updated'));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Low':
        return <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', fontWeight: 800, fontSize: '0.75rem' }}>Low Risk</span>;
      case 'Moderate':
        return <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', fontWeight: 800, fontSize: '0.75rem' }}>Moderate Risk</span>;
      case 'High':
        return <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#ffedd5', color: '#ea580c', fontWeight: 800, fontSize: '0.75rem' }}>High Risk</span>;
      case 'Very High':
        return <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: '0.75rem' }}>Very High Risk</span>;
      default:
        return <span style={{ padding: '3px 10px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', fontWeight: 800, fontSize: '0.75rem' }}>Unassessed</span>;
    }
  };

  const currentDistricts = INDIAN_STATES_DISTRICTS[formData.state] || [];

  return (
    <div>
      {/* View Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
            My Paddy Fields
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage your agricultural plots, configure soil parameters, and initiate seasonal methane flux evaluations.
          </p>
        </div>

        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          <span>Add New Field</span>
        </button>
      </div>

      {/* Fields Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Loading your registered fields...</div>
      ) : fields.length === 0 ? (
        <div className="farmer-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <Sprout size={48} color="#176B4D" style={{ margin: '0 auto 1rem', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Paddy Fields Registered Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.94rem' }}>
            Add your first field to begin tracking water management, fertilizer schedules, and seasonal methane emission potentials.
          </p>
          <button onClick={openAddModal} className="btn-primary">
            <Plus size={16} />
            <span>Register First Field</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {fields.map((f) => (
            <div key={f.id} className="farmer-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Field Header Image Banner */}
                <div style={{ position: 'relative', height: '140px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={f.fieldImage || '/assets/images/real_farmer_field.jpg'}
                    alt={f.fieldName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(16,75,58,0.85) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '10px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: '#ffffff' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                        {f.currentSeason} SEASON
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {f.fieldName}
                      </h3>
                    </div>
                    {getRiskBadge(f.latestRiskCategory)}
                  </div>
                </div>

                <div style={{ padding: '1.2rem 1.4rem 0 1.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1.2rem' }}>
                    <MapPin size={16} color="var(--primary)" />
                    <span>{f.village ? `${f.village}, ` : ''}{f.district || ''}, {f.state || ''}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', padding: '0.9rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', fontSize: '0.86rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Field Area:</span>{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{f.areaHectares} ha</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Soil Texture:</span>{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{f.soilTexture}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Soil pH:</span>{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{f.soilPh}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Soil Carbon (SOC):</span>{' '}
                      <strong style={{ color: 'var(--text-primary)' }}>{f.soilOrganicCarbonPct}%</strong>
                    </div>
                  </div>

                  {f.latestEstimatedEmission ? (
                    <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.84rem', color: '#065f46' }}>Latest Seasonal Emission:</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>{f.latestEstimatedEmission} kg CH₄/ha</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem', fontStyle: 'italic' }}>
                      No assessments submitted yet for this field.
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.4rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => handleEdit(f)} style={{ padding: '6px 10px', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-main)', border: 'none', cursor: 'pointer' }} title="Edit Field Details">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(f.id)} style={{ padding: '6px 10px', color: '#dc2626', borderRadius: 'var(--radius-sm)', background: '#fee2e2', border: 'none', cursor: 'pointer' }} title="Delete Field">
                    <Trash2 size={15} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    onSelectFieldForAssessment(f);
                    onNavigateTab('new-assessment');
                  }}
                  className="btn-primary"
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                >
                  <span>Start Assessment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Field Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-md)',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              {editId ? 'Edit Paddy Field Details' : 'Register New Paddy Field'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Enter field boundaries, regional location, and soil profile characteristics.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Field Image Upload */}
              <div className="form-group" style={{ marginBottom: '1.2rem', padding: '1.1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-medium)' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={16} color="var(--primary)" />
                    <strong>Upload Field Photograph</strong>
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>(Optional - JPG or PNG)</span>
                </label>
                
                {formData.fieldImage ? (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                      <img src={formData.fieldImage} alt="Uploaded field preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, fieldImage: null }))}
                        style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(220,38,38,0.9)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Remove photo"
                      >
                        ×
                      </button>
                    </div>

                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '7px 16px', fontSize: '0.84rem', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={15} />
                      <span>Change Photo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                ) : (
                  <div>
                    <label className="btn-secondary" style={{ cursor: 'pointer', padding: '9px 20px', fontSize: '0.88rem', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <Camera size={17} color="var(--primary)" />
                      <span>Upload New Field Image</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Field Name <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="fieldName"
                  required
                  value={formData.fieldName}
                  onChange={handleChange}
                  placeholder="e.g. North Plot #1 / Delta Field B"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Field Area (Hectares) <span className="required-star">*</span></label>
                  <input
                    type="number"
                    step="0.1"
                    name="areaHectares"
                    required
                    value={formData.areaHectares}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Season</label>
                  <select name="currentSeason" value={formData.currentSeason} onChange={handleChange} className="form-select">
                    <option value="Kharif">Kharif (Monsoon/Wet)</option>
                    <option value="Rabi">Rabi (Winter/Dry)</option>
                    <option value="Boro">Boro (Early Spring)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">State <span className="required-star">*</span></label>
                  <select name="state" value={formData.state} onChange={handleStateChange} className="form-select">
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">District <span className="required-star">*</span></label>
                  <select name="district" value={formData.district} onChange={handleDistrictChange} className="form-select">
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Village / Mandal</label>
                  <input type="text" name="village" value={formData.village} onChange={handleChange} placeholder="e.g. Maruteru" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Latitude (°N)</label>
                  <input type="number" step="0.0001" name="latitude" value={formData.latitude} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude (°E)</label>
                  <input type="number" step="0.0001" name="longitude" value={formData.longitude} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Soil Texture</label>
                  <select name="soilTexture" value={formData.soilTexture} onChange={handleChange} className="form-select">
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Clay">Clay</option>
                    <option value="Silty Clay">Silty Clay</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Silty Loam">Silty Loam</option>
                    <option value="Loam">Loam</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Soil pH</label>
                  <input type="number" step="0.1" name="soilPh" value={formData.soilPh} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Soil Carbon (SOC %)</label>
                  <input type="number" step="0.01" name="soilOrganicCarbonPct" value={formData.soilOrganicCarbonPct} onChange={handleChange} className="form-input" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rice Variety Group</label>
                <select name="riceVariety" value={formData.riceVariety} onChange={handleChange} className="form-select">
                  <option value="Semi-dwarf High Yielding">Semi-dwarf High Yielding (e.g. MTU 1010, IR 64)</option>
                  <option value="Hybrid">High-Vigor Hybrid (e.g. PA 6444, Arize)</option>
                  <option value="Traditional Tall">Traditional Tall / Aromatic (e.g. Basmati, Sambha)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '9px 22px' }}
                >
                  <span>{editId ? 'Save Field Changes' : 'Register Field'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
