import React, { useState } from 'react';

const CalorieTrackerScreen = ({ onSave, onClose, selectedLanguage }) => {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState('');

  const handleSave = () => {
    if (foodItem && calories) {
      onSave({ foodItem, calories: parseFloat(calories) });
      onClose();
    }
  };

  const translations = {
    en: { title: 'Calorie Tracker', item: 'Food Item', cal: 'Calories', save: 'Save' },
    ta: { title: 'கலோரி பதிவி', item: 'உணவு பொருள்', cal: 'கலோரிகள்', save: 'சேமி' },
    hi: { title: 'कैलोरी ट्रैकर', item: 'खाद्य पदार्थ', cal: 'कैलोरी', save: 'सहेजें' },
  };

  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '60' }}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3c34', textAlign: 'center', marginBottom: '20px' }}>{translations[selectedLanguage].title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="text" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} placeholder={translations[selectedLanguage].item} />
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} placeholder={translations[selectedLanguage].cal} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={handleSave} style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{translations[selectedLanguage].save}</button>
          <button onClick={onClose} style={{ background: '#d32f2f', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CalorieTrackerScreen;