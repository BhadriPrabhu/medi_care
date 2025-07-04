import React, { useState } from 'react';

const SleepTrackerModal = ({ onSave, onClose, selectedLanguage }) => {
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');

  const calculateSleepDuration = () => {
    if (bedTime && wakeTime) {
      const bed = new Date(`2023-01-01 ${bedTime}`);
      const wake = new Date(`2023-01-01 ${wakeTime}`);
      if (wake < bed) wake.setDate(wake.getDate() + 1);
      const diffMs = wake - bed;
      return (diffMs / (1000 * 60 * 60)).toFixed(1);
    }
    return 0;
  };

  const handleSave = () => {
    const duration = calculateSleepDuration();
    if (duration > 0) {
      onSave({ duration, bedTime, wakeTime });
      onClose();
    }
  };

  const translations = {
    en: { title: 'Sleep Tracker', bed: 'Bed Time', wake: 'Wake Time', save: 'Save' },
    ta: { title: 'தூக்க பதிவி', bed: 'படுக்கை நேரம்', wake: 'எழுந்திருக்கும் நேரம்', save: 'சேமி' },
    hi: { title: 'नींद ट्रैकर', bed: 'सोने का समय', wake: 'जागने का समय', save: 'सहेजें' },
  };

  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '60' }}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3c34', textAlign: 'center', marginBottom: '20px' }}>{translations[selectedLanguage].title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="time" value={bedTime} onChange={(e) => setBedTime(e.target.value)} style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} placeholder={translations[selectedLanguage].bed} />
          <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} placeholder={translations[selectedLanguage].wake} />
          <p style={{ fontSize: '14px', color: '#1a3c34' }}>Duration: {calculateSleepDuration()} hours</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={handleSave} style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{translations[selectedLanguage].save}</button>
          <button onClick={onClose} style={{ background: '#d32f2f', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SleepTrackerModal;