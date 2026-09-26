import React, { useState } from 'react';
import { Itinerary, DayPlan } from '../types/travel';
import {
  Calendar,
  MapPin,
  Clock,
  Compass,
  Utensils,
  Hotel,
  Train,
  CheckCircle,
  Volume2,
  Download,
  PartyPopper,
  Sparkles,
  CloudRain,
  Sun,
  ShieldCheck,
  Tag,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onOpenTripPass: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onOpenTripPass }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeDay = itinerary.days[activeDayIndex] || itinerary.days[0];

  // Voice Audio Briefing using Web Speech API
  const handleVoiceBriefing = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = `Here is your travel briefing for ${activeDay.title}. Weather is ${activeDay.weatherSummary.condition} at ${activeDay.weatherSummary.tempC} degrees Celsius. In the morning, you will experience ${activeDay.activities[0]?.title || 'scenic nature walk'}. Later, enjoy lunch at ${activeDay.culinaryHighlights[0]?.restaurantName || 'a local cafe'}, famous for ${activeDay.culinaryHighlights[0]?.specialtyDish || 'Himalayan delicacies'}. Your stay for the night is ${activeDay.accommodation.name}. Have a peaceful and relaxed day!`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleBookTrip = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Trip Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.08) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="badge badge-cyan">{itinerary.origin} ➔ {itinerary.destination}</span>
              <span className="badge badge-emerald">{itinerary.durationDays} Days / {itinerary.durationDays - 1} Nights</span>
              <span className="badge badge-purple">{itinerary.travelers} Travelers</span>
              <span className="badge badge-amber">{itinerary.pace.toUpperCase()} PACE</span>
              {itinerary.version > 1 && (
                <span className="badge badge-rose" style={{ animation: 'pulseGlow 2s infinite' }}>
                  ⚡ Adapted Revision v{itinerary.version}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.02em' }}>
              {itinerary.tripTitle}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, maxWidth: 680 }}>
              Tailored specifically around your core themes:{' '}
              <strong style={{ color: '#38bdf8' }}>{itinerary.themes.join(' & ')}</strong>. Every stop is curated with verified ground citations and realistic transit buffers.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              id="voice-briefing-btn"
              className="btn-secondary"
              onClick={handleVoiceBriefing}
              style={{ fontSize: '0.82rem' }}
            >
              <Volume2 size={16} color={isPlayingAudio ? '#f43f5e' : '#38bdf8'} />
              {isPlayingAudio ? 'Stop Audio' : 'Audio Briefing'}
            </button>

            <button
              id="export-pass-btn"
              className="btn-secondary"
              onClick={onOpenTripPass}
              style={{ fontSize: '0.82rem' }}
            >
              <Download size={16} color="#10b981" />
              Trip Pass / PDF
            </button>

            <button
              id="confirm-booking-btn"
              className="btn-primary"
              onClick={handleBookTrip}
              style={{ fontSize: '0.82rem' }}
            >
              <PartyPopper size={16} />
              Lock & Confirm
            </button>
          </div>
        </div>

        {/* Re-planning Delta Banner if revision exists */}
        {itinerary.revisionHistory && itinerary.revisionHistory.length > 0 && (
          <div
            style={{
              marginTop: 16,
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: '0.82rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fb7185', fontWeight: 700, marginBottom: 4 }}>
              <Sparkles size={16} />
              <span>Adaptive Re-planning Notice (v{itinerary.version}): {itinerary.revisionHistory[0].changesSummary}</span>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Reasoning: {itinerary.revisionHistory[0].reasoningChain[0]}
            </div>
          </div>
        )}
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
        {itinerary.days.map((d, idx) => (
          <button
            key={d.dayNumber}
            id={`day-tab-${d.dayNumber}`}
            className={`glass-panel ${activeDayIndex === idx ? 'glass-panel-glow' : ''}`}
            onClick={() => setActiveDayIndex(idx)}
            style={{
              flex: '1 1 140px',
              minWidth: 140,
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              background: activeDayIndex === idx ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
              border: activeDayIndex === idx ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: activeDayIndex === idx ? '#38bdf8' : 'var(--text-muted)' }}>
                DAY {d.dayNumber}
              </span>
              <span>{d.weatherSummary.icon}</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {d.themeFocus.split('&')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Active Day Overview Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* Weather & Microclimate */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#38bdf8' }}>
            <span style={{ fontSize: '1.2rem' }}>{activeDay.weatherSummary.icon}</span>
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Weather & Atmosphere</h3>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {activeDay.weatherSummary.condition} • {activeDay.weatherSummary.tempC}°C
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Precipitation probability: {activeDay.weatherSummary.rainProbability}%
          </div>
          {activeDay.weatherSummary.alert && (
            <div style={{ marginTop: 8, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 8, padding: '6px 10px', fontSize: '0.75rem', color: '#fbbf24' }}>
              ⚠️ {activeDay.weatherSummary.alert}
            </div>
          )}
        </div>

        {/* Accommodation */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#10b981' }}>
            <Hotel size={18} />
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Night Stay & Haven</h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{activeDay.accommodation.rating} ★</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{activeDay.accommodation.name}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', marginTop: 2 }}>
            🌲 {activeDay.accommodation.natureHighlight}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {activeDay.accommodation.address} • ₹{activeDay.accommodation.costPerNightInr.toLocaleString()}/night
          </div>
        </div>

        {/* Transit & Routing */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#818cf8' }}>
            <Train size={18} />
            <h3 style={{ fontSize: '0.95rem', margin: 0 }}>Transit & Movement</h3>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{activeDay.transitSummary.mode}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {activeDay.transitSummary.routeDescription}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            ~{activeDay.transitSummary.durationHours} hrs duration • ~{activeDay.transitSummary.distanceKm} km
          </div>
        </div>
      </div>

      {/* Day's Activities & Experiences */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={18} color="#06b6d4" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                {activeDay.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Pacing note: {activeDay.paceNotes}
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activeDay.activities.map((act) => (
            <div
              key={act.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 14,
                padding: '16px 20px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                    <Clock size={12} /> {act.timeRange}
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                    {act.category.toUpperCase()}
                  </span>
                  {act.weatherSuitability === 'indoor-preferred' && (
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      Rain Shield / Indoor
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: act.costInr === 0 ? '#34d399' : 'var(--text-primary)', fontWeight: 600 }}>
                  {act.costInr === 0 ? 'Free Entry' : `₹${act.costInr.toLocaleString()} for two`}
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0', color: 'var(--text-primary)' }}>
                {act.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0', lineHeight: 1.5 }}>
                {act.description}
              </p>

              {/* Tags & Official Citation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: 10, marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <MapPin size={13} color="#06b6d4" />
                  <span>GPS: {act.coordinates.lat.toFixed(4)}, {act.coordinates.lng.toFixed(4)} • {act.durationHours}h slot</span>
                </div>
                <div style={{ color: '#38bdf8', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={13} />
                  <span>Grounded Citation: {act.sourceAttribution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culinary & Food Highlights Spotlight */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={18} color="#f59e0b" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
              Curated Culinary Trail & Mountain Eateries
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Authentic regional flavors grounded in local gastronomy records
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {activeDay.culinaryHighlights.map((meal, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '14px 16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>{meal.meal}</span>
                {meal.isVegFriendly && (
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Veg Friendly</span>
                )}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {meal.restaurantName}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#fbbf24', marginTop: 4 }}>
                🍴 {meal.specialtyDish}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>~₹{meal.costForTwoInr} for two</span>
                <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>{meal.sourceCitation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
