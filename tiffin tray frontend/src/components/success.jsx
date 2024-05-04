// SuccessPage.js

import React from 'react';
import '../styles/SuccessPage.css';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="success-container">
      <div className="success-content">
        <h1>Success!</h1>
        <p>Your action was successful.</p>
    <Link to="/customer">Go Back</Link>
      </div>
    </div>
  );
};

export default SuccessPage;
