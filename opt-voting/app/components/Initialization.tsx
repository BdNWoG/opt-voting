"use client";

import React, { useState } from 'react';

const Initialization: React.FC = () => {
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [votingPowerFile, setVotingPowerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSimulate = async () => {
    if (!voterFile || !votingPowerFile) {
      alert("Please upload both voter and voting power files.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('voterFile', voterFile);
    formData.append('votingPowerFile', votingPowerFile);

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Simulation results:', data);
      
      // Trigger chart update with voting results here (pass data to Results component)
      // You can use a state or context to update charts in Results.tsx
      // e.g., setVotingResults(data);

    } catch (error) {
      console.error('Error in simulation:', error);
    }

    setLoading(false);
  };

  return (
    <section id="initialization" className="initialization-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Initialization</h2>
      <p className="section-paragraph">
        This section provides the initial setup for the Optimism Voting Strategy. Below, you can upload CSV files for voter preferences and voting power.
      </p>

      <div className="initialization-container">
        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Voter Preferences</label>
            <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVoterFile)} />
            <p className="instruction">Please upload a CSV file containing voting preference data.</p>
          </div>
          <div className="info-box">
            <h3>Upload Voter Preferences</h3>
            <p>The file should contain rows for voters and columns for projects, with values between 0 and 1 representing their preference for each project.</p>
          </div>
        </div>

        <div className="box-pair">
          <div className="input-box">
            <label className="variable-title">Voting Power</label>
            <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVotingPowerFile)} />
            <p className="instruction">Please upload a CSV file containing voting power data.</p>
          </div>
          <div className="info-box">
            <h3>Upload Voting Power Data</h3>
            <p>The file should contain rows for voters and a column for voting power.</p>
          </div>
        </div>

        <div className="simulate-button-container">
          <button className="simulate-button" onClick={handleSimulate} disabled={loading}>
            {loading ? 'Simulating...' : 'Simulate'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Initialization;
