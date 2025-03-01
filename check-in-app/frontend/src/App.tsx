import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminSignIn from "./pages/AdminSignIn";
import AdminCheckIn from "./pages/AdminCheckIn";
import CreateEvent from "./pages/CreateEvent";
import RegisterAttendee from "./pages/RegisterAttendee";
import TestQRPage from "./pages/TestQRPage";
import GuestCheckIn from "./pages/GuestCheckIn"; // ✅ Import Guest Check-In Page
import AttendeeSearch from "./pages/AttendeeSearch"; //
import SelfCheckIn from "./pages/SelfCheckIn";
import CheckInAnalytics from "./pages/CheckInAnalytics";
import LandingPage from "./pages/LandingPage";




const App: React.FC = () => {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-sign-in" element={<AdminSignIn />} />
        <Route path="/admin-check-in" element={<AdminCheckIn />} />
        <Route path="/attendee-search" element={<AttendeeSearch />} /> 
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/register-attendee" element={<RegisterAttendee />} />
        <Route path="/test-qr" element={<TestQRPage />} />
        <Route path="/guest-check-in" element={<GuestCheckIn />} /> {/* ✅ New Route */}
        <Route path="/self-check-in/:eventId" element={<SelfCheckIn />} /> 
        <Route path="/check-in-analytics" element={<CheckInAnalytics />} />

      </Routes>
    </>
  );
};

export default App;


