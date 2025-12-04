import React from 'react';

const PrivateExamRoute = ({ children }) => {
  // Always allow exam access
  return children;
};

export default PrivateExamRoute;
