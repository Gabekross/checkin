import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
  const location = useLocation();

  // Check if current page is AdminCheckIn
  const isAdminCheckInPage = location.pathname === "/admin-check-in";
  const isDefaultPage = location.pathname === "/";

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        {isDefaultPage && <li><Link to="/admin-check-in">Admin Check-In</Link></li>}
        {isAdminCheckInPage && (
          <>
            <li><Link to="/create-event">Create Event</Link></li>
            <li><Link to="/register-attendee">Pre-Register Attendees</Link></li>
            <li><Link to="/test-qr">Test QR Signing</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
