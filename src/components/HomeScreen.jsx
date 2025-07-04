import React, { useState } from 'react';
import jsPDF from 'jspdf';
import config from '../../config';

const HomeScreen = ({
  records,
  setRecords,
  selectedLanguage,
  setSelectedLanguage,
  setShowAddRecord,
  setShowSymptomChecker,
  setShowDashboard,
  setShowAISymptomChecker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [reminder, setReminder] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const synth = window.speechSynthesis;

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
        : 'en-US';
    utterance.rate = 0.5;
    synth.speak(utterance);
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const bmi = calculateBMI(data.weight, data.height);
    doc.setFontSize(8);
    doc.text(
      `Health Record\nName: ${data.name}\nDate: ${data.date} (Generated: ${new Date()
        .toISOString()
        .split('T')[0]})\nBP: ${data.bp || 'N/A'} mmHg\nSugar: ${data.sugar || 'N/A'} mg/dL\nHeight: ${data.height || 'N/A'} cm\nWeight: ${data.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nCause: ${data.cause || 'N/A'}\nSymptoms: ${
        data.symptoms || 'N/A'
      }\nTablet: ${data.tablet || 'N/A'}`,
      10,
      10
    );
    doc.save(`health_record_${data.name}_${Date.now()}.pdf`);
    alert(`PDF saved as health_record_${data.name}_${Date.now()}.pdf`);
  };

  const generateAllRecordsPDF = () => {
    if (!records || records.length === 0) {
      alert('No records to download.');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(8);
    let yOffset = 10;
    records.forEach((record, index) => {
      const bmi = calculateBMI(record.weight, record.height);
      const content = `Record ${index + 1}\nName: ${record.name}\nDate: ${record.date}\nBP: ${record.bp || 'N/A'} mmHg\nSugar: ${record.sugar || 'N/A'} mg/dL\nHeight: ${record.height || 'N/A'} cm\nWeight: ${record.weight || 'N/A'} kg\nBMI: ${isNaN(bmi) ? 'N/A' : bmi.toFixed(1)}\nCause: ${record.cause || 'N/A'}\nSymptoms: ${record.symptoms || 'N/A'}\nTablet: ${record.tablet || 'N/A'}\n\n`;
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 10;
      }
      doc.text(content, 10, yOffset);
      yOffset += 40;
    });
    doc.save(`all_health_records_${Date.now()}.pdf`);
    alert(`All records saved as all_health_records_${Date.now()}.pdf`);
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

  const setReminderNotification = () => {
    if (reminder && reminderTime) {
      const [hours, minutes] = reminderTime.split(':');
      const now = new Date();
      const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      if (reminderDate <= now) reminderDate.setDate(reminderDate.getDate() + 1);
      const timeDiff = reminderDate - now;
      setTimeout(() => {
        new Notification('Health Reminder', { body: reminder });
        speak(reminder);
      }, timeDiff);
      alert(`Reminder set for ${reminder} at ${reminderTime}`);
      setReminder('');
      setReminderTime('');
    } else {
      alert('Please enter both reminder and time');
    }
  };

  const suggestHealthAdvice = () => {
    if (filteredRecords.length > 0) {
      const latestRecord = filteredRecords[filteredRecords.length - 1];
      const bpValue = latestRecord.bp ? parseFloat(latestRecord.bp.split('/')[0]) : 0;
      const sugarValue = parseFloat(latestRecord.sugar) || 0;
      if (bpValue > 140 || sugarValue > 200) {
        return 'Alert: High BP or sugar levels detected. Consult a doctor.';
      }
      return 'Tip: Maintain a balanced diet and regular exercise.';
    }
    return 'No data to analyze. Stay healthy!';
  };

  const deleteRecord = (index) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedRecords = records.filter((_, i) => i !== index);
      setRecords(updatedRecords);
      alert('Record deleted successfully.');
    }
  };

  const translations = {
    en: 'Health AI',
    ta: 'உடல் நல AI',
    hi: 'स्वास्थ्य AI',
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
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: '800',
            color: '#fff',
            margin: 0,
          }}
        >
          {translations[selectedLanguage]}
        </h1>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            setSelectedLanguage(e.target.value);
            initializeTTS();
          }}
          style={{
            padding: '8px 16px',
            background: '#26a69a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}
        >
          {['en', 'ta', 'hi'].map((lang) => (
            <option
              key={lang}
              value={lang}
              style={{ background: '#fff', color: '#004d40' }}
            >
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </header>

      <div style={{ padding: '24px 40px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '50%',
            maxWidth: '350px',
            padding: '10px 16px',
            borderRadius: '24px',
            background: '#ffffff',
            border: '2px solid #26a69a',
            fontSize: '14px',
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        />
        <div style={{ marginTop: '20px', color: '#00695c', fontStyle: 'italic' }}>{suggestHealthAdvice()}</div>
        <div style={{ marginTop: '10px' }}>
          <input type="text" placeholder="Reminder (e.g., Take medicine)" value={reminder} onChange={(e) => setReminder(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '2px solid #26a69a', marginRight: '10px' }} />
          <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '2px solid #26a69a' }} />
          <button onClick={setReminderNotification} style={{ padding: '10px 20px', background: '#26a69a', color: '#fff', border: 'none', borderRadius: '8px', marginLeft: '10px', cursor: 'pointer' }}>Set Reminder</button>
        </div>
      </div>

      <div style={{ padding: '20px 40px' }}>
        <button
          onClick={generateAllRecordsPDF}
          style={{
            background: '#26a69a',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Download All Records
        </button>
        {filteredRecords.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              fontSize: '20px',
              color: '#004d40',
              fontWeight: '600',
              marginTop: '20px',
            }}
          >
            No records found.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredRecords.map((record, index) => (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0f2f1',
                  transition: '0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 14px rgba(0,0,0,0.12)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 3px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{ fontSize: '28px', color: '#26a69a' }}
                  >
                    🏥
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#004d40',
                        margin: 0,
                      }}
                    >{`${record.name} - ${record.date}`}</p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#00695c',
                        margin: '2px 0 0 0',
                      }}
                    >
                      BP: ${record.bp || 'N/A'} | Sugar: ${record.sugar || 'N/A'} | Tablet:{' '}
                      ${record.tablet || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => generatePDF(record)}
                    style={{
                      marginLeft: 'auto',
                      fontSize: '20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#26a69a',
                    }}
                  >
                    📥
                  </button>
                  <button
                    onClick={() => deleteRecord(index)}
                    style={{
                      fontSize: '20px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#d32f2f',
                      marginLeft: '10px',
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {[
          {
            icon: '➕',
            onClick: () => setShowAddRecord(true),
          },
          {
            icon: '🩺',
            onClick: () => setShowSymptomChecker(true),
          },
          {
            icon: '📊',
            onClick: () => setShowDashboard(true),
          },
          {
            icon: '🤖',
            onClick: () => setShowAISymptomChecker(true),
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            style={{
              background: '#26a69a',
              color: '#fff',
              padding: '14px',
              borderRadius: '50%',
              fontSize: '20px',
              border: 'none',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;