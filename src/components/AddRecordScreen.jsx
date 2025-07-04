import React, { useState } from 'react';

const AddRecordScreen = ({ onSave, onClose, selectedLanguage }) => {
  const [form, setForm] = useState({
    name: '', bp: '', sugar: '', height: '', weight: '', cause: '', symptoms: '', tablet: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(field => !field)) return alert('All fields are required');
    if (!/^\d+\/\d+$/.test(form.bp)) return alert('Enter valid BP (e.g., 120/80)');
    ['sugar', 'height', 'weight'].forEach(field => {
      if (isNaN(form[field]) || form[field] <= 0) return alert(`Enter valid ${field}`);
    });
    onSave(form);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', background: 'rgba(0, 0, 0, 0.75)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: '50', backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(15px)', padding: '24px', borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', border: '1px solid #e0f7fa', maxWidth: '400px', width: '90%',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#003c30' }}>Add Record</h2>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              padding: '10px', background: 'rgba(38, 166, 154, 0.8)', color: '#fff', border: '2px solid #26a69a',
              borderRadius: '8px', cursor: 'pointer', transition: 'border-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.borderColor = '#1e7c69'}
            onMouseOut={(e) => e.target.style.borderColor = '#26a69a'}
          >
            {['en', 'ta', 'hi'].map((lang) => (
              <option key={lang} value={lang} style={{ background: '#26a69a' }}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '8px', marginBottom: '24px' }}>
          {['name', 'bp', 'sugar', 'height', 'weight', 'cause', 'symptoms', 'tablet'].map((field) => (
            <div
              key={field}
              style={{
                display: 'flex', alignItems: 'center', padding: '8px', background: 'rgba(224, 247, 250, 0.8)',
                borderRadius: '8px', marginBottom: '12px', transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(224, 247, 250, 1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(224, 247, 250, 0.8)'}
            >
              <input
                type={
                  field === 'name' ? 'text' :
                  field === 'bp' ? 'tel' :
                  field === 'sugar' || field === 'height' || field === 'weight' ? 'number' :
                  'text'
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field === 'bp' ? ' (e.g., 120/80)' : '')}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={{
                  flex: '1', padding: '8px', border: 'none', background: 'transparent', color: '#003c30', fontSize: '16px',
                  outline: 'none'
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
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#616161'}
            onMouseOut={(e) => e.target.style.background = '#757575'}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              background: '#26a69a', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#1e7c69'}
            onMouseOut={(e) => e.target.style.background = '#26a69a'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecordScreen;