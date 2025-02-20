import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminSignIn.module.scss";

const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Handle Admin Sign-In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    } else {
      navigate("/admin-check-in"); // ✅ Redirect to Admin Check-In after successful login
    }
  };

  // ✅ Handle Sign-Out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/"); // ✅ Redirect to Home after signing out
  };

  return (
    <div className={styles.adminSignInContainer}>
      <div className={styles.signInCard}>
        <h2 className={styles.title}>Admin Sign In</h2>

        {/* Sign-In Form */}
        <form onSubmit={handleSignIn}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.button}>Sign In</button>
        </form>

        {/* Error Message */}
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        {/* Sign-Out Button */}
        <button onClick={handleSignOut} className={`${styles.button} ${styles.signOutButton}`}>Sign Out</button>
      </div>
    </div>
  );
};

export default AdminSignIn;
