import React, { useState } from 'react';

const BMIModal = ({ onClose }) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100; // Convert cm to meters
      const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
      setBmi(bmiValue.toFixed(1));
    }
  };

  return (
    <div style={{ position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '60' }}>
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', maxWidth: '400px', width: '90%' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a3c34', textAlign: 'center', marginBottom: '20px' }}>BMI Calculator</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (cm)" style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} />
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" style={{ padding: '10px', border: '1px solid #1a7f6f', borderRadius: '4px' }} />
          <button onClick={calculateBMI} style={{ background: '#1a7f6f', color: '#ffffff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Calculate</button>
          {bmi && <p style={{ fontSize: '16px', fontWeight: '500', color: '#1a3c34', textAlign: 'center' }}>BMI: {bmi} {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}</p>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={onClose} style={{ background: '#d32f2f', color: '#ffffff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default BMIModal;