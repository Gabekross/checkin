import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/events';
import { Link } from 'react-router-dom';
import styles from "../styles/Home.module.scss";

const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Welcome to Event Check-In System</h1>
      <p className={styles.description}>
        Manage event check-ins seamlessly. Admins can create events, register attendees, and track check-ins in real-time.
      </p>
      
      <div className={styles.buttonContainer}>
        <Link to="/admin-check-in" className={styles.button}>Admin Check-In</Link>
      </div>
      
      <h2 className={styles.title}>Upcoming Events</h2>
      <ul className={styles.eventList}>
        {events.map(event => (
          <li key={event.id} className={styles.eventItem}>
            <Link to={`/event/${event.id}`} className={styles.eventLink}>
              {event.name} - {new Date(event.date).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
