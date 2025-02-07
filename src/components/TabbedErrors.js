// src/TabbedErrors.js

import React, { useState } from 'react';

const TabbedErrors = ({ tabs, errors }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`tab ${activeTab === index ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        <ul>
          {errors[activeTab]?.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TabbedErrors;
