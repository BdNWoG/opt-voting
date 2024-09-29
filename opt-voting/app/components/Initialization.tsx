"use client";

import React, { useState } from 'react';

const Initialization: React.FC = () => {
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [votingPowerFile, setVotingPowerFile] = useState<File | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSimulate = async () => {
    if (!voterFile || !votingPowerFile) {
      alert("Please upload both CSV files.");
      return;
    }

    const formData = new FormData();
    formData.append('voterFile', voterFile);
    formData.append('votingPowerFile', votingPowerFile);

    setIsSimulating(true);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'simulation-result.csv'; // You can modify the file name as needed
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert('Simulation failed. Please check your files and try again.');
      }
    } catch (error) {
      console.error('Error during simulation:', error);
    } finally {
      setIsSimulating(false);
    }
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
            <label className="variable-title">Voter Preference</label>
            <input 
              type="file" 
              className="input-field" 
              accept=".csv" 
              onChange={(e) => handleFileChange(e, setVoterFile)} 
            />
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
            <input 
              type="file" 
              className="input-field" 
              accept=".csv" 
              onChange={(e) => handleFileChange(e, setVotingPowerFile)} 
            />
            <p className="instruction">Please upload a CSV file containing voting power data.</p>
          </div>
          <div className="info-box">
            <h3>Upload Voting Power Data</h3>
            <p>Brief explanation of what kind of data the CSV file should contain.</p>
          </div>
        </div>

        {/* Simulate Button */}
        <div className="simulate-button-container">
          <button 
            className="simulate-button" 
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            {isSimulating ? 'Simulating...' : 'Simulate!'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Initialization;
