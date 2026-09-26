import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, AlertTriangle, CornerDownLeft, Mic } from 'lucide-react';
import { SecurityAuditResult } from '../types/travel';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  securityAudit?: SecurityAuditResult;
  isError?: boolean;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isGenerating,
}) => {
  const [inputText, setInputText] = useState('');

  const samplePrompts = [
    'Plan a 5-day trip from Delhi for 2 people under ₹50K, focused on nature and food, with a relaxed itinerary.',
    'Disruption: Heavy rain predicted on Day 2, swap outdoor trails.',
    'Can we optimize budget to ₹35k without losing nature vibes?',
    'Make all dining strictly Pure Vegetarian / Sattvic.',
    'Switch destination to Tirthan Valley, Himachal Pradesh.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSelectChip = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            Conversational Travel Co-pilot
          </h2>
        </div>
        <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
          Real-time Intent & Re-planning Engine
        </span>
      </div>

      {/* Fast Prompt Suggestions */}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
          QUICK SCENARIOS & PROMPTS:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              className="btn-pill"
              onClick={() => handleSelectChip(p)}
              disabled={isGenerating}
              style={{ fontSize: '0.78rem', textAlign: 'left' }}
            >
              {idx === 0 ? '🎯 Challenge Prompt' : p.slice(0, 38) + '...'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          maxHeight: 280,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          paddingRight: 6,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
            }}
          >
            {msg.sender === 'agent' && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={16} color="#ffffff" />
              </div>
            )}

            <div
              style={{
                background: msg.sender === 'user' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                border: msg.sender === 'user' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: msg.sender === 'user' ? '#38bdf8' : '#10b981' }}>
                  {msg.sender === 'user' ? 'You' : 'WanderWise Concierge'}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.45 }}>{msg.text}</p>

              {msg.securityAudit && !msg.securityAudit.isSafe && (
                <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, color: '#fb7185', fontSize: '0.75rem' }}>
                  <AlertTriangle size={13} />
                  <span>Security filter applied: {msg.securityAudit.defenseExplanation}</span>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={16} color="#94a3b8" />
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#ffffff" />
            </div>
            <div className="badge badge-cyan animate-pulse-glow" style={{ fontSize: '0.78rem' }}>
              Reasoning & Dispatching Tools...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <input
          id="chat-user-input"
          type="text"
          placeholder="Ask WanderWise AI to plan, adapt, reduce budget, or adjust pace..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isGenerating}
        />
        <button
          id="chat-send-btn"
          type="submit"
          className="btn-primary"
          disabled={isGenerating || !inputText.trim()}
          style={{ padding: '0 20px' }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
