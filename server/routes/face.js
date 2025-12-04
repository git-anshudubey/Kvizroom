const express = require('express');
const router = express.Router();

// Temporary — replace with actual stored descriptor for the user
const registeredFaceDescriptor = [
  // Example descriptor array of 128 floats
];

// POST /api/face/verify
router.post('/verify', (req, res) => {
  try {
    const { descriptor, testId } = req.body;

    if (!descriptor || !testId) {
      return res.status(400).json({
        success: false,
        message: 'Missing descriptor or testId',
      });
    }

    // Compare with stored descriptor (Euclidean distance)
    const distance = euclideanDistance(descriptor, registeredFaceDescriptor);
    const isMatch = distance < 0.6; // 0.6 is common threshold

    return res.json({ success: isMatch });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during face verification',
    });
  }
});

// Helper to compare descriptors
function euclideanDistance(arr1, arr2) {
  return Math.sqrt(arr1.reduce((sum, val, i) => sum + (val - arr2[i]) ** 2, 0));
}

module.exports = router;
