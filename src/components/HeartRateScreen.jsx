import React, { useState, useEffect } from 'react';

const HeartRateScreen = ({ onClose, selectedLanguage }) => {
  const [heartRate, setHeartRate] = useState('');
  const [deviceStatus, setDeviceStatus] = useState('checking');

  useEffect(() => {
    if ('bluetooth' in navigator) {
      navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
        .then(device => {
          setDeviceStatus('connected');
          return device.gatt.connect();
        })
        .then(server => server.getPrimaryService('heart_rate'))
        .then(service => service.getCharacteristic('heart_rate_measurement'))
        .then(characteristic => characteristic.startNotifications()
          .then(() => {
            characteristic.addEventListener('characteristicvaluechanged', event => {
              const value = event.target.value;
              const rate = value.getUint8(1); // Simplified heart rate value
              setHeartRate(rate);
            });
          }))
        .catch(error => {
          console.error('Bluetooth error:', error);
          setDeviceStatus('disconnected');
        });
    } else {
      setDeviceStatus('unsupported');
    }
  }, []);

  const translations = {
    en: { title: 'Heart Rate Monitor', rate: 'Heart Rate', unit: 'bpm', save: 'Save', connect: 'Connect suitable device', alert: 'Check with a doctor if abnormal!' },
    ta: { title: 'இதய துடிப்பு மானி', rate: 'இதய துடிப்பு', unit: 'bpm', save: 'சேமி', connect: 'பொருத்தமான சாதனத்தை இணைக்கவும்', alert: 'அசாதாரணமாக இருந்தால் மருத்துவரை அணுகவும்!' },
    hi: { title: 'हृदय गति मॉनिटर', rate: 'हृदय गति', unit: 'bpm', save: 'सहेजें', connect: 'उपयुक्त डिवाइस से कनेक्ट करें', alert: 'असामान्य होने पर डॉक्टर से संपर्क करें!' },
  };

  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '60' }}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3c34', textAlign: 'center', marginBottom: '20px' }}>{translations[selectedLanguage].title}</h2>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {deviceStatus === 'connected' && (
            <>
              <input type="number" value={heartRate} readOnly style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px', width: '100px', textAlign: 'center' }} placeholder={translations[selectedLanguage].rate} />
              <p style={{ fontSize: '16px', fontWeight: '500', color: heartRate > 100 || heartRate < 60 ? '#d32f2f' : '#1a3c34', marginTop: '10px' }}>
                {heartRate} {translations[selectedLanguage].unit}
              </p>
              {heartRate && (parseInt(heartRate) > 100 || parseInt(heartRate) < 60) && <p style={{ fontSize: '14px', color: '#d32f2f' }}>{translations[selectedLanguage].alert}</p>}
            </>
          )}
          {(deviceStatus === 'disconnected' || deviceStatus === 'unsupported') && (
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#d32f2f', textAlign: 'center' }}>{translations[selectedLanguage].connect}</p>
          )}
          {deviceStatus === 'checking' && <p style={{ fontSize: '16px', color: '#1a3c34' }}>Searching for device...</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={onClose} style={{ background: '#d32f2f', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default HeartRateScreen;