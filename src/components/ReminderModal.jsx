import React from 'react';

const ReminderModal = ({ onClose, onSave, selectedLanguage, synth }) => {
  const [reminder, setReminder] = React.useState('');
  const [reminderTime, setReminderTime] = React.useState('');

  const handleSave = () => {
    if (reminder && reminderTime) {
      onSave(reminder, reminderTime);
      onClose();
    } else {
      alert('Please enter both reminder and time');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '50', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        width: '400px', maxWidth: '90%', display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3c34', margin: '0' }}>Set Health Reminder</h2>
        <input
          type="text"
          placeholder={selectedLanguage === 'ta' ? 'எச்சரிக்கை (எ.கா., மருந்து எடுத்துக்கொள்ளவும்)' :
            selectedLanguage === 'hi' ? 'रिमाइंडर (जैसे, दवा लें)' :
            selectedLanguage === 'te' ? 'గుర్తుచేయు (ఉదా., మందు తీసుకోండి)' :
            selectedLanguage === 'kn' ? 'ಯಾದರಿಸಿ (ಉದಾ., ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ)' : 'Reminder (e.g., Take medicine)'}
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          style={{
            padding: '12px', borderRadius: '8px', border: '2px solid #26a69a', fontSize: '14px', outline: 'none'
          }}
        />
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          style={{
            padding: '12px', borderRadius: '8px', border: '2px solid #26a69a', fontSize: '14px', outline: 'none'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            onClick={onClose}
            style={{
              background: '#757575', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s', fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.background = '#616161'}
            onMouseOut={(e) => e.target.style.background = '#757575'}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#26a69a', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s', fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e7c69'}
            onMouseOut={(e) => e.target.style.background = '#26a69a'}
          >
            Save
          </button>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ReminderModal;