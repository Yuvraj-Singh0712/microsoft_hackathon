import React, { useState } from 'react';
import { getActiveApiKey, setApiKey } from '../agent/geminiClient';
import { X, Key, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [keyInput, setKeyInput] = useState(getActiveApiKey() || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(keyInput.trim());
    onKeySaved(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '24px 28px',
          background: 'rgba(13, 18, 29, 0.95)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Key size={20} color="#06b6d4" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Gemini API Key Configuration
            </h3>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px 10px' }}>
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
          WanderWise AI features a hybrid architecture: It seamlessly connects with <strong>Google Gemini 2.5 Flash</strong> when an API key is provided, or operates autonomously via its grounded local knowledge engine with 100% offline reliability.
        </p>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
              GOOGLE GEMINI API KEY (OPTIONAL)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem', color: '#38bdf8' }}>
            🔒 <strong>Privacy Assurance:</strong> API keys are held purely in memory within the client browser session and never sent to external third-party servers.
          </div>

          {savedSuccess && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#34d399', fontSize: '0.82rem' }}>
              <CheckCircle2 size={16} /> Key saved successfully!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
