import React, { useState } from 'react';

const AddRecordScreen = ({ onSave, onClose, selectedLanguage, setSelectedLanguage }) => {
  const [form, setForm] = useState({
    name: '', bp: '', sugar: '', height: '', weight: '', cause: '', symptoms: '', tablet: ''
  });
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(field => !field)) return alert(translations.alerts.allFieldsRequired[selectedLanguage]);
    if (!/^\d+\/\d+$/.test(form.bp)) return alert(translations.alerts.invalidBP[selectedLanguage]);
    ['sugar', 'height', 'weight'].forEach(field => {
      if (isNaN(form[field]) || form[field] <= 0) return alert(translations.alerts.invalidValue[selectedLanguage].replace('{field}', field));
    });
    onSave(form);
    onClose();
  };

  const translations = {
    titles: {
      en: 'Add Record',
      ta: 'பதிவு சேர்க்கவும்',
      hi: 'रिकॉर्ड जोड़ें',
      te: 'రికార్డ్ జోడించండి',
      kn: 'ರೆಕಾರ್ಡ್ ಸೇರಿಸಿ',
    },
    placeholders: {
      name: { en: 'Name', ta: 'பெயர்', hi: 'नाम', te: 'పేరు', kn: 'ಹೆಸರು' },
      bp: { en: 'BP (e.g., 120/80)', ta: 'BP (எ.கா., 120/80)', hi: 'BP (उदाहरण, 120/80)', te: 'BP (ఉదా., 120/80)', kn: 'BP (ಉದಾ., 120/80)' },
      sugar: { en: 'Sugar', ta: 'சர்க்கரை', hi: 'शुगर', te: 'సహజం', kn: 'ಸಕ್ಕರೆ' },
      height: { en: 'Height', ta: 'உயரம்', hi: 'ऊंचाई', te: 'ఎత్తు', kn: 'ಎತ್ತರ' },
      weight: { en: 'Weight', ta: 'எடை', hi: 'वजन', te: 'బరువు', kn: 'ತೂಕ' },
      cause: { en: 'Cause', ta: 'காரணம்', hi: 'कारण', te: 'కారణం', kn: 'ಕಾರಣ' },
      symptoms: { en: 'Symptoms', ta: 'அறிகுறிகள்', hi: 'लक्षण', te: 'అరిగిణంగలు', kn: 'ಲಕ್ಷಣಗಳು' },
      tablet: { en: 'Tablet', ta: 'மாத்திரை', hi: 'टैबलेट', te: 'టాబ్లెట్', kn: 'ಟ್ಯಾಬ್ಲೆಟ್' },
    },
    buttons: {
      cancel: { en: 'Cancel', ta: 'ரத்து செய்', hi: 'रद्द करें', te: 'రద్దు చేయండి', kn: 'ರದ್ದು ಮಾಡಿ' },
      save: { en: 'Save', ta: 'சேமி', hi: 'सहेजें', te: 'సేవ్ చేయండి', kn: 'ಉಳಿಸಿ' },
    },
    alerts: {
      allFieldsRequired: { en: 'All fields are required', ta: 'அனைத்து புலங்களும் தேவை', hi: 'सभी फ़ील्ड आवश्यक हैं', te: 'అన్ని ఫీల్డ్‌లు అవసరం', kn: 'ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳು ಅಗತ್ಯವಿದೆ' },
      invalidBP: { en: 'Enter valid BP (e.g., 120/80)', ta: 'சரியான BP உள்ளிடவும் (எ.கா., 120/80)', hi: 'मान्य BP दर्ज करें (उदाहरण, 120/80)', te: 'చెల్లున్న BPని నమోదు చేయండి (ఉదా., 120/80)', kn: 'ಸರಿಯಾದ BP ದಾಖಲಿಸಿ (ಉದಾ., 120/80)' },
      invalidValue: { en: 'Enter valid {field}', ta: 'சரியான {field} உள்ளிடவும்', hi: 'मान्य {field} दर्ज करें', te: 'చెల్లున్న {field} నమోదు చేయండి', kn: 'ಸರಿಯಾದ {field} ದಾಖಲಿಸಿ' },
    },
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
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3c34', margin: '0' }}>{translations.titles[selectedLanguage]}</h2>
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
                    onClick={() => { setSelectedLanguage(lang); setShowLanguageDropdown(false); }}
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
          {['name', 'bp', 'sugar', 'height', 'weight', 'cause', 'symptoms', 'tablet'].map((field) => (
            <div
              key={field}
              style={{
                display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '8px',
                marginBottom: '12px', transition: 'box-shadow 0.2s'
              }}
              onMouseOver={(e) => e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.target.style.boxShadow = 'none'}
            >
              <input
                type={
                  field === 'name' ? 'text' :
                  field === 'bp' ? 'tel' :
                  field === 'sugar' || field === 'height' || field === 'weight' ? 'number' :
                  'text'
                }
                placeholder={translations.placeholders[field][selectedLanguage] + (field === 'bp' ? ' (e.g., 120/80)' : '')}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={{
                  flex: '1', padding: '8px', border: '1px solid #26a69a', background: 'transparent', color: '#003c30',
                  fontSize: '14px', borderRadius: '4px', outline: 'none'
                }}
                pattern={field === 'bp' ? '\\d+\\/\\d+' : undefined}
                min={field === 'sugar' || field === 'height' || field === 'weight' ? '0' : undefined}
                step={field === 'sugar' || field === 'height' || field === 'weight' ? '0.1' : undefined}
                required
              />
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
            {translations.buttons.cancel[selectedLanguage]}
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#26a69a', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s', fontSize: '14px'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e7c69'}
            onMouseOut={(e) => e.target.style.background = '#26a69a'}
          >
            {translations.buttons.save[selectedLanguage]}
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

export default AddRecordScreen;