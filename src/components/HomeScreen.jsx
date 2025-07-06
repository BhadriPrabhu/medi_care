import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const HomeScreen = ({
  records,
  setRecords,
  selectedLanguage,
  setSelectedLanguage,
  setShowAddRecord,
  setShowSymptomChecker,
  setShowDashboard,
  setShowAISymptomChecker,
  setShowReminderModal,
  synth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const initializeTTS = () => {
    synth.cancel();
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      selectedLanguage === 'ta'
        ? 'ta-IN'
        : selectedLanguage === 'hi'
        ? 'hi-IN'
        : selectedLanguage === 'te'
        ? 'te-IN'
        : selectedLanguage === 'kn'
        ? 'kn-IN'
        : 'en-US';
    utterance.rate = 0.5;
    synth.speak(utterance);
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const bmi = calculateBMI(data.weight, data.height);
    doc.setFontSize(8);
    const pdfContent = {
      en: `Health Record\nName: ${data.name}\nDate: ${data.date} (Generated: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nSugar: ${data.sugar || 'N/A'} mg/dL\nHeight: ${data.height || 'N/A'} cm\nWeight: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nCause: ${data.cause || 'N/A'}\nSymptoms: ${
        data.symptoms || 'N/A'
      }\nTablet: ${data.tablet || 'N/A'}`,
      ta: `உடல் நல பதிவு\nபெயர்: ${data.name}\nதேதி: ${data.date} (உருவாக்கப்பட்டது: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nசர்க்கரை: ${data.sugar || 'N/A'} mg/dL\nஉயரம்: ${data.height || 'N/A'} cm\nஎடை: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nகாரணம்: ${data.cause || 'N/A'}\nஅறிகுறிகள்: ${
        data.symptoms || 'N/A'
      }\nமாத்திரை: ${data.tablet || 'N/A'}`,
      hi: `स्वास्थ्य रिकॉर्ड\nनाम: ${data.name}\nदिनांक: ${data.date} (जनरेटेड: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nशुगर: ${data.sugar || 'N/A'} mg/dL\nऊंचाई: ${data.height || 'N/A'} cm\nवजन: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nकारण: ${data.cause || 'N/A'}\nलक्षण: ${
        data.symptoms || 'N/A'
      }\nटैबलेट: ${data.tablet || 'N/A'}`,
      te: `ఆరోగ్య రికార్డు\nపేరు: ${data.name}\nతేదీ: ${data.date} (జనరేట్ చేయబడింది: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nసహజం: ${data.sugar || 'N/A'} mg/dL\nఎత్తు: ${data.height || 'N/A'} cm\nబరువు: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nకారణం: ${data.cause || 'N/A'}\nఅరిగిణంగలు: ${
        data.symptoms || 'N/A'
      }\nటాబ్లెట్: ${data.tablet || 'N/A'}`,
      kn: `ಆರೋಗ್ಯ ದಾಖಲೆ\nಹೆಸರು: ${data.name}\nದಿನಾಂಕ: ${data.date} (ತಯಾರಿಸಲಾದ: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nಸಕ್ಕರೆ: ${data.sugar || 'N/A'} mg/dL\nಎತ್ತರ: ${data.height || 'N/A'} cm\n ತೂಕ: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nಕಾರಣ: ${data.cause || 'N/A'}\nಲಕ್ಷಣಗಳು: ${
        data.symptoms || 'N/A'
      }\nಟ್ಯಾಬ್ಲೆಟ್: ${data.tablet || 'N/A'}`,
    };
    doc.text(pdfContent[selectedLanguage], 10, 10);
    doc.save(`health_record_${data.name}_${Date.now()}.pdf`);
    alert(translations.alerts.pdfSaved[selectedLanguage].replace('{name}', data.name));
  };

  const generateAllRecordsPDF = () => {
    if (!records || records.length === 0) {
      alert(translations.alerts.noRecords[selectedLanguage]);
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(8);
    let yOffset = 10;
    records.forEach((record, index) => {
      const bmi = calculateBMI(record.weight, record.height);
      const content = {
        en: `Record ${index + 1}\nName: ${record.name}\nDate: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nSugar: ${record.sugar || 'N/A'} mg/dL\nHeight: ${record.height || 'N/A'} cm\nWeight: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nCause: ${record.cause || 'N/A'}\nSymptoms: ${
          record.symptoms || 'N/A'
        }\nTablet: ${record.tablet || 'N/A'}\n\n`,
        ta: `பதிவு ${index + 1}\nபெயர்: ${record.name}\nதேதி: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nசர்க்கரை: ${record.sugar || 'N/A'} mg/dL\nஉயரம்: ${record.height || 'N/A'} cm\nஎடை: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nகாரணம்: ${record.cause || 'N/A'}\nஅறிகுறிகள்: ${
          record.symptoms || 'N/A'
        }\nமாத்திரை: ${record.tablet || 'N/A'}\n\n`,
        hi: `रिकॉर्ड ${index + 1}\nनाम: ${record.name}\nदिनांक: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nशुगर: ${record.sugar || 'N/A'} mg/dL\nऊंचाई: ${record.height || 'N/A'} cm\nवजन: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nकारण: ${record.cause || 'N/A'}\nलक्षण: ${
          record.symptoms || 'N/A'
        }\nटैबलेट: ${record.tablet || 'N/A'}\n\n`,
        te: `రికార్డ్ ${index + 1}\nపేరు: ${record.name}\nతేదీ: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nసహజం: ${record.sugar || 'N/A'} mg/dL\nఎత్తు: ${record.height || 'N/A'} cm\nబరువు: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nకారణం: ${record.cause || 'N/A'}\nఅరిగిణంగలు: ${
          record.symptoms || 'N/A'
        }\nటాబ్లెట్: ${record.tablet || 'N/A'}\n\n`,
        kn: `ರೆಕಾರ್ಡ್ ${index + 1}\nಹೆಸರು: ${record.name}\nದಿನಾಂಕ: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nಸಕ್ಕರೆ: ${record.sugar || 'N/A'} mg/dL\nಎತ್ತರ: ${record.height || 'N/A'} cm\nತೂಕ: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nಕಾರಣ: ${record.cause || 'N/A'}\nಲಕ್ಷಣಗಳು: ${
          record.symptoms || 'N/A'
        }\nಟ್ಯಾಬ್ಲೆಟ್: ${record.tablet || 'N/A'}\n\n`,
      };
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
      doc.text(content[selectedLanguage], 10, yOffset);
      yOffset += 40;
    });
    doc.save(`all_health_records_${Date.now()}.pdf`);
    alert(translations.alerts.allRecordsSaved[selectedLanguage]);
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height || height <= 0) return NaN;
    return weight / ((height / 100) ** 2);
  };

  const filteredRecords = searchQuery
    ? records.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : records;

  const suggestHealthAdvice = () => {
    if (filteredRecords.length > 0) {
      const latestRecord = filteredRecords[filteredRecords.length - 1];
      const bpValue = latestRecord.bp ? parseFloat(latestRecord.bp.split('/')[0]) : 0;
      const sugarValue = parseFloat(latestRecord.sugar) || 0;
      if (bpValue > 140 || sugarValue > 200) {
        return translations.advice.highLevels[selectedLanguage];
      }
      return translations.advice.healthyTip[selectedLanguage];
    }
    return translations.advice.noData[selectedLanguage];
  };

  const deleteRecord = (index) => {
    if (window.confirm(translations.alerts.confirmDelete[selectedLanguage])) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
      alert(translations.alerts.recordDeleted[selectedLanguage]);
    }
  };

  const translations = {
    en: 'Health AI',
    ta: 'உடல் நல AI',
    hi: 'स्वास्थ्य AI',
    te: 'ఆరోగ్య AI',
    kn: 'ಆರೋಗ್ಯ AI',
    placeholders: {
      en: 'Search by name...',
      ta: 'பெயரால் தேடு...',
      hi: 'नाम से खोजें...',
      te: 'పేరు ద్వారా శోధించండి...',
      kn: 'ಹೆಸರಿನಿಂದ ಹುಡುಕಿ...',
    },
    alerts: {
      pdfSaved: {
        en: 'PDF saved as health_record_{name}_{Date.now()}.pdf',
        ta: 'PDF {name}_{Date.now()}.pdf ஆக சேமிக்கப்பட்டது',
        hi: 'PDF {name}_{Date.now()}.pdf के रूप में सहेजा गया',
        te: 'PDF {name}_{Date.now()}.pdf గా సేవ్ చేయబడింది',
        kn: 'PDF {name}_{Date.now()}.pdf ಆಗಿ ಉಳಿಸಲಾಗಿದೆ',
      },
      noRecords: {
        en: 'No records to download.',
        ta: 'பதிவுகள் இல்லை.',
        hi: 'डाउनलोड करने के लिए कोई रिकॉर्ड नहीं।',
        te: 'డౌన్‌లోడ్ చేయడానికి రికార్డులు లేవు.',
        kn: 'ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ.',
      },
      allRecordsSaved: {
        en: 'All records saved as all_health_records_{Date.now()}.pdf',
        ta: 'அனைத்து பதிவுகளும் all_health_records_{Date.now()}.pdf ஆக சேமிக்கப்பட்டது',
        hi: 'सभी रिकॉर्ड्स all_health_records_{Date.now()}.pdf के रूप में सहेजे गए',
        te: 'అన్ని రికార్డ్‌లు all_health_records_{Date.now()}.pdf గా సేవ్ చేయబడ్డాయి',
        kn: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳು all_health_records_{Date.now()}.pdf ಆಗಿ ಉಳಿಸಲಾಗಿದೆ',
      },
      confirmDelete: {
        en: 'Are you sure you want to delete this record?',
        ta: 'இந்த பதிவை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
        hi: 'क्या आप इस रिकॉर्ड को हटाना चाहते हैं?',
        te: 'ఈ రికార్డ్‌ను తొలగించాలనుకుంటున్నారా?',
        kn: 'ಈ ದಾಖಲೆಯನ್ನು ತೆಗೆದುಹಾಕಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುತ್ತೀರಾ?',
      },
      recordDeleted: {
        en: 'Record deleted successfully.',
        ta: 'பதிவு வெற்றிகரமாக நீக்கப்பட்டது.',
        hi: 'रिकॉर्ड सफलतापूर्वक हटाया गया।',
        te: 'రికార్డ్ విజయవంతంగా తొలగించబడింది.',
        kn: 'ದಾಖಲೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಯಿತು.',
      },
    },
    advice: {
      highLevels: {
        en: 'Alert: High BP or sugar levels detected. Consult a doctor.',
        ta: 'எச்சரிக்கை: உயர் BP அல்லது சர்க்கரை அளவு கண்டறியப்பட்டது. மருத்துவரை அணுகவும்.',
        hi: 'चेतावनी: उच्च BP या शुगर का स्तर पाया गया। डॉक्टर से परामर्श करें।',
        te: 'హెచ్చరిక: ఎక్కువ BP లేదా సహజ స్థాయిలు గుర్తించబడ్డాయి. డాక్టర్‌ను సంప్రదించండి.',
        kn: 'ಎಚ್ಚರಿಕೆ: ಉच्च BP ಅಥವಾ ಸಕ್ಕರೆ ಮಟ್ಟ ಗುರುತಿಸಲಾಗಿದೆ. ಡಾಕ್ಟರ್ ಅವರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      },
      healthyTip: {
        en: 'Tip: Maintain a balanced diet and regular exercise.',
        ta: 'உதவி: சமநிலையான உணவு மற்றும் தவறாத பயிற்சியை பின்பற்றவும்.',
        hi: 'सुझाव: संतुलित आहार और नियमित व्यायाम बनाए रखें।',
        te: 'సలహా: సమతుల్య ఆహారం మరియు नियमित వ్యాయామాన్ని పాటించండి.',
        kn: 'ಸಲಹೆ: ಸಮತೋಲಿತ ಆಹಾರ ಮತ್ತು ಘಟಿಕ ವ್ಯಾಯಾಮವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.',
      },
      noData: {
        en: 'No data to analyze. Stay healthy!',
        ta: 'பகுப்பாய்வு செய்ய வேண்டிய தரவு இல்லை. ஆரோக்கியமாக இருங்கள்!',
        hi: 'विश्लेषण के लिए कोई डेटा नहीं। स्वस्थ रहें!',
        te: 'విశ్లేషణ చేయడానికి డేటా లేదు. ఆరోగ్యంగా ఉండండి!',
        kn: 'ವಿಶ್ಲೇಷಣೆಗೆ ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ. ಆರೋಗ್ಯವಾಗಿ ಇರಿ!',
      },
    },
  };

  return (
    <div
      style={{
        fontFamily: 'Segoe UI, sans-serif',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          background: 'rgba(38, 166, 154, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#fff',
            margin: '0 40px',
          }}
        >
          {translations[selectedLanguage]}
        </h1>
        <div style={{ position: 'relative', marginRight: '40px' }}>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{
              padding: '10px 18px',
              background: '#26a69a',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{selectedLanguage.toUpperCase()}</span>
            <span className="material-icons" style={{ fontSize: '20px' }}>arrow_drop_down</span>
          </button>
          {showLanguageDropdown && (
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                listStyle: 'none',
                padding: '0',
                margin: '4px 0 0 0',
                minWidth: '120px',
                zIndex: 10,
              }}
            >
              {['en', 'ta', 'hi', 'te', 'kn'].map((lang) => (
                <li
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    initializeTTS();
                    setShowLanguageDropdown(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    color: '#004d40',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.background = '#f0f0f0')}
                  onMouseOut={(e) => (e.target.style.background = 'transparent')}
                >
                  {lang.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder={translations.placeholders[selectedLanguage]}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '300px',
            padding: '12px 16px',
            borderRadius: '24px',
            background: '#ffffff',
            border: '2px solid #26a69a',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
        <div style={{ marginTop: '16px', color: '#00695c', fontStyle: 'italic', fontSize: '14px' }}>{suggestHealthAdvice()}</div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        {filteredRecords.length > 0 && (
          <button
            onClick={generateAllRecordsPDF}
            style={{
              background: '#26a69a',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            {translations[selectedLanguage]}
          </button>
        )}
        {filteredRecords.length === 0 && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '18px',
              color: '#004d40',
              fontWeight: '600',
              margin: '20px 0',
            }}
          >
            {translations.alerts.noRecords[selectedLanguage]}
          </p>
        )}
        {filteredRecords.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0f2f1',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '28px', color: '#26a69a' }} className="material-icons">local_hospital</span>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#004d40', margin: '0 0 4px 0' }}>{`${record.name} - ${record.date}`}</p>
                    <p style={{ fontSize: '12px', color: '#00695c', margin: '0' }}>
                      BP: ${record.bp || 'N/A'} | Sugar: ${record.sugar || 'N/A'} | Tablet: ${record.tablet || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => generatePDF(record)}
                    style={{
                      marginLeft: 'auto',
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#26a69a',
                    }}
                  >
                    <span className="material-icons">download</span>
                  </button>
                  <button
                    onClick={() => deleteRecord(index)}
                    style={{
                      fontSize: '24px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#d32f2f',
                      marginLeft: '12px',
                    }}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 20px' }}>
        <button
          onClick={() => setShowReminderModal(true)}
          style={{
            padding: '12px 24px',
            background: '#26a69a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => e.target.style.background = '#1e7c69'}
          onMouseOut={(e) => e.target.style.background = '#26a69a'}
        >
          {selectedLanguage === 'ta' ? 'ஆரோக்கிய நினைவூட்டலை அமை' :
            selectedLanguage === 'hi' ? 'स्वास्थ्य रिमाइंडर सेट करें' :
            selectedLanguage === 'te' ? 'ఆరోగ్య గుర్తుచేయు సెట్ చేయండి' :
            selectedLanguage === 'kn' ? 'ಆರోಗ్య ರಿಮೈಂಡರ್ ಸೆಟ్ ಮಾಡಿ' : 'Set Health Reminder'}
        </button>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {[
          { icon: 'add', onClick: () => setShowAddRecord(true) },
          { icon: 'healing', onClick: () => setShowSymptomChecker(true) },
          { icon: 'bar_chart', onClick: () => setShowDashboard(true) },
          { icon: 'smart_toy', onClick: () => setShowAISymptomChecker(true) },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            style={{
              background: '#26a69a',
              color: '#fff',
              padding: '16px',
              borderRadius: '50%',
              fontSize: '24px',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-icons">{btn.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;