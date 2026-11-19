import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Sprout,
  PlusCircle,
  BarChart3,
  Lightbulb,
  GitCompare,
  History,
  TrendingUp,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Bell,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';

export default function DashboardLayout({ user, onLogout, activeTab, onSelectTab, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState('');
  const [greetingIcon, setGreetingIcon] = useState(Sun);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      const displayName = user?.fullName ? user.fullName.split(' ')[0] : 'Farmer';

      if (hour >= 5 && hour < 12) {
        setTimeGreeting(`Good Morning, ${displayName}`);
        setGreetingIcon(Sun);
      } else if (hour >= 12 && hour < 17) {
        setTimeGreeting(`Good Afternoon, ${displayName}`);
        setGreetingIcon(Sun);
      } else if (hour >= 17 && hour < 21) {
        setTimeGreeting(`Good Evening, ${displayName}`);
        setGreetingIcon(Sunset);
      } else {
        setTimeGreeting(`Welcome, ${displayName}`);
        setGreetingIcon(Moon);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('paddysense_token');
      if (!token) return;
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data || []);
      const unread = (res.data || []).filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('paddysense_token');
      for (const n of notifications) {
        if (!n.isRead) {
          await axios.put(`/api/notifications/${n.id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
      fetchNotifications();
    } catch (e) {
      // ignore
    }
  };

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-fields', label: 'My Fields', icon: Sprout },
    { id: 'new-assessment', label: 'New Assessment', icon: PlusCircle },
    { id: 'methane-predictions', label: 'Methane Predictions', icon: BarChart3 },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'scenario-comparison', label: 'Scenario Comparison', icon: GitCompare },
    { id: 'history', label: 'Assessment History', icon: History },
    { id: 'analytics', label: 'Seasonal Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  const GreetingIconComponent = greetingIcon;

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/assets/branding/logo.png" alt="PaddySense" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-dark)' }}>PaddySense</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Farmer Workspace</div>
              </div>
            </div>
          )}
          {collapsed && (
            <img src="/assets/branding/logo.png" alt="PaddySense" style={{ width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto' }} />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: 'var(--radius-sm)' }}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} style={{ flexShrink: 0, color: isActive ? 'var(--primary)' : 'inherit' }} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={onLogout}
            className="sidebar-item"
            style={{ color: '#dc2626' }}
            title={collapsed ? 'Sign Out' : ''}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="greeting-pill">
            <GreetingIconComponent size={22} color="#176B4D" />
            <span>{timeGreeting}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', position: 'relative' }}>
            {/* Notification Bell */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadCount > 0) markAllRead();
              }}
              style={{ position: 'relative', padding: '8px', borderRadius: '50%', background: 'var(--bg-main)', color: 'var(--text-secondary)' }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: '60px',
                width: '320px',
                background: '#ffffff',
                border: '1.5px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1rem',
                zIndex: 100
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>System Notifications</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notifications.length} Total</span>
                </div>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                    No recent notifications
                  </p>
                ) : (
                  <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {notifications.map((n, i) => (
                      <div key={i} style={{ padding: '0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{n.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Profile Pill */}
            <div
              onClick={() => onSelectTab('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: 'var(--bg-main)' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--primary-soft)',
                border: '1.5px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                color: 'var(--primary-dark)',
                overflow: 'hidden'
              }}>
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'F'
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {user?.fullName || 'Farmer'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {user?.village
                    ? `${user.village}${user.district ? `, ${user.district}` : ''}`
                    : (user?.district ? `${user.district}, ${user.state || ''}` : 'PaddySense Grower')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}
