import React, { useRef, useState, useEffect } from 'react';
import Button from "react-bootstrap/Button";
const CameraComponent = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onCapture({
        name: `captured_image_${Date.now()}.png`,
        image: dataUrl.split(",")[1],
      });
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div>
      <Button variant='danger' onClick={startCamera} disabled={isCameraOn}>Open Camera</Button>
      <Button  variant='success' onClick={takePicture} disabled={!isCameraOn}>Take Picture</Button>
      <div>
        <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto', display: isCameraOn ? 'block' : 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
      </div>
    </div>
  );
};

export default CameraComponent;
