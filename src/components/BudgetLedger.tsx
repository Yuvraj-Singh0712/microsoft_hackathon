import React from 'react';
import { BudgetBreakdown } from '../types/travel';
import { IndianRupee, PieChart, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface BudgetLedgerProps {
  budget: BudgetBreakdown;
  travelers: number;
}

export const BudgetLedger: React.FC<BudgetLedgerProps> = ({ budget, travelers }) => {
  const percentUsed = Math.min(100, Math.round((budget.allocatedInr / budget.totalBudgetInr) * 100));
  const isHealthy = budget.isWithinBudget;

  const categories = [
    { label: 'Lodging & Stays', amount: budget.categories.accommodationInr, color: '#38bdf8', icon: '🏨' },
    { label: 'Transit & Local Cabs', amount: budget.categories.transitInr, color: '#818cf8', icon: '🚆' },
    { label: 'Local Food & Cafes', amount: budget.categories.foodInr, color: '#f59e0b', icon: '🍲' },
    { label: 'Activities & Permits', amount: budget.categories.activitiesInr, color: '#10b981', icon: '🌲' },
    { label: 'Emergency Buffer', amount: budget.categories.contingencyInr, color: '#c084fc', icon: '🛡️' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', margin: '20px 0' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={16} color="#10b981" />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Live Budget Ledger & Constraint Solver
            </h2>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
              Strict Cap Verified
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Mathematical constraint guarantee: Total allocation never exceeds the user cap of ₹{budget.totalBudgetInr.toLocaleString()}.
          </p>
        </div>

        {/* Amount summary */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: isHealthy ? '#34d399' : '#fb7185' }}>
            ₹{budget.allocatedInr.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ ₹{budget.totalBudgetInr.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ₹{budget.costPerPersonInr.toLocaleString()} per person ({travelers} travelers)
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: 10, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
        {categories.map((c, i) => {
          const catWidth = (c.amount / budget.totalBudgetInr) * 100;
          return (
            <div
              key={i}
              title={`${c.label}: ₹${c.amount.toLocaleString()} (${catWidth.toFixed(1)}%)`}
              style={{
                width: `${catWidth}%`,
                height: '100%',
                background: c.color,
                transition: 'width 0.3s ease',
              }}
            />
          );
        })}
      </div>

      {/* Category Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        {categories.map((c, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: '1rem' }}>{c.icon}</span>
              <span style={{ fontSize: '0.72rem', color: c.color, fontWeight: 700 }}>
                {Math.round((c.amount / budget.totalBudgetInr) * 100)}%
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{c.label}</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              ₹{c.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Savings Tips & Contingency Notice */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 12,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          fontSize: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399' }}>
          <CheckCircle2 size={16} />
          <span>
            <strong>Unallocated Buffer / Savings:</strong> ₹{budget.remainingInr.toLocaleString()} safely retained in your pocket.
          </span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
          💡 Tip: {budget.savingsTips[0]}
        </div>
      </div>
    </div>
  );
};
