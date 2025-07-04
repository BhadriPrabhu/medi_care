import React, { useState } from 'react';

const SymptomCheckerScreen = ({ onClose, selectedLanguage }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const synth = window.speechSynthesis;

  const symptoms = {
    en: ['Fever', 'Cough', 'Chest Pain', 'Fatigue', 'Vomiting', 'Constipation', 'Dizziness', 'Headache', 'Stress', 'Breathing Difficulty', 'Skin Rash', 'Sore Throat', 'Nausea', 'Diarrhea', 'Joint Pain', 'Muscle Aches', 'Vision Issues', 'Hearing Loss'],
    ta: ['காய்ச்சல்', 'இருமல்', 'மார்பில் வலி', 'சோர்வு', 'உலர்ந்தல்', 'மலச்சிக்கல்', 'மயக்கம்', 'தலைவலி', 'மன அழுத்தம்', 'சுவாச கஷ்டம்', 'தோல் தோற்றம்', 'தொண்டை வலி', 'மயக்கம்', 'புண்', 'இணை வலி', 'தசை வலி', 'கண் பிரச்சனை', 'காது இழப்பு'],
    hi: ['बुखार', 'खांसी', 'सीने में दर्द', 'थकान', 'उल्टी', 'कब्ज', 'चक्कर आना', 'सिरदर्द', 'तनाव', 'सांस लेने में कठिनाई', 'त्वचा पर चकत्ते', 'गले में खराश', 'मिचली', 'दस्त', 'जोड़ों का दर्द', 'मांसपेशियों में दर्द', 'दृष्टि समस्याएं', 'सुनने की हानि'],
  };

  const checkSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    let result;
    if (selectedSymptoms.includes(symptoms[selectedLanguage][0]) || selectedSymptoms.includes(symptoms[selectedLanguage][1])) {
      result = 'Analysis: Possible viral infection. Rest and hydrate.';
    } else if (selectedSymptoms.includes(symptoms[selectedLanguage][2])) {
      result = 'Emergency: Go to hospital immediately!';
    } else {
      result = 'Stay safe, monitor your condition.';
    }

    speak(result);
    alert(result);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.5;
    synth.speak(utterance);
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '50', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', border: '1px solid #e0f7fa', maxWidth: '400px', width: '90%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#004d40' }}>Symptom Checker</h2>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              padding: '10px', background: 'rgba(38, 166, 154, 0.8)', color: '#fff', border: '2px solid #26a69a',
              borderRadius: '8px', cursor: 'pointer', transition: 'border-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#1e7c69'}
            onMouseOut={(e) => e.target.style.borderColor = '#26a69a'}
          >
            {['en', 'ta', 'hi'].map((lang) => (
              <option key={lang} value={lang} style={{ background: '#26a69a' }}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div style={{ maxHeight: '240px', overflowY: 'auto', paddingRight: '8px', marginBottom: '24px' }}>
          {symptoms[selectedLanguage].map((symptom) => (
            <div
              key={symptom}
              style={{
                display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(224, 247, 250, 0.8)',
                borderRadius: '8px', marginBottom: '8px', transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(224, 247, 250, 1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(224, 247, 250, 0.8)'}
            >
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedSymptoms([...selectedSymptoms, symptom]);
                  else setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
                }}
                style={{
                  marginRight: '12px', width: '20px', height: '20px', accentColor: '#26a69a', border: '2px solid #26a69a',
                  borderRadius: '4px', cursor: 'pointer'
                }}
              />
              <span style={{ color: '#004d40', fontWeight: '500' }}>{symptom}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button
            onClick={onClose}
            style={{
              background: '#757575', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#616161'}
            onMouseOut={(e) => e.target.style.background = '#757575'}
          >
            Cancel
          </button>
          <button
            onClick={checkSymptoms}
            style={{
              background: '#26a69a', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e7c69'}
            onMouseOut={(e) => e.target.style.background = '#26a69a'}
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerScreen;