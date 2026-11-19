import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';
import OverviewView from './pages/OverviewView';
import MyFieldsView from './pages/MyFieldsView';
import NewAssessmentView from './pages/NewAssessmentView';
import MethanePredictionsView from './pages/MethanePredictionsView';
import RecommendationsView from './pages/RecommendationsView';
import ScenarioComparisonView from './pages/ScenarioComparisonView';
import AssessmentHistoryView from './pages/AssessmentHistoryView';
import SeasonalAnalyticsView from './pages/SeasonalAnalyticsView';
import ProfileSettingsView from './pages/ProfileSettingsView';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'login', 'register', 'dashboard'
  const [activeTab, setActiveTab] = useState('overview'); // dashboard tab id
  const [user, setUser] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [preselectedField, setPreselectedField] = useState(null);

  // Check saved session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('paddysense_token');
    const savedUser = localStorage.getItem('paddysense_user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Verify with backend
        axios
          .get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${savedToken}` }
          })
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('paddysense_user', JSON.stringify(res.data));
          })
          .catch(() => {
            // Token expired or invalid
            handleLogout();
          });
      } catch (e) {
        localStorage.removeItem('paddysense_user');
      }
    }
  }, []);

  const handleAuthSuccess = (authData) => {
    const userObj = {
      id: authData.id,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
      state: authData.state,
      district: authData.district,
      village: authData.village,
      phone: authData.phone,
      profilePicture: authData.profilePicture,
      preferredUnit: authData.preferredUnit
    };
    setUser(userObj);
    localStorage.setItem('paddysense_user', JSON.stringify(userObj));
    setCurrentView('dashboard');
    setActiveTab('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('paddysense_token');
    localStorage.removeItem('paddysense_user');
    setUser(null);
    setCurrentView('landing');
    setActiveTab('overview');
  };

  const handleNavigate = (target, tab) => {
    if (target === 'login' || target === 'register') {
      setCurrentView(target);
    } else if (target === 'landing') {
      setCurrentView('landing');
    } else if (target === 'dashboard') {
      setCurrentView('dashboard');
      if (tab) setActiveTab(tab);
    } else {
      // In case tab id is passed directly
      setCurrentView('dashboard');
      setActiveTab(target);
    }
  };

  const handleSelectFieldForAssessment = (field) => {
    setPreselectedField(field);
    setCurrentView('dashboard');
    setActiveTab('new-assessment');
  };

  const handleSelectAssessment = (id) => {
    setSelectedAssessmentId(id);
  };

  const handleAssessmentCompleted = (assessmentDetail) => {
    if (assessmentDetail?.id) {
      setSelectedAssessmentId(assessmentDetail.id);
    }
    setActiveTab('methane-predictions');
  };

  // Render Views
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <AuthPage
        initialMode="login"
        onAuthSuccess={handleAuthSuccess}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <AuthPage
        initialMode="register"
        onAuthSuccess={handleAuthSuccess}
        onNavigate={handleNavigate}
      />
    );
  }

  // Dashboard Workspace
  return (
    <DashboardLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onSelectTab={(tabId) => setActiveTab(tabId)}
    >
      {activeTab === 'overview' && (
        <OverviewView
          user={user}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectAssessment={(id) => {
            setSelectedAssessmentId(id);
            setActiveTab('methane-predictions');
          }}
        />
      )}

      {activeTab === 'my-fields' && (
        <MyFieldsView
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectFieldForAssessment={handleSelectFieldForAssessment}
        />
      )}

      {activeTab === 'new-assessment' && (
        <NewAssessmentView
          preselectedField={preselectedField}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onAssessmentCompleted={handleAssessmentCompleted}
        />
      )}

      {activeTab === 'methane-predictions' && (
        <MethanePredictionsView
          selectedAssessmentId={selectedAssessmentId}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectAssessment={handleSelectAssessment}
        />
      )}

      {activeTab === 'recommendations' && (
        <RecommendationsView
          selectedAssessmentId={selectedAssessmentId}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectAssessment={handleSelectAssessment}
        />
      )}

      {activeTab === 'scenario-comparison' && (
        <ScenarioComparisonView
          selectedAssessmentId={selectedAssessmentId}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectAssessment={handleSelectAssessment}
        />
      )}

      {activeTab === 'history' && (
        <AssessmentHistoryView
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectAssessment={(id) => {
            setSelectedAssessmentId(id);
          }}
        />
      )}

      {activeTab === 'analytics' && (
        <SeasonalAnalyticsView
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileSettingsView
          user={user}
          onUpdateUser={(updated) => setUser(updated)}
          onLogout={handleLogout}
        />
      )}
    </DashboardLayout>
  );
}
