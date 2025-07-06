import React, { useState } from 'react';

const SymptomCheckerScreen = ({ onClose, selectedLanguage, setSelectedLanguage }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const synth = window.speechSynthesis;

  const symptoms = {
    en: ['Fever', 'Cough', 'Chest Pain', 'Fatigue', 'Vomiting', 'Constipation', 'Dizziness', 'Headache', 'Stress', 'Breathing Difficulty', 'Skin Rash', 'Sore Throat', 'Nausea', 'Diarrhea', 'Joint Pain', 'Muscle Aches', 'Vision Issues', 'Hearing Loss'],
    ta: ['காய்ச்சல்', 'இருமல்', 'மார்பில் வலி', 'சோர்வு', 'உலர்ந்தல்', 'மலச்சிக்கல்', 'மயக்கம்', 'தலைவலி', 'மன அழுத்தம்', 'சுவாச கஷ்டம்', 'தோல் தோற்றம்', 'தொண்டை வலி', 'உடல் சோர்வு', 'புண்', 'இணை வலி', 'தசை வலி', 'கண் பிரச்சனை', 'காது இழப்பு'],
    hi: ['बुखार', 'खांसी', 'सीने में दर्द', 'थकान', 'उल्टी', 'कब्ज', 'चक्कर आना', 'सिरदर्द', 'तनाव', 'सांस लेने में कठिनाई', 'त्वचा पर चकत्ते', 'गले में खराश', 'मिचली', 'दस्त', 'जोड़ों का दर्द', 'मांसपेशियों में दर्द', 'दृष्टि समस्याएं', 'सुनने की हानि'],
    te: ['జ్వరం', 'కఫం', 'ఛాతీ నొప్పి', 'ఆలస్యం', 'వాంతులు', 'కడుపు జబ్బు', 'చక్కర్లు', 'తలనొప్పి', 'మానసిక ఒత్తిడి', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'త్వక్ రాష్', 'గొంతు నొప్పి', 'మళ్ళింపు', 'చికాకు', 'జాడ్యం నొప్పి', 'మాంసపుష్ఠి నొప్పి', 'దృష్టి సమస్యలు', 'కర్ణ నష్టం'],
    kn: ['ಜ್ವರ', 'ಕೆಮ್ಮು', 'ಛಾತಿ ನೋವು', 'ಕಾಯಿಲೆ', 'ವಾಂತಿ', 'ವಾಯುವಣakk', 'ಹಿಮ್ಮತ್ತಿಕೆ', 'ತಲೆನೋವು', 'ತೀವ್ರತೆ', 'ಉಸಿರಾಟದ ತೊಂದರೆ', 'ಚರ್ಮ ಗುಳ್ಳೆ', 'ಗಂಟಲು ನೋವು', 'ಕೀಲು ನೋವು', 'ಹೊಟ್ಟೆ ಉಪ್ಪು', 'ಸಂಧಿ ನೋವು', 'ಮಾಂಸಪೇಶಿ ನೋವು', 'ಕಣ್ಣಿನ ಸಮಸ್ಯೆಗಳು', 'ಕಿವಿಯ ಕೇಳದಿರುವಿಕೆ'],
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
    utterance.lang = selectedLanguage === 'ta' ? 'ta-IN' : selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : selectedLanguage === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 0.5;
    synth.speak(utterance);
  };

  const handleLanguageSelect = (lang) => {
    if (typeof setSelectedLanguage === 'function') {
      setSelectedLanguage(lang);
      setShowLanguageDropdown(false);
    } else {
      console.error('setSelectedLanguage is not a function. Please ensure it is passed as a prop.');
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3c34', margin: '0' }}>Symptom Checker</h2>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              style={{
                padding: '8px 16px', background: '#26a69a', color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
              }}
            >
              <span>{selectedLanguage.toUpperCase()}</span>
              <span className="material-icons" style={{ fontSize: '18px' }}>arrow_drop_down</span>
            </button>
            {showLanguageDropdown && (
              <ul
                style={{
                  position: 'absolute', top: '100%', right: '0', background: '#fff', borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', listStyle: 'none', padding: '4px 0', margin: '4px 0 0 0',
                  minWidth: '100px', zIndex: 10
                }}
              >
                {['en', 'ta', 'hi', 'te', 'kn'].map((lang) => (
                  <li
                    key={lang}
                    onClick={() => handleLanguageSelect(lang)}
                    style={{ padding: '6px 12px', color: '#004d40', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => (e.target.style.background = '#f0f0f0')}
                    onMouseOut={(e) => (e.target.style.background = 'transparent')}
                  >
                    {lang.toUpperCase()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
          {symptoms[selectedLanguage].map((symptom) => (
            <div
              key={symptom}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px',
                marginBottom: '12px', transition: 'box-shadow 0.2s'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.target.style.boxShadow = 'none'}
            >
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={(e) => {
                  if (e.target.checked) setSelectedSymptoms([...selectedSymptoms, symptom]);
                  else setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
                }}
                style={{
                  marginRight: '12px', width: '18px', height: '18px', accentColor: '#26a69a', border: '1px solid #26a69a',
                  borderRadius: '4px', cursor: 'pointer', transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#1e7c69'}
                onBlur={(e) => e.target.style.borderColor = '#26a69a'}
              />
              <span style={{ color: '#003c30', fontSize: '14px', fontWeight: '500' }}>{symptom}</span>
            </div>
          ))}
        </div>
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
            onClick={checkSymptoms}
            style={{
              background: '#26a69a', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s', fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e7c69'}
            onMouseOut={(e) => e.target.style.background = '#26a69a'}
          >
            Check
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

export default SymptomCheckerScreen;