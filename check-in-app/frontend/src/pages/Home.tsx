import React from 'react';
import { Link } from 'react-router-dom';
import styles from "../styles/Home.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Welcome to EasyCheckIn</h1>
      <p className={styles.description}>
        Seamlessly check into your event. Whether you're a guest or an admin, get started below.
      </p>
      
      <div className={styles.buttonContainer}>
        <Link to="/guest-check-in" className={styles.guestButton}>Guest Check-In</Link>
        <Link to="/admin-sign-in" className={styles.adminButton}>Admin Sign-In</Link>
      </div>
    </div>
  );
};

export default Home;
