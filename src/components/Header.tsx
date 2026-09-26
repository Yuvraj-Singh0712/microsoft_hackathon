import React from 'react';
import { Compass, ShieldCheck, BarChart3, Zap, Key, Sparkles, BookOpen } from 'lucide-react';

export type ActiveTab = 'studio' | 'what-if' | 'security' | 'evals';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  return (
    <header className="glass-panel" style={{ margin: '16px 20px', padding: '14px 24px', position: 'sticky', top: 12, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Compass size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                WanderWise <span className="text-gradient">AI</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                DebugDynasty
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                🏆 450 Marks Edition
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Autonomous Travel Concierge • Grounded Planning • Adaptive Re-planning • Multi-Tier Security
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.25)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
          <button
            id="tab-studio-btn"
            className={`btn-pill ${activeTab === 'studio' ? 'active' : ''}`}
            onClick={() => setActiveTab('studio')}
            style={{ fontSize: '0.85rem' }}
          >
            <Compass size={16} />
            Itinerary Studio
          </button>

          <button
            id="tab-whatif-btn"
            className={`btn-pill ${activeTab === 'what-if' ? 'active' : ''}`}
            onClick={() => setActiveTab('what-if')}
            style={{ fontSize: '0.85rem' }}
          >
            <Zap size={16} />
            What-If Studio
          </button>

          <button
            id="tab-security-btn"
            className={`btn-pill ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
            style={{ fontSize: '0.85rem' }}
          >
            <ShieldCheck size={16} />
            Security Sandbox (100M)
          </button>

          <button
            id="tab-evals-btn"
            className={`btn-pill ${activeTab === 'evals' ? 'active' : ''}`}
            onClick={() => setActiveTab('evals')}
            style={{ fontSize: '0.85rem' }}
          >
            <BarChart3 size={16} />
            Evals Suite (50M)
          </button>
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            id="api-key-btn"
            className="btn-secondary"
            onClick={onOpenApiKeyModal}
            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            title="Configure optional Gemini API Key"
          >
            <Key size={15} color={hasApiKey ? '#10b981' : '#f59e0b'} />
            {hasApiKey ? 'Gemini 2.5 Active' : 'Offline / API Key'}
          </button>
        </div>
      </div>
    </header>
  );
};
