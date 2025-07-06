import React, { useState, useEffect, Component } from 'react';
import HomeScreen from './components/HomeScreen';
import AddRecordScreen from './components/AddRecordScreen';
import SymptomCheckerScreen from './components/SymptomCheckerScreen';
import DashboardScreen from './components/DashboardScreen';
import BMIModal from './components/BMIModal';
import SleepTrackerModal from './components/SleepTrackerModal';
import HeartRateScreen from './components/HeartRateScreen';
import AISymptomCheckerScreen from './components/AISymptomCheckerScreen';
import AyurvedaTipsModal from './components/AyurvedaTipsModal';
import ReminderModal from './components/ReminderModal';
import './App.css';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa, #4dd0e1, #00695c)', fontFamily: "'Poppins', sans-serif", padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false })} style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('healthRecords') || '[]'));
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showBMIModal, setShowBMIModal] = useState(false);
  const [showSleepTracker, setShowSleepTracker] = useState(false);
  const [showHeartRate, setShowHeartRate] = useState(false);
  const [showAISymptomChecker, setShowAISymptomChecker] = useState(false);
  const [showAyurvedaTips, setShowAyurvedaTips] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [activityGoals, setActivityGoals] = useState({ steps: 10000, exerciseMinutes: 30, waterIntake: 8 });
  const synth = window.speechSynthesis; // Explicitly define synth

  useEffect(() => {
    localStorage.setItem('healthRecords', JSON.stringify(records));
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, [records]);

  const addRecord = (newRecord) => {
    setRecords([...records, { ...newRecord, date: new Date().toISOString().split('T')[0] }]);
  };

  const addSleepRecord = (sleepData) => {
    setRecords([...records, { ...sleepData, type: 'sleep', date: new Date().toISOString().split('T')[0] }]);
  };

  const setReminderNotification = (reminder, reminderTime) => {
    if (reminder && reminderTime) {
      const [hours, minutes] = reminderTime.split(':');
      const now = new Date();
      const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      if (reminderDate <= now) reminderDate.setDate(reminderDate.getDate() + 1);
      const timeDiff = reminderDate - now;
      if ('Notification' in window && Notification.permission === 'granted') {
        setTimeout(() => {
          new Notification('Health Reminder', { body: reminder });
          synth.speak(new SpeechSynthesisUtterance(reminder));
        }, timeDiff);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            setTimeout(() => {
              new Notification('Health Reminder', { body: reminder });
              synth.speak(new SpeechSynthesisUtterance(reminder));
            }, timeDiff);
          }
        });
      }
      alert(`Reminder set for ${reminder} at ${reminderTime}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0f7fa, #4dd0e1, #00695c)', fontFamily: "'Poppins', sans-serif" }}>
      <ErrorBoundary>
        <HomeScreen
          records={records}
          setRecords={setRecords}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          setShowAddRecord={setShowAddRecord}
          setShowSymptomChecker={setShowSymptomChecker}
          setShowDashboard={setShowDashboard}
          setShowAISymptomChecker={setShowAISymptomChecker}
          setShowBMIModal={setShowBMIModal}
          setShowSleepTracker={setShowSleepTracker}
          setShowHeartRate={setShowHeartRate}
          setShowReminderModal={setShowReminderModal}
          activityGoals={activityGoals}
          synth={synth} // Pass synth to HomeScreen
        />
      </ErrorBoundary>
      {showAddRecord && (
        <AddRecordScreen
          onSave={addRecord}
          onClose={() => setShowAddRecord(false)}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
      {showSymptomChecker && (
        <SymptomCheckerScreen
          onClose={() => setShowSymptomChecker(false)}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
      {showDashboard && (
        <ErrorBoundary>
          <DashboardScreen
            onClose={() => setShowDashboard(false)}
            records={records}
            setShowBMIModal={setShowBMIModal}
            setShowSleepTracker={setShowSleepTracker}
            setShowHeartRate={setShowHeartRate}
            setShowAyurvedaTips={setShowAyurvedaTips}
            activityGoals={activityGoals}
            selectedLanguage={selectedLanguage} // Added missing prop
          />
        </ErrorBoundary>
      )}
      {showBMIModal && (
        <BMIModal
          onClose={() => setShowBMIModal(false)}
          records={records}
        />
      )}
      {showSleepTracker && (
        <SleepTrackerModal
          onSave={addSleepRecord}
          onClose={() => setShowSleepTracker(false)}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
      {showHeartRate && (
        <HeartRateScreen
          onClose={() => setShowHeartRate(false)}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
      {showAISymptomChecker && (
        <AISymptomCheckerScreen
          onClose={() => setShowAISymptomChecker(false)}
          records={records}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
      {showAyurvedaTips && (
        <AyurvedaTipsModal
          onClose={() => setShowAyurvedaTips(false)}
          records={records}
        />
      )}
      {showReminderModal && (
        <ReminderModal
          onClose={() => setShowReminderModal(false)}
          onSave={setReminderNotification}
          selectedLanguage={selectedLanguage}
          synth={synth} // Pass synth to ReminderModal
        />
      )}
    </div>
  );
}

export default App;