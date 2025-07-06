import React, { useState, useEffect } from 'react';

const DashboardScreen = ({
  onClose,
  records,
  setShowBMIModal,
  setShowSleepTracker,
  setShowHeartRate,
  setShowAyurvedaTips,
  activityGoals,
  selectedLanguage,
}) => {
  console.log('Selected Language:', selectedLanguage); // Debug log
  const lang = selectedLanguage || 'en'; // Fallback to English if undefined

  const totalRecords = records ? records.length : 0;
  const avgSugar = totalRecords > 0
    ? records.reduce((sum, r) => sum + (parseFloat(r.sugar) || 0), 0) / totalRecords
    : 0;
  const avgBP = totalRecords > 0
    ? records.reduce((sum, r) => sum + (r.bp ? parseFloat(r.bp.split('/')[0]) || 0 : 0), 0) / totalRecords
    : 0;
  const [steps, setSteps] = useState(0);
  const [screenTime, setScreenTime] = useState(0);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
  const [sleepDuration, setSleepDuration] = useState(0);
  const [heartRate, setHeartRate] = useState(0);

  useEffect(() => {
    let stepCount = 0;
    const handleMotion = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration && Math.abs(acceleration.z) > 10) stepCount++;
      setSteps(stepCount);
    };
    if ('DeviceMotionEvent' in window && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'accelerometer' }).then((permission) => {
        if (permission.state === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        } else {
          setSteps(Math.floor(Math.random() * 10000));
        }
      });
    } else {
      setSteps(Math.floor(Math.random() * 10000));
    }

    let timeSpent = 0;
    const updateScreenTime = () => {
      timeSpent += 1;
      setScreenTime(timeSpent);
    };
    const interval = setInterval(updateScreenTime, 60000);
    const visibilityHandler = () => {
      if (document.hidden) clearInterval(interval);
      else setInterval(updateScreenTime, 60000, interval);
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    const sleepRecord = records ? records.find(r => r.type === 'sleep') : null;
    setSleepDuration(sleepRecord ? parseFloat(sleepRecord.duration) || 0 : 0);

    const timestampInterval = setInterval(() => setTimestamp(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })), 60000);
    return () => {
      if ('DeviceMotionEvent' in window) window.removeEventListener('devicemotion', handleMotion);
      document.removeEventListener('visibilitychange', visibilityHandler);
      clearInterval(interval);
      clearInterval(timestampInterval);
    };
  }, [records]);

  const healthStatus = avgSugar > 200 || avgBP > 140 ? 'Caution: Elevated Levels' : 'Normal';
  const stepProgress = (steps / (activityGoals?.steps || 10000)) * 100 || 0;

  const translations = {
    titles: {
      en: 'Health Dashboard',
      ta: 'உடல் நல டாஷ்போர்டு',
      hi: 'स्वास्थ्य डैशबोर्ड',
      te: 'ఆరోగ్య డాష్‌బోర్డ్',
      kn: 'ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    },
    labels: {
      totalRecords: { en: 'Total Records', ta: 'மொத்த பதிவுகள்', hi: 'कुल रिकॉर्ड्स', te: 'మొత్తం రికార్డ్‌లు', kn: 'ಒಟ್ಟು ದಾಖಲೆಗಳು' },
      steps: { en: 'Steps', ta: 'படிகள்', hi: 'चरण', te: 'చ步伐లు', kn: 'ಹೆಜ್ಜೆಗಳು' },
      screenTime: { en: 'Screen Time (hrs)', ta: 'திரை நேரம் (மணி)', hi: 'स्क्रीन समय (घंटे)', te: 'స్క్రీన్ టైం (గంటలు)', kn: 'ತೆರೆ ಸಮಯ (ಗಂಟೆಗಳು)' },
      sleep: { en: 'Sleep (hrs)', ta: 'தூக்கம் (மணி)', hi: 'नींद (घंटे)', te: 'నిద్ర (గంటలు)', kn: 'ನಿದ್ರೆ (ಗಂಟೆಗಳು)' },
      healthStatus: { en: 'Health Status', ta: 'உடல் நல நிலை', hi: 'स्वास्थ्य स्थिति', te: 'ఆరోగ్య స్థితి', kn: 'ಆರೋಗ್ಯ ಸ್ಥಿತಿ' },
      updated: { en: 'Updated', ta: 'புதுப்பிக்கப்பட்டது', hi: 'अद्यतन', te: 'నవీకరించబడింది', kn: 'ಅಪ್‌డೇಟ್ ಮಾಡಲಾಗಿದೆ' },
    },
    status: {
      caution: { en: 'Caution: Elevated Levels', ta: 'எச்சரிக்கை: உயர் அளவுகள்', hi: 'चेतावनी: ऊंचे स्तर', te: 'హెచ్చరిక: ఎక్కువ స్థాయిలు', kn: 'ಎಚ್ಚರಿಕೆ: ಎತ್ತರದ ಮಟ್ಟಗಳು' },
      normal: { en: 'Normal', ta: 'சாதாரண', hi: 'सामान्य', te: 'సాధారణ', kn: 'ಸಾಮಾನ್ಯ' },
    },
    tips: {
      screenTimeHigh: { en: 'Tip: Take a break!', ta: 'உதவி: இடைவெளி எடுத்துக்கொள்ளுங்கள்!', hi: 'सुझाव: ब्रेक लें!', te: 'సలహా: ఒక బ్రేక్ తీసుకోండి!', kn: 'ಸಲಹೆ: ಒಂದು ವಿರಾಮ ತೆಗೆದುಕೊಳ್ಳಿ!' },
      screenTimeGood: { en: 'Good so far!', ta: 'இதுவரை நல்ல!', hi: 'अब तक अच्छा!', te: 'ఇప్పటి వరకు బాగుంది!', kn: 'ಇಲ್ಲಿಯವರೆಗೆ ಒಳ್ಳೆಯದು!' },
      sleepLow: { en: 'Aim for 7-9 hrs', ta: '7-9 மணி நோக்கமாகக் கொள்ளுங்கள்', hi: '7-9 घंटे का लक्ष्य रखें', te: '7-9 గంటల కోసం లక్ష్యంగా ఉంచండి', kn: '7-9 ಗಂಟೆಗಳಿಗೆ ಗುರಿ ಇಡಿ' },
      sleepOptimal: { en: 'Optimal!', ta: 'சரியானது!', hi: 'उत्कृष्ट!', te: 'చివరి!', kn: 'ಉತ್ತಮ!' },
    },
    buttons: {
      bmiCheck: { en: 'BMI Check', ta: 'BMI சரிபார்ப்பு', hi: 'BMI जांच', te: 'BMI తనిఖీ', kn: 'BMI ಪರೀಕ್ಷೆ' },
      sleepTracker: { en: 'Sleep Tracker', ta: 'தூக்கம் கண்காணிப்பு', hi: 'नींद ट्रैकर', te: 'నిద్ర ట్రాకర్', kn: 'ನಿದ್ರೆ ಟ್ರ್ಯಾಕರ್' },
      heartRate: { en: 'Heart Rate', ta: 'இதய துடிப்பு', hi: 'हृदय गति', te: 'హార్ట్ రేట్', kn: 'ಹೃದಯ ದರ' },
      ayurvedaTips: { en: 'Ayurveda Tips', ta: 'ஆயுர்வேத குறிப்புகள்', hi: 'आयुर्वेद टिप्स', te: 'ఆయుర్వేద టిప్స్', kn: 'ಆಯುರ್ವೇದ ಸಲಹೆಗಳು' },
      close: { en: 'Close', ta: 'மூடு', hi: 'बंद करें', te: 'మూసివేయండి', kn: 'ಮುಚ್ಚಿ' },
    },
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '50', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
        maxWidth: '480px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3c34', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {translations.titles[lang]}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>📊</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              {translations.labels.totalRecords[lang]}: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{totalRecords}</span>
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>👟</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              {translations.labels.steps[lang]}: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{steps}</span> ({stepProgress.toFixed(0)}% of {(activityGoals?.steps || 10000)})
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>⏰</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              {translations.labels.screenTime[lang]}: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{screenTime}</span><br />
              {screenTime > 4 ? <span style={{ color: '#d32f2f' }}>{translations.tips.screenTimeHigh[lang]}</span> : <span style={{ color: '#388e3c' }}>{translations.tips.screenTimeGood[lang]}</span>}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>💤</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              {translations.labels.sleep[lang]}: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{sleepDuration}</span><br />
              {sleepDuration < 7 ? <span style={{ color: '#d32f2f' }}>{translations.tips.sleepLow[lang]}</span> : <span style={{ color: '#388e3c' }}>{translations.tips.sleepOptimal[lang]}</span>}
            </p>
          </div>
          <div style={{
            background: '#e6f3f5', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              {translations.labels.healthStatus[lang]}: <span style={{ fontWeight: '600', color: avgSugar > 200 || avgBP > 140 ? '#d32f2f' : '#388e3c' }}>{translations.status[avgSugar > 200 || avgBP > 140 ? 'caution' : 'normal'][lang]}</span>
            </p>
            <p style={{ fontSize: '12px', color: '#4a704e', marginTop: '6px' }}>{translations.labels.updated[lang]}: {timestamp}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setShowBMIModal(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >{translations.buttons.bmiCheck[lang]}</button>
            <button
              onClick={() => setShowSleepTracker(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >{translations.buttons.sleepTracker[lang]}</button>
            <button
              onClick={() => setShowHeartRate(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >{translations.buttons.heartRate[lang]}</button>
            <button
              onClick={() => setShowAyurvedaTips(true)}
              style={{ background: '#2e7d32', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >{translations.buttons.ayurvedaTips[lang]}</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              background: '#d32f2f', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontWeight: '500', width: '150px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOver={(e) => { e.target.style.background = '#b71c1c'; e.target.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.target.style.background = '#d32f2f'; e.target.style.transform = 'translateY(0)'; }}
          >
            {translations.buttons.close[lang]}
          </button>
        </div>
      </div>
    </div>
  );
};

DashboardScreen.defaultProps = {
  activityGoals: { steps: 10000, exerciseMinutes: 30, waterIntake: 8 },
};

export default DashboardScreen;