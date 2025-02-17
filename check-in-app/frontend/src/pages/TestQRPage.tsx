import React, { useEffect } from 'react';
import QRCodeGenerator from '../components/QRCodeGenerator';

const TestQRPage: React.FC = () => {
  const testEventId = "0f416d7e-d345-40c9-8c39-b0edd6fc799b"; // Replace with a real event ID from Supabase

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
