import React from 'react';

import './ErrorCode.css'

const ErrorCode = () => {
  return (
    <div className='error-message'>
      <h1>404: Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
};

export default ErrorCode;