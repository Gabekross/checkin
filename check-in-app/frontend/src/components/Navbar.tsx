import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import styles from "../styles/Navbar.module.scss";

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ Check if an admin is logged in
    const checkAuthStatus = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAdminAuthenticated(!!data.session);
    };

    checkAuthStatus();

    // ✅ Listen for auth state changes (for dynamic navbar updates)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    window.location.href = "/"; // ✅ Redirect to Home after logout
  };

  const isHomePage = location.pathname === "/";
  const isAdminCheckInPage = location.pathname === "/admin-check-in";

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li><Link to="/">Home</Link></li>

        {/* ✅ Show "Guest" link ONLY on the Home page */}
        {isHomePage && <li><Link to="/guest-check-in">Guest</Link></li>}

        {/* ✅ Show "Admin Sign In" link ONLY if NOT signed in */}
        {isHomePage && !isAdminAuthenticated && <li><Link to="/admin-sign-in">Admin</Link></li>}

        {/* ✅ Show these links ONLY on the Admin Check-In page */}
        {isAdminCheckInPage && (
          <>
            <li><Link to="/create-event">Create Event</Link></li>
            <li><Link to="/register-attendee">Pre-Event Registration</Link></li>
            <li><Link to="/test-qr">Generate QR Code</Link></li>
          </>
        )}
      </ul>

      {/* ✅ Sign Out button (Top Right Corner) ONLY when Admin is logged in */}
      {isAdminAuthenticated && (
        <button onClick={handleSignOut} className={styles.signOutButton}>Sign Out</button>
      )}
    </nav>
  );
};

export default Navbar;
