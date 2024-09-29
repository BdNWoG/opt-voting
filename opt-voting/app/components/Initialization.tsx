"use client";

import React, { useState } from 'react';

const Initialization: React.FC = () => {
  const [sliderValues, setSliderValues] = useState([50, 50, 50, 50, 50]);

  const handleSliderChange = (index: number, value: number) => {
    const newValues = [...sliderValues];
    newValues[index] = value;
    setSliderValues(newValues);
  };

  return (
    <section id="initialization" className="initialization-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Initialization</h2>
      <p className="section-paragraph">
        This section provides the initial setup for the Optimism Voting Strategy. Below, you can interact with various settings to customize the simulation.
      </p>

      <div className="initialization-container">
        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Voting Algorithm</label>
            <select className="input-field">
              <option value="">Select a voting algorithm</option>
              <option value="option1">Max Voting</option>
              <option value="option2">Quadratic Voting</option>
              <option value="option3">Mean Voting</option>
            </select>
            <p className="instruction">Select an option from the dropdown menu</p>
          </div>
          <div className="info-box">
            <h3>Voting Algorithms</h3>
            <p>Different voting algorithms.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Attack Enabled?</label>
            <select className="input-field">
              <option value="">Select an attack option</option>
              <option value="option1">Attack Enabled</option>
              <option value="option2">Attack Disabled</option>
            </select>
            <p className="instruction">Select an option from the dropdown menu</p>
          </div>
          <div className="info-box">
            <h3>Attack Enabled?</h3>
            <p>Brief explanation.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Voter Preference</label>
            <input type="file" className="input-field" accept=".csv" />
            <p className="instruction">Please upload a CSV file containing voting preference data.</p>
          </div>
          <div className="info-box">
            <h3>Upload Preference Data</h3>
            <p>Brief explanation of what kind of data the CSV file should contain.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Voting Power</label>
            <input type="file" className="input-field" accept=".csv" />
            <p className="instruction">Please upload a CSV file containing voting power data.</p>
          </div>
          <div className="info-box">
            <h3>Upload Voting Power Data</h3>
            <p>Brief explanation of what kind of data the CSV file should contain.</p>
          </div>
        </div>

        {/* Simulate Button */}
        <div className="simulate-button-container">
          <button className="simulate-button">Simulate!</button>
        </div>
      </div>
    </section>
  );
};

export default Initialization;
