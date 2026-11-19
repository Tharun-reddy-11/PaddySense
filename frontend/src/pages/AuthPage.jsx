import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { INDIAN_STATES_DISTRICTS, getDistrictGeo } from '../utils/geoData';

export default function AuthPage({ initialMode = 'login', onAuthSuccess, onNavigate }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    village: '',
    latitude: 16.71,
    longitude: 81.34,
    preferredUnit: 'hectare'
  });

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
    setError('');
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
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(endpoint, payload);
      const data = res.data;

      // Save complete user info & JWT token in localStorage
      localStorage.setItem('paddysense_token', data.token);
      localStorage.setItem('paddysense_user', JSON.stringify({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        phone: data.phone || formData.phone,
        state: data.state || formData.state,
        district: data.district || formData.district,
        village: data.village || formData.village,
        latitude: formData.latitude,
        longitude: formData.longitude,
        profilePicture: data.profilePicture || null,
        preferredUnit: data.preferredUnit || 'hectare'
      }));

      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Authentication failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const currentDistricts = INDIAN_STATES_DISTRICTS[formData.state] || [];

  return (
    <div className="auth-page">
      <div className="auth-overlay" />

      <div className="auth-card" style={{ maxWidth: isLogin ? '460px' : '560px' }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.2rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div className="auth-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.8rem' }}>
            <img src="/assets/branding/logo.png" alt="PaddySense" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>PaddySense</span>
          </div>
          <h2>{isLogin ? 'Farmer Sign In' : 'Register New Farmer Account'}</h2>
          <p>
            {isLogin
              ? 'Access your registered fields, continuous methane predictions, and history.'
              : 'Join the sustainable rice farming network. All required fields marked with *'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="required-star">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              Email Address <span className="required-star">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="farmer@paddysense.org"
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="required-star">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password (min 6 characters)"
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '38px' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="form-input"
                      style={{ paddingLeft: '36px' }}
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">State <span className="required-star">*</span></label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateChange}
                    className="form-select"
                  >
                    {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">District <span className="required-star">*</span></label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="form-select"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Village / Mandal <span className="required-star">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Maruteru"
                      className="form-input"
                      style={{ paddingLeft: '36px' }}
                    />
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '0.6rem', fontSize: '1rem' }}
          >
            <span>{loading ? 'Please wait...' : isLogin ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {isLogin ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => { setIsLogin(false); setError(''); }}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Register Now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => { setIsLogin(true); setError(''); }}
                style={{ color: 'var(--primary)', fontWeight: 700 }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
