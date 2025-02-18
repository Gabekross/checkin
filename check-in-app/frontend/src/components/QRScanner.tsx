// QR Code Scanner Component (frontend/src/components/QRScanner.tsx)
import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner: React.FC<{ onScanSuccess: (decodedText: string) => void }> = ({ onScanSuccess }) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false // Adding the verbose parameter
    );QRScanner

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear();
      },
      (errorMessage) => {
        console.warn("QR Scan failed: ", errorMessage);
      }
    );

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" ref={scannerRef} />;
};

export default QRScanner;