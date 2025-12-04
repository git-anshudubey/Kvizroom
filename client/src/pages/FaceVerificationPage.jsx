import React, { useRef, useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import Webcam from 'react-webcam';
import { useNavigate, useLocation } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import './FaceVerificationPage.css';

export default function FaceVerificationPage() {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  // Smooth scrolling
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Load models once
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        console.log("✅ Face-api.js models loaded");
        setLoading(false);
      } catch (err) {
        console.error("❌ Failed to load face-api models:", err);
        alert("Error loading face recognition models. Please refresh.");
      }
    };
    loadModels();
  }, []);

  const handleProceed = async () => {
    if (!webcamRef.current) return;
    setVerifying(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        alert("Unable to capture image from webcam.");
        setVerifying(false);
        return;
      }

      const img = await faceapi.fetchImage(imageSrc);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert('No face detected. Please try again.');
        setVerifying(false);
        return;
      }

      // Send descriptor to backend for verification
      const response = await fetch('/api/face/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          descriptor: Array.from(detection.descriptor),
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem(`verified-${testId}`, 'true');
        navigate(`/exam/${testId}`);
      } else {
        alert('Face verification failed. Please try again.');
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("An error occurred during face verification.");
    }

    setVerifying(false);
  };

  return (
    <div className="face-verification-container">
      <h2 className="face-title">Webcam Preview</h2>

      {loading ? (
        <p>Loading models...</p>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
      )}

      <button
        onClick={handleProceed}
        className="proceed-button"
        disabled={loading || verifying}
      >
        {verifying ? 'Verifying...' : 'Proceed to Test'}
      </button>
    </div>
  );
}
