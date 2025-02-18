import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminCheckIn from "./pages/AdminCheckIn";
import CreateEvent from "./pages/CreateEvent";
import RegisterAttendee from "./pages/RegisterAttendee";
import TestQRPage from "./pages/TestQRPage";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-check-in" element={<AdminCheckIn />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/register-attendee" element={<RegisterAttendee />} />
        <Route path="/test-qr" element={<TestQRPage />} />
      </Routes>
    </>
  );
};

export default App;


