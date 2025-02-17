import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/events';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <Link to="/create-event">Create Event</Link>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>{event.name} - {new Date(event.date).toLocaleDateString()}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;