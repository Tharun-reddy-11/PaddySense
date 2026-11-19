import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  User,
  Save,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  ShieldCheck,
  Phone,
  Mail,
  Camera,
  Lock,
  KeyRound,
  LogOut,
  Upload
} from 'lucide-react';
import { INDIAN_STATES_DISTRICTS } from '../utils/geoData';

export default function ProfileSettingsView({ user, onUpdateUser, onLogout }) {
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    state: user?.state || 'Andhra Pradesh',
    district: user?.district || 'West Godavari',
    village: user?.village || '',
    profilePicture: user?.profilePicture || '',
    preferredUnit: user?.preferredUnit || 'kg CH4/ha/season'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fileInputRef = useRef(null);

  // Sync profile when user prop changes
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone !== undefined ? user.phone : prev.phone,
        state: user.state || prev.state,
        district: user.district || prev.district,
        village: user.village !== undefined ? user.village : prev.village,
        profilePicture: user.profilePicture !== undefined ? user.profilePicture : prev.profilePicture,
        preferredUnit: user.preferredUnit || prev.preferredUnit
      }));
    }
  }, [user]);

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem('paddysense_token');
        if (!token) return;
        const res = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const d = res.data;
        if (d) {
          setProfile({
            fullName: d.fullName || '',
            email: d.email || '',
            phone: d.phone || '',
            state: d.state || 'Andhra Pradesh',
            district: d.district || 'West Godavari',
            village: d.village || '',
            profilePicture: d.profilePicture || '',
            preferredUnit: d.preferredUnit || 'kg CH4/ha/season'
          });
          if (onUpdateUser) onUpdateUser(d);
        }
      } catch (err) {
        console.warn('Profile fetch note:', err.message);
      }
    };
    fetchLatest();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    setProfile((prev) => ({
      ...prev,
      state: newState,
      district: districts.length > 0 ? districts[0] : ''
    }));
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Profile image must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setProfile((prev) => ({ ...prev, profilePicture: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      const token = localStorage.getItem('paddysense_token');
      const res = await axios.put('/api/auth/profile', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedSuccess(true);

      // Update localStorage & parent state
      const existingUser = JSON.parse(localStorage.getItem('paddysense_user') || '{}');
      const updatedUser = { ...existingUser, ...res.data };
      localStorage.setItem('paddysense_user', JSON.stringify(updatedUser));

      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation password do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const token = localStorage.getItem('paddysense_token');
      await axios.put('/api/auth/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordSuccess('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 4000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const currentDistricts = INDIAN_STATES_DISTRICTS[profile.state] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="card" style={{ padding: '1.25rem 1.75rem' }}>
        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary)', fontWeight: 700 }}>
          Farmer Account & Configuration
        </span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
          Profile & Account Settings
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal identity, regional farm location, profile photo, and password credentials.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Details & Location Form */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }}>
            <User size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Farmer Information & Location
            </h3>
          </div>

          {/* Profile Picture Upload Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-soft)',
                border: '2px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--primary-dark)',
                overflow: 'hidden'
              }}>
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Farmer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'F'
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                  cursor: 'pointer'
                }}
                title="Change Photo"
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                Profile Picture
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Upload your picture or avatar. JPG, PNG up to 2MB.
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.78rem', marginTop: '6px' }}
              >
                <Upload size={13} />
                <span>Choose Photo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                disabled
                className="form-input"
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Registered login identity (cannot be changed)</span>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State</label>
                <select
                  name="state"
                  value={profile.state}
                  onChange={handleStateChange}
                  className="form-select"
                >
                  {Object.keys(INDIAN_STATES_DISTRICTS).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">District</label>
                <select
                  name="district"
                  value={profile.district}
                  onChange={handleChange}
                  className="form-select"
                >
                  {currentDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Village / Mandal</label>
                <input
                  type="text"
                  name="village"
                  value={profile.village}
                  onChange={handleChange}
                  placeholder="e.g. Maruteru"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Unit</label>
                <select
                  name="preferredUnit"
                  value={profile.preferredUnit}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="kg CH4/ha/season">kg CH₄ / ha / season</option>
                  <option value="tonnes CO2e/ha">tonnes CO₂e / ha</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            {savedSuccess && (
              <div style={{ padding: '0.75rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-sm)', color: '#16a34a', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Profile details and location saved successfully.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ marginTop: '0.5rem', padding: '10px 20px' }}
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Security & Password Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }}>
              <KeyRound size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Update Password
              </h3>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  placeholder="Enter current password"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  placeholder="Minimum 6 characters"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  placeholder="Re-enter new password"
                  className="form-input"
                />
              </div>

              {passwordError && (
                <div style={{ padding: '0.75rem', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.82rem' }}>
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div style={{ padding: '0.75rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-sm)', color: '#16a34a', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={changingPassword}
                className="btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                <Lock size={15} />
                <span>{changingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
