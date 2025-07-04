import React, { useState, useEffect } from 'react';

const DashboardScreen = ({
  onClose,
  records,
  setShowBMIModal,
  setShowSleepTracker,
  setShowHeartRate,
  activityGoals,
}) => {
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
    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      setSteps(Math.floor(Math.random() * 10000));
    }

    let timeSpent = 0;
    const updateScreenTime = () => {
      timeSpent += 1;
      setScreenTime(timeSpent);
    };
    const interval = setInterval(updateScreenTime, 60000);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(interval);
      else setInterval(updateScreenTime, 60000);
    });

    const sleepRecord = records ? records.find(r => r.type === 'sleep') : null;
    setSleepDuration(sleepRecord ? parseFloat(sleepRecord.duration) || 0 : 0);

    const timestampInterval = setInterval(() => setTimestamp(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })), 60000);
    return () => {
      if ('DeviceMotionEvent' in window) window.removeEventListener('devicemotion', handleMotion);
      clearInterval(interval);
      clearInterval(timestampInterval);
    };
  }, [records]);

  const healthStatus = avgSugar > 200 || avgBP > 140 ? 'Caution: Elevated Levels' : 'Normal';
  const stepProgress = (steps / activityGoals.steps) * 100 || 0;

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
          Health Dashboard
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>📊</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              Total Records: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{totalRecords}</span>
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>👟</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              Steps: <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{steps}</span> ({stepProgress.toFixed(0)}% of {activityGoals.steps})
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>⏰</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              Screen Time (hrs): <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{screenTime}</span><br />
              {screenTime > 4 ? <span style={{ color: '#d32f2f' }}>Tip: Take a break!</span> : <span style={{ color: '#388e3c' }}>Good so far!</span>}
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', background: '#e6f3f5', padding: '16px', borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '20px', color: '#1a7f6f', marginRight: '12px' }}>💤</span>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              Sleep (hrs): <span style={{ fontWeight: '600', color: '#1a7f6f' }}>{sleepDuration}</span><br />
              {sleepDuration < 7 ? <span style={{ color: '#d32f2f' }}>Aim for 7-9 hrs</span> : <span style={{ color: '#388e3c' }}>Optimal!</span>}
            </p>
          </div>
          <div style={{
            background: '#e6f3f5', padding: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', margin: 0 }}>
              Health Status: <span style={{ fontWeight: '600', color: avgSugar > 200 || avgBP > 140 ? '#d32f2f' : '#388e3c' }}>{healthStatus}</span>
            </p>
            <p style={{ fontSize: '12px', color: '#4a704e', marginTop: '6px' }}>Updated: {timestamp}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            <button
              onClick={() => setShowBMIModal(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >BMI Check</button>
            <button
              onClick={() => setShowSleepTracker(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >Sleep Tracker</button>
            <button
              onClick={() => setShowHeartRate(true)}
              style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '500' }}
            >Heart Rate</button>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;