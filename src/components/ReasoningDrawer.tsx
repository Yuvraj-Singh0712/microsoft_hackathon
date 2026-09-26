import React, { useState } from 'react';
import { AgentThoughtStep } from '../types/travel';
import { Brain, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Clock, Cpu } from 'lucide-react';

interface ReasoningDrawerProps {
  steps: AgentThoughtStep[];
  isThinking?: boolean;
}

export const ReasoningDrawer: React.FC<ReasoningDrawerProps> = ({ steps, isThinking = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (steps.length === 0 && !isThinking) return null;

  return (
    <div
      className="glass-panel"
      style={{
        margin: '16px 0',
        padding: '16px 20px',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        background: 'rgba(10, 15, 29, 0.85)',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(6, 182, 212, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)',
            }}
          >
            <Brain size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Agent Cognitive Brain & Reasoning Trace</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                {steps.length} Steps
              </span>
              {isThinking && (
                <span className="badge badge-amber animate-pulse-glow" style={{ fontSize: '0.65rem' }}>
                  Reasoning...
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
              Live execution logs: Intent extraction • Security gate • Tool orchestration • Constraint solver
            </p>
          </div>
        </div>

        <button
          className="btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? 'Collapse' : 'Inspect'}
        </button>
      </div>

      {/* Expanded Reasoning List */}
      {isExpanded && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((st) => {
              const statusIcon =
                st.status === 'success' ? (
                  <CheckCircle size={16} color="#10b981" />
                ) : st.status === 'warning' ? (
                  <AlertTriangle size={16} color="#f59e0b" />
                ) : st.status === 'blocked' ? (
                  <XCircle size={16} color="#f43f5e" />
                ) : (
                  <Clock size={16} color="#38bdf8" />
                );

              const badgeColor =
                st.phase === 'SECURITY_AUDIT'
                  ? 'badge-rose'
                  : st.phase === 'INTENT_PARSING'
                  ? 'badge-purple'
                  : st.phase === 'TOOL_DISPATCH'
                  ? 'badge-cyan'
                  : st.phase === 'BUDGET_VERIFY'
                  ? 'badge-emerald'
                  : 'badge-amber';

              return (
                <div
                  key={st.step}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {statusIcon}
                      <span className={`badge ${badgeColor}`} style={{ fontSize: '0.65rem' }}>
                        {st.phase}
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{st.title}</strong>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{st.timestamp}</span>
                  </div>
                  <p style={{ margin: '4px 0 0 24px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {st.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
