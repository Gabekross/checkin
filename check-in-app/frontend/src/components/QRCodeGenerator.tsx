// Step 2: Generate Universal QR Code (frontend/src/components/QRCodeGenerator.tsx)

import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator: React.FC<{ eventId: string }> = ({ eventId }) => {

  useEffect(() => {
    console.log("QRCodeGenerator is rendering with eventId:", eventId);
  }, [eventId]);

  if (!eventId) {


    return <p>Error: No Event ID Provided</p>;
  }

  const checkInUrl = `${window.location.origin}/self-check-in/${eventId}`;

  return (
    <div>
      <h2>Scan to Check-In</h2>
      <QRCodeSVG value={checkInUrl} size={256} level="H" />
      <p>Scan this QR code to check in.</p>
    </div>
  );
};

export default QRCodeGenerator;
export {}