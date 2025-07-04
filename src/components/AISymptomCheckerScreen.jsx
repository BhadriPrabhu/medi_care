import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const AISymptomCheckerScreen = ({
  onClose,
  records,
  selectedLanguage,
}) => {
  const [aiQuery, setAiQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const chatContainerRef = useRef(null);

  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const initializeTTS = () => {
    synth.cancel();
  };

  const speak = (text) => {
    initializeTTS();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      selectedLanguage === 'ta'
        ? 'ta-IN'
        : selectedLanguage === 'hi'
        ? 'hi-IN'
        : 'en-US';
    utterance.rate = 0.5;
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const stopSpeech = () => {
    if (utteranceRef.current) {
      synth.cancel();
      utteranceRef.current = null;
    }
  };

  useEffect(() => {
    initializeTTS();
    return () => initializeTTS(); // Cleanup on unmount
  }, [selectedLanguage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const getAIResponse = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const prompt = `Based on the following health records: ${JSON.stringify(records)}, provide advice or insights for the query: ${query}. Format the response using markdown (e.g., use **bold**, - lists) in a conversational style like: AI: [response].`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().replace('AI:', '').trim(); // Remove 'AI:' prefix if added by model
      setChatHistory((prev) => [...prev, { role: 'user', text: query }, { role: 'ai', text }]);
    } catch (error) {
      console.log('Error fetching AI response:', error);
      setChatHistory((prev) => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
      setAiQuery(''); // Clear input field after response
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      getAIResponse(aiQuery);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backdropFilter: 'blur(5px)',
        animation: 'floatIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
          width: '480px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          animation: 'floatUp 0.3s ease-out forwards',
        }}
      >
        <header style={{ textAlign: 'center', marginBottom: '20px', flexShrink: 0 }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1a3c34', margin: '0' }}>
            AI Health Assistant
          </h2>
        </header>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#d32f2f',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>
        <main
          ref={chatContainerRef}
          style={{
            flex: '1',
            overflowY: 'auto',
            padding: '0 16px',
            marginBottom: '20px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#26a69a #e0f7fa',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {!chatHistory.length && (
            <div
              style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#26a69a',
                fontSize: '20px',
                fontWeight: '600',
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(38, 166, 154, 0.1)',
                borderRadius: '8px',
              }}
            >
              Ready to Answer!
            </div>
          )}
          {chatHistory.map((message, index) => (
            <div
              key={index}
              style={{
                margin: '5px 0',
                padding: '10px 15px',
                borderRadius: '8px',
                maxWidth: '70%',
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: message.role === 'user' ? '#e0f7fa' : '#f5f5f5',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <strong style={{ color: message.role === 'user' ? '#00695c' : '#1a3c34' }}>
                {message.role === 'user' ? 'User' : 'AI'}:
              </strong>{' '}
              <ReactMarkdown style={{ display: 'inline', color: '#004d40', fontWeight: '500' }}>
                {message.text}
              </ReactMarkdown>
            </div>
          ))}
        </main>
        <div style={{ flexShrink: 0, padding: '0 16px' }}>
          <input
            type="text"
            placeholder="Ask a health question..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid #26a69a',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '10px',
            }}
          />
          <button
            onClick={() => getAIResponse(aiQuery)}
            style={{
              padding: '10px 20px',
              background: '#26a69a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              width: '100%',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Get Response'}
          </button>
        </div>
        {chatHistory.length > 0 && (
          <div style={{ flexShrink: 0, padding: '0 16px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => speak(chatHistory[chatHistory.length - 1].text)}
                style={{
                  padding: '8px 16px',
                  background: '#26a69a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: '1',
                }}
              >
                Listen
              </button>
              <button
                onClick={stopSpeech}
                style={{
                  padding: '8px 16px',
                  background: '#d32f2f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: '1',
                }}
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes floatIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes floatUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default AISymptomCheckerScreen;