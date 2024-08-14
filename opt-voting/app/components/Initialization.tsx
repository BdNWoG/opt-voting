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
        {/* Input and Slider Boxes with Information Side by Side */}
        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Variable 1</label>
            <input type="number" className="input-field" placeholder="Enter a number" />
            <p className="instruction">Enter a number to the input field</p>
          </div>
          <div className="info-box">
            <h3>Variable 1</h3>
            <p>Brief explanation of what Variable 1 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Variable 2</label>
            <input type="number" className="input-field" placeholder="Enter a number" />
            <p className="instruction">Enter a number to the input field</p>
          </div>
          <div className="info-box">
            <h3>Variable 2</h3>
            <p>Brief explanation of what Variable 2 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Variable 3</label>
            <input type="number" className="input-field" placeholder="Enter a number" />
            <p className="instruction">Enter a number to the input field</p>
          </div>
          <div className="info-box">
            <h3>Variable 3</h3>
            <p>Brief explanation of what Variable 3 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="slider-box">
            <label className="variable-title">Variable 4</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={sliderValues[0]}
              onChange={(e) => handleSliderChange(0, Number(e.target.value))}
            />
            <p className="slider-value">{sliderValues[0]}</p>
          </div>
          <div className="info-box">
            <h3>Variable 4</h3>
            <p>Brief explanation of what Variable 4 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="slider-box">
            <label className="variable-title">Variable 5</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={sliderValues[1]}
              onChange={(e) => handleSliderChange(1, Number(e.target.value))}
            />
            <p className="slider-value">{sliderValues[1]}</p>
          </div>
          <div className="info-box">
            <h3>Variable 5</h3>
            <p>Brief explanation of what Variable 5 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="slider-box">
            <label className="variable-title">Variable 6</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={sliderValues[2]}
              onChange={(e) => handleSliderChange(2, Number(e.target.value))}
            />
            <p className="slider-value">{sliderValues[2]}</p>
          </div>
          <div className="info-box">
            <h3>Variable 6</h3>
            <p>Brief explanation of what Variable 6 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="slider-box">
            <label className="variable-title">Variable 7</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={sliderValues[3]}
              onChange={(e) => handleSliderChange(3, Number(e.target.value))}
            />
            <p className="slider-value">{sliderValues[3]}</p>
          </div>
          <div className="info-box">
            <h3>Variable 7</h3>
            <p>Brief explanation of what Variable 7 is.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="slider-box">
            <label className="variable-title">Variable 8</label>
            <input
              type="range"
              className="slider"
              min="0"
              max="100"
              value={sliderValues[4]}
              onChange={(e) => handleSliderChange(4, Number(e.target.value))}
            />
            <p className="slider-value">{sliderValues[4]}</p>
          </div>
          <div className="info-box">
            <h3>Variable 8</h3>
            <p>Brief explanation of what Variable 8 is.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Initialization;
