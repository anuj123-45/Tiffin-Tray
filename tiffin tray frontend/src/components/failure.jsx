// FailedPage.js

import React from 'react';
import '../styles/FailedPage.css';
import { Link } from 'react-router-dom';

const FailedPage = () => {
  return (
    <div className="failed-container">
      <div className="failed-content">
        <h1>Oops!</h1>
        <p>Something went wrong.</p>
        <Link to="/customer">Go Back</Link>
      </div>
    </div>
  );
};

export default FailedPage;
