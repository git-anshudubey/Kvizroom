import React from 'react';

const PrivateRoute = ({ children }) => {
  // Always allow access
  return children;
};

export default PrivateRoute;
