"use client";

import React from 'react';

const Measurement: React.FC = () => {
  // These values are fixed, so we just define them here
  const measurementValues = [80, 65, 90, 75, 85];

  return (
    <section id="measurement" className="measurement-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Measurement</h2>
      <p className="section-paragraph">
        This section provides a detailed overview of the key measurements involved in the Optimism Voting Strategy. Each measurement is represented by a fixed value that reflects its current state.
      </p>

      <div className="measurement-container">
        {measurementValues.map((value, index) => (
          <div className="box-pair" key={index}>
            <div className="slider-box">
              <label className="variable-title">Measurement {index + 1}</label>
              <input
                type="range"
                className="slider"
                min="0"
                max="100"
                value={value}
                readOnly /* Make the slider fixed */
              />
              <p className="slider-value">{value}</p>
            </div>
            <div className="info-box">
              <h3>Measurement {index + 1}</h3>
              <p>Brief explanation of what Measurement {index + 1} represents.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Measurement;
