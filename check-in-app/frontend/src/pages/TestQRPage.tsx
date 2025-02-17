import React, { useEffect } from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const TestQRPage: React.FC = () => {
  const testEventId = "24b6001d-cbdf-4a3a-97a4-59964bf36c88"; // Replace with a real event ID from Supabase

  useEffect(() => {
    console.log("TestQRPage is rendering...");
  }, []);
  return (
    <div>
      <h2>Test QR Code</h2>
      <p>TestQRPage is loaded</p>
      <QRCodeGenerator eventId={testEventId} />
    </div>
  );
};

export default TestQRPage;
