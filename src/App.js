import React, { useState, useRef } from 'react';

const ScreenRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting screen capture:", err);
      alert("Failed to start screen capture. Please make sure you have granted the necessary permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = 'screen-recording.webm';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  };

  const containerStyle = {
    width: '90%',
    maxWidth: '400px',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#4a4a4a',
    fontSize: '28px',
    marginBottom: '24px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  };

  const selectStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '24px',
    borderRadius: '10px',
    border: '2px solid #764ba2',
    fontSize: '16px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
  };

  const buttonStyle = (isActive, isDisabled) => ({
    padding: '15px 25px',
    backgroundColor: isDisabled ? '#d9d9d9' : (isActive ? '#ff4d4f' : '#667eea'),
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    flex: 1,
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
    },
    ':active': {
      transform: 'translateY(1px)',
    },
  });

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Screen Recorder</h2>
        <select style={selectStyle}>
          <option value="">Select recording mode</option>
          <option value="fullscreen">Full Screen</option>
          <option value="window">Specific Window</option>
          <option value="custom">Custom Area</option>
        </select>
        <div style={buttonContainerStyle}>
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            style={buttonStyle(isRecording, false)}
          >
            {isRecording ? 'Stop' : 'Start'} Recording
          </button>
          <button 
            onClick={handleDownload} 
            disabled={recordedChunks.length === 0}
            style={buttonStyle(false, recordedChunks.length === 0)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <ScreenRecorder />
    </div>
  );
}

export default App;