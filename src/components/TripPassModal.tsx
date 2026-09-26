import React from 'react';
import { Itinerary } from '../types/travel';
import { jsPDF } from 'jspdf';
import { X, Download, Printer, Shield, Compass, PhoneCall, CheckSquare } from 'lucide-react';

interface TripPassModalProps {
  itinerary: Itinerary;
  isOpen: boolean;
  onClose: () => void;
}

export const TripPassModal: React.FC<TripPassModalProps> = ({ itinerary, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // PDF styling & Header
    doc.setFillColor(7, 9, 14);
    doc.rect(0, 0, pageWidth, 297, 'F');

    doc.setTextColor(6, 182, 212);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('WANDERWISE AI TRAVEL PASS', 15, 22);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Official Grounded Trip Briefing | DebugDynasty (450M Edition)`, 15, 29);

    // Divider
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.2);
    doc.line(15, 33, pageWidth - 15, 33);

    // Trip Metadata
    doc.setTextColor(248, 250, 252);
    doc.setFontSize(12);
    doc.text(`Trip Title: ${itinerary.tripTitle}`, 15, 42);

    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225);
    doc.text(`Route: ${itinerary.origin} -> ${itinerary.destination}`, 15, 50);
    doc.text(`Duration: ${itinerary.durationDays} Days | Group Size: ${itinerary.travelers} Travelers`, 15, 56);
    doc.text(`Total Budget: INR ${itinerary.budget.allocatedInr.toLocaleString()} (Cap: INR ${itinerary.budget.totalBudgetInr.toLocaleString()})`, 15, 62);
    doc.text(`Pacing: ${itinerary.pace.toUpperCase()} | Themes: ${itinerary.themes.join(', ')}`, 15, 68);

    // Day by Day summary
    let y = 78;
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text('DAY-BY-DAY ITINERARY SCHEDULE', 15, y);
    y += 8;

    itinerary.days.forEach((day) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setTextColor(56, 189, 248);
      doc.text(`Day ${day.dayNumber}: ${day.title} (${day.weatherSummary.condition}, ${day.weatherSummary.tempC}C)`, 15, y);
      y += 5;

      doc.setTextColor(203, 213, 225);
      doc.setFontSize(9);
      doc.text(`  Transit: ${day.transitSummary.mode} (~${day.transitSummary.durationHours}h)`, 15, y);
      y += 5;
      doc.text(`  Stay: ${day.accommodation.name} (${day.accommodation.rating}*)`, 15, y);
      y += 5;

      day.activities.forEach((act) => {
        doc.text(`  - [${act.timeRange}] ${act.title}`, 15, y);
        y += 5;
      });
      y += 3;
    });

    // Emergency Helpline
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(244, 63, 94);
    doc.text('EMERGENCY CONTACTS & HELPLINES:', 15, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(248, 250, 252);
    itinerary.emergencyContacts.forEach((c) => {
      doc.text(`  ${c.service}: ${c.number}`, 15, y);
      y += 5;
    });

    doc.save(`WanderWise-TripPass-${itinerary.destination.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrint = () => {
    window.print();
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
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px 32px',
          background: 'rgba(13, 18, 29, 0.95)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Compass size={22} color="#06b6d4" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Official Trip Pass & Travel Briefing
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-secondary" onClick={handlePrint} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Printer size={15} /> Print
            </button>
            <button className="btn-primary" onClick={handleDownloadPDF} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              <Download size={15} /> Download PDF
            </button>
            <button className="btn-secondary" onClick={onClose} style={{ padding: '6px 10px' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Boarding Pass Visual Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px dashed rgba(6, 182, 212, 0.4)',
            borderRadius: 16,
            padding: '24px 28px',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: 6 }}>PASSENGER TICKET & ITINERARY</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '4px 0' }}>{itinerary.tripTitle}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
                Origin: <strong>{itinerary.origin}</strong> ➔ Destination: <strong>{itinerary.destination}</strong>
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                ₹{itinerary.budget.allocatedInr.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {itinerary.travelers} Travelers • {itinerary.durationDays} Days
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 14 }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PASSENGER COUNT</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{itinerary.travelers} Adults</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TRIP PACE</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'capitalize' }}>{itinerary.pace}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>REVISION</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>v{itinerary.version} Active</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STATUS</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>Verified & Ready</div>
            </div>
          </div>
        </div>

        {/* Packing Checklist */}
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckSquare size={16} color="#06b6d4" /> Curated Packing Recommendations
          </h4>
          <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {itinerary.packingList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Emergency Contacts */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#fb7185' }}>
            <PhoneCall size={16} /> 24/7 Regional Emergency Helplines
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            {itinerary.emergencyContacts.map((contact, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                }}
              >
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{contact.service}</div>
                <div style={{ fontWeight: 700, color: '#f8fafc', marginTop: 2 }}>{contact.number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
