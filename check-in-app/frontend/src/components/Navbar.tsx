import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
  const location = useLocation();

  // Check if current page is Home or AdminCheckIn
  const isHomePage = location.pathname === "/";
  const isAdminCheckInPage = location.pathname === "/admin-check-in";

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>

        {/* ✅ Show "Guest" link ONLY on the Home page */}
        {isHomePage && <li><Link to="/guest-check-in">Guest</Link></li>}

        {/* ✅ Show "Admin" link ONLY on the Home page */}
        {isHomePage && <li><Link to="/admin-check-in">Admin</Link></li>}

        {/* ✅ Show these links ONLY on the Admin Check-In page */}
        {isAdminCheckInPage && (
          <>
            <li><Link to="/create-event">Create Event</Link></li>
            <li><Link to="/register-attendee">Pre-Event Registration</Link></li>
            <li><Link to="/test-qr">Generate QR Code</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
