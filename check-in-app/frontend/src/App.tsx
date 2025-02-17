// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SelfCheckIn from './pages/SelfCheckIn';
// import TestQRPage from './pages/TestQRPage';
// import './styles/global.scss';

// function App() {
//   useEffect(() => {
//     console.log("✅ App.tsx is rendering and routes are being loaded...");
//   }, []);

//   return (
//     <div className="App">
//       <Routes>
//         <Route path="/" element={<h1>Event Check-In System</h1>} />
//         <Route path="/self-check-in/:eventId" element={<SelfCheckIn />} />
//         <Route path="/test-qr" element={<TestQRPage />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AdminCheckIn from './pages/AdminCheckIn';
import SelfCheckIn from './pages/SelfCheckIn';
import RegisterAttendee from './pages/RegisterAttendee';
import CreateEvent from './pages/CreateEvent';
import './styles/global.scss';

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/create-event">Create Event</Link></li>
          <li><Link to="/register-attendee">Pre-Register Attendees</Link></li>
          <li><Link to="/admin-check-in">Admin Check-In</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={<h1>Event Check-In System</h1>} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/register-attendee" element={<RegisterAttendee />} />
        <Route path="/admin-check-in" element={<AdminCheckIn />} />
        <Route path="/self-check-in/:eventId" element={<SelfCheckIn />} />
      </Routes>
    </div>
  );
}

export default App;

