import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SelfCheckIn from './pages/SelfCheckIn';
import TestQRPage from './pages/TestQRPage';
import './styles/global.scss';

function App() {
  useEffect(() => {
    console.log("✅ App.tsx is rendering and routes are being loaded...");
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>Event Check-In System</h1>} />
        <Route path="/self-check-in/:eventId" element={<SelfCheckIn />} />
        <Route path="/test-qr" element={<TestQRPage />} />
      </Routes>
    </div>
  );
}

export default App;
