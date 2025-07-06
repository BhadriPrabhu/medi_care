import React, { useState, useEffect } from 'react';

const AyurvedaTipsModal = ({ onClose, records }) => {
  const [ayurvedaQuery, setAyurvedaQuery] = useState('');
  const [tips, setTips] = useState('');

  useEffect(() => {
    if (!records || records.length === 0) {
      setTips('No health records available to provide Ayurveda tips.');
    } else {
      const latestRecord = records[records.length - 1];
      const bpValue = latestRecord.bp ? parseFloat(latestRecord.bp.split('/')[0]) : 0;
      const sugarValue = parseFloat(latestRecord.sugar) || 0;
      let newTips = 'Ayurveda Tips: ';
      if (bpValue > 140) {
        newTips += 'For high BP, try Triphala or Arjuna bark tea. Consult an Ayurvedic practitioner.';
      } else if (sugarValue > 200) {
        newTips += 'For high sugar, consider Bitter Melon juice or Turmeric with water. Seek expert advice.';
      } else {
        newTips += 'Maintain balance with a diet of warm foods, ghee, and daily yoga. Stay hydrated!';
      }
      setTips(newTips);
    }
  }, [records]);

  const handleGetTips = () => {
    if (ayurvedaQuery) {
      const updatedTips = `${tips}\nSpecific advice for "${ayurvedaQuery}": Consult an Ayurvedic expert for tailored remedies.`;
      setTips(updatedTips);
      setAyurvedaQuery('');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '50', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px', width: '90%', maxHeight: '70vh', overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2e7d32', textAlign: 'center', marginBottom: '16px' }}>
          Ayurveda Health Tips
        </h2>
        <div style={{ marginBottom: '16px', padding: '8px', background: '#f0fff4', borderRadius: '4px' }}>
          <p style={{ fontSize: '14px', color: '#1a3c34', margin: '0' }}>{tips}</p>
        </div>
        <input
          type="text"
          placeholder="Ask e.g., digestion issues"
          value={ayurvedaQuery}
          onChange={(e) => setAyurvedaQuery(e.target.value)}
          style={{
            width: '100%', padding: '8px', borderRadius: '4px', border: '2px solid #2e7d32',
            marginBottom: '8px', fontSize: '14px', outline: 'none'
          }}
        />
        <button
          onClick={handleGetTips}
          style={{
            background: '#2e7d32', color: '#ffffff', padding: '8px 16px', borderRadius: '4px',
            border: 'none', cursor: 'pointer', fontWeight: '500', width: '100%', marginBottom: '16px'
          }}
        >
          Add Specific Query
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{
              background: '#d32f2f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontWeight: '500'
            }}
            onMouseOver={(e) => { e.target.style.background = '#b71c1c'; e.target.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.target.style.background = '#d32f2f'; e.target.style.transform = 'translateY(0)'; }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AyurvedaTipsModal;