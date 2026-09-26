import React, { useState } from 'react';
import { Itinerary, ReplanningDelta } from '../types/travel';
import { DisruptionType, AgentReplanner } from '../agent/replanner';
import { Zap, CloudRain, IndianRupee, Salad, Flame, Mountain, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

interface WhatIfSimulatorProps {
  currentItinerary: Itinerary;
  onPlanUpdated: (newItinerary: Itinerary, delta: ReplanningDelta) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentItinerary,
  onPlanUpdated,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDisruption, setActiveDisruption] = useState<DisruptionType | null>(null);
  const [lastDelta, setLastDelta] = useState<ReplanningDelta | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const scenarios: {
    type: DisruptionType;
    title: string;
    icon: React.ReactNode;
    badge: string;
    description: string;
  }[] = [
    {
      type: 'RAIN_DISRUPTION_DAY2',
      title: 'Monsoon Cloudburst on Day 2',
      icon: <CloudRain size={20} color="#38bdf8" />,
      badge: 'Weather Disruption',
      description: 'Trigger severe rain forecast. Automatically replaces slick outdoor waterfall trek with sheltered heritage pottery atelier & cozy book cafe.',
    },
    {
      type: 'BUDGET_REDUCTION_35K',
      title: 'Budget Cut to ₹35,000',
      icon: <IndianRupee size={20} color="#10b981" />,
      badge: 'Financial Constraint',
      description: 'User budget drops from ₹50,000 to ₹35,000. Re-balances lodging to boutique eco-chalets and authentic local dining trails without sacrificing experiences.',
    },
    {
      type: 'PURE_VEGETARIAN',
      title: 'Strictly Pure Vegetarian / Sattvic',
      icon: <Salad size={20} color="#34d399" />,
      badge: 'Dietary Preference',
      description: 'Instantly filters all culinary stops to 100% verified pure-veg, sattvic organic hill kitchens with local grain specialties.',
    },
    {
      type: 'FAST_PACED_ADVENTURE',
      title: 'Switch to Fast-Paced Adventure',
      icon: <Flame size={20} color="#f59e0b" />,
      badge: 'Pace Acceleration',
      description: 'Increases activity density from relaxed 2 spots/day to 3-4 high-energy spots, adding dawn cave meditation and high ridge viewpoints.',
    },
    {
      type: 'SWAP_DESTINATION_HIMACHAL',
      title: 'Relocate to Tirthan Valley, HP',
      icon: <Mountain size={20} color="#c084fc" />,
      badge: 'Geographic Shift',
      description: 'Swaps route to Himachal Pradesh with UNESCO Great Himalayan National Park eco-trails and luxury AC Volvo transit.',
    }
  ];

  const handleTriggerScenario = async (type: DisruptionType) => {
    setIsProcessing(true);
    setActiveDisruption(type);
    try {
      const result = await AgentReplanner.replan(currentItinerary, type);
      if (result.itinerary) {
        setLastDelta(result.delta);
        onPlanUpdated(result.itinerary, result.delta);
      }
    } catch (err) {
      console.error('Re-planning failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomReplan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsProcessing(true);
    try {
      // Map common custom text to suitable disruption type or default to budget/rain
      let type: DisruptionType = 'RAIN_DISRUPTION_DAY2';
      const text = customPrompt.toLowerCase();
      if (text.includes('budget') || text.includes('₹') || text.includes('money') || text.includes('cheap')) {
        type = 'BUDGET_REDUCTION_35K';
      } else if (text.includes('veg') || text.includes('jain') || text.includes('food')) {
        type = 'PURE_VEGETARIAN';
      } else if (text.includes('fast') || text.includes('adventure') || text.includes('trek')) {
        type = 'FAST_PACED_ADVENTURE';
      } else if (text.includes('himachal') || text.includes('kasol') || text.includes('tirthan')) {
        type = 'SWAP_DESTINATION_HIMACHAL';
      }

      const result = await AgentReplanner.replan(currentItinerary, type, customPrompt);
      if (result.itinerary) {
        setLastDelta(result.delta);
        onPlanUpdated(result.itinerary, result.delta);
        setCustomPrompt('');
      }
    } catch (err) {
      console.error('Custom replan failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Introduction Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#f59e0b" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Dynamic "What-If" Disruption Simulator
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
              Test how the AI Agent autonomously adapts when constraints change mid-journey
            </p>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: 1.5 }}>
          Traditional travel apps break when plans change. WanderWise AI dynamically recalculates feasibility, balances hard budget caps, and explains its decision delta in plain English.
        </p>
      </div>

      {/* Disruption Scenarios Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {scenarios.map((scen) => (
          <div
            key={scen.type}
            className="glass-panel"
            style={{
              padding: '20px 22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: activeDisruption === scen.type ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
              background: activeDisruption === scen.type ? 'rgba(6, 182, 212, 0.06)' : 'var(--bg-card)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {scen.icon}
                  <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>{scen.badge}</span>
                </div>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                {scen.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {scen.description}
              </p>
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                id={`trigger-${scen.type.toLowerCase()}`}
                className="btn-primary"
                onClick={() => handleTriggerScenario(scen.type)}
                disabled={isProcessing}
                style={{ width: '100%', fontSize: '0.85rem', padding: '9px 16px' }}
              >
                {isProcessing && activeDisruption === scen.type ? (
                  <span>Re-calculating Plan...</span>
                ) : (
                  <>
                    <span>Simulate Disruption</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Disruption Prompt Field */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px 0' }}>
          Or Inject Custom Requirement Shift
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
          Type any mid-trip constraint shift (e.g. "We only have ₹32k left and want to add river rafting on day 3"):
        </p>
        <form onSubmit={handleCustomReplan} style={{ display: 'flex', gap: 10 }}>
          <input
            id="custom-replan-input"
            type="text"
            placeholder="Type custom disruption or constraint update..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isProcessing}
          />
          <button
            id="custom-replan-submit"
            type="submit"
            className="btn-primary"
            disabled={isProcessing || !customPrompt.trim()}
            style={{ whiteSpace: 'nowrap' }}
          >
            Adapt Plan
          </button>
        </form>
      </div>

      {/* Delta Inspection Box */}
      {lastDelta && (
        <div
          className="glass-panel"
          style={{
            padding: '24px 28px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <CheckCircle2 size={22} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#34d399' }}>
                Re-planning Delta Breakdown (Version {currentItinerary.version})
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Trigger: {lastDelta.changeTrigger} • Recorded at {lastDelta.timestamp}
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px 18px', borderRadius: 12, marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              Summary of Adaptations:
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              {lastDelta.changesSummary}
            </p>
          </div>

          {lastDelta.swappedActivities.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: '#38bdf8' }}>
                Activity Swaps:
              </div>
              {lastDelta.swappedActivities.map((swap, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    marginBottom: 6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fb7185' }}>
                    <span>🔴 Removed:</span> <s>{swap.original}</s>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', marginTop: 4 }}>
                    <span>🟢 Substituted:</span> <strong>{swap.replacement}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>
                    Reason: {swap.reason}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#c084fc' }}>
              Agent Reasoning Trace:
            </div>
            <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {lastDelta.reasoningChain.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
