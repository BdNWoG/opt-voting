"use client";

import React, { useState } from 'react';
import Papa from 'papaparse';  // Import PapaParse for CSV parsing

const Initialization: React.FC<{ setVotingResults: (data: any) => void }> = ({ setVotingResults }) => {
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
      console.log("Starting simulation...");
  
      const response = await fetch('/api/simulate', {
        method: 'POST',
        body: formData,
      });
  
      console.log("Response received:", response);
  
      if (!response.ok) {
        throw new Error('Failed to simulate');
      }
  
      // Handle CSV Blob response
      const blobResponse = await response.blob();
      const csvText = await blobResponse.text(); // Convert blob to text
  
      console.log("Fetched CSV Response:", csvText);
  
      // Parse CSV using PapaParse
      Papa.parse(csvText, {
        header: true, // Assumes the first row contains headers
        complete: (results) => {
          console.log('Parsed CSV:', results.data);
  
          // Initialize an empty object to hold all mechanisms and projects
          const parsedResults: any = {};
  
          results.data.forEach((row: any) => {
            const mechanism = row.Mechanism;
            const project = row.Project;
            const votes = parseFloat(row.Votes);
  
            // If this mechanism doesn't exist in parsedResults, initialize it
            if (!parsedResults[mechanism]) {
              parsedResults[mechanism] = {};
            }
  
            // Add the votes for each project under the respective mechanism
            parsedResults[mechanism][project] = votes;
          });
  
          console.log("Parsed Voting Results for Charts:", parsedResults);
  
          // Update state with parsed data
          setVotingResults(parsedResults); // Pass the parsed CSV results
        },
      });
  
      // Handle file download for CSV
      const url = window.URL.createObjectURL(blobResponse);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voting_results.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      console.log("CSV file download triggered.");
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
