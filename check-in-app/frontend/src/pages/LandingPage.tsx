import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/LandingPage.module.scss";

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <header className={styles.heroSection}>
        <h1>Seamless Event Check-Ins</h1>
        <p>Effortless guest management for all your events.</p>
        <Link to="/admin-sign-in" className={styles.ctaButton}>
          Get Started
        </Link>
      </header>

      {/* Key Features */}
      <section className={styles.featuresSection}>
        <h2>Key Features</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>✅ Pre-Event Registration</div>
          <div className={styles.featureCard}>✅ Generate QR Code for Event</div>
          <div className={styles.featureCard}>✅ Self Check-In & Walk-In Registration</div>
          <div className={styles.featureCard}>✅ Admin Walk-In Registration</div>
          <div className={styles.featureCard}>✅ Geofenced Check-Ins</div>
          <div className={styles.featureCard}>✅ Real-Time Analytics</div>
          <div className={styles.featureCard}>✅ Attendance Reports & CSV Export</div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorksSection}>
        <h2>How It Works</h2>
        <ol>
          <li>Create an event & upload an image & Generate QR Code for event.</li>
          <li>Pre-register guests prior to event day.</li>
          <li>Name-based check-in.</li>
          <li>Walk-In registration</li>
          <li>Track attendance in real-time.</li>
          <li>Export reports for event insights.</li>
        </ol>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseSection}>
        <h2>Why Choose Our System?</h2>
        <ul>
          <li>🔹 Save Time – Reduce long check-in lines.</li>
          <li>🔹 Enhance Security – QR & Geofenced access.</li>
          <li>🔹 Gain Insights – View real-time analytics.</li>
          <li>🔹 Boost Experience – Smooth event entry.</li>
        </ul>
      </section>

      {/* Target Audience */}
      <section className={styles.targetAudienceSection}>
        <h2>Perfect for:</h2>
        <p>✔ Conferences & Corporate Events</p>
        <p>✔ Weddings & Private Gatherings</p>
        <p>✔ Church Services & Community Events</p>
        <p>✔ Trade Shows, Music & Entertainment</p>
      </section>

      {/* Call to Action */}
      <footer className={styles.ctaSection}>
        <h2>Get Started Today!</h2>
        <p>Sign up now and experience hassle-free event check-ins.</p>
        <Link to="/admin-sign-in" className={styles.ctaButton}>
          Start Now
        </Link>
      </footer>
    </div>
  );
};

export default LandingPage;
