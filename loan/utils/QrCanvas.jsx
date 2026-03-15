
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

const QrCanvas = ({ text }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCode.toCanvas(canvasRef.current, text, {
        width: 160,
        margin: 1,
      }, (error) => {
        if (error) console.error('QR Code error:', error);
      });
    }
  }, [text]);

  return (
    <canvas
      id="qrcode"
      ref={canvasRef}
      width={160}
      height={160}
      style={{ width: '160px', height: '160px' }}
    />
  );
};

export default QrCanvas;