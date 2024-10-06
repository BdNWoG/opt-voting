'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';  // Import PapaParse for CSV parsing

// Helper function to generate random data
const generateRandomData = (rows: number, cols: number, distribution: 'uniform' | 'gaussian') => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      if (distribution === 'uniform') {
        row.push(Math.random().toFixed(2)); // Generate uniform random number
      } else if (distribution === 'gaussian') {
        // Generate Gaussian random number using Box-Muller transform
        let u1 = Math.random();
        let u2 = Math.random();
        let randGaussian = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        randGaussian = Math.max(0, Math.min(1, randGaussian)); // Clamping between 0 and 1
        row.push(randGaussian.toFixed(2));
      }
    }
    data.push(row);
  }
  return data;
};

// Function to convert random data into CSV string format
const convertToCSV = (data: any[]) => {
  return Papa.unparse(data);
};

const Initialization: React.FC<{ setVotingResults: (data: any) => void }> = ({ setVotingResults }) => {
  const [voterFile, setVoterFile] = useState<File | null>(null);
  const [votingPowerFile, setVotingPowerFile] = useState<File | null>(null);
  const [voterSource, setVoterSource] = useState('upload'); // For voters
  const [votingPowerSource, setVotingPowerSource] = useState('upload'); // For voting power
  const [voterDistribution, setVoterDistribution] = useState<'uniform' | 'gaussian'>('uniform');
  const [powerDistribution, setPowerDistribution] = useState<'uniform' | 'gaussian'>('uniform');
  const [loading, setLoading] = useState(false);

  // Function to handle file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Function to simulate or generate data
  const handleSimulate = async () => {
    setLoading(true);

    let voterData = '';
    let votingPowerData = '';

    if (voterSource === 'generate') {
      const randomVoterData = generateRandomData(100, 5, voterDistribution); // Generating 100 voters with 5 projects
      voterData = convertToCSV(randomVoterData);
    }

    if (votingPowerSource === 'generate') {
      const randomVotingPowerData = generateRandomData(100, 1, powerDistribution); // 100 voters with 1 power
      votingPowerData = convertToCSV(randomVotingPowerData);
    }

    if (voterSource === 'upload' && !voterFile) {
      alert('Please upload the voter preferences file.');
      setLoading(false);
      return;
    }

    if (votingPowerSource === 'upload' && !votingPowerFile) {
      alert('Please upload the voting power file.');
      setLoading(false);
      return;
    }

    const formData = new FormData();

    if (voterSource === 'upload') {
      formData.append('voterFile', voterFile!);
    } else {
      const blob = new Blob([voterData], { type: 'text/csv' });
      formData.append('voterFile', blob, 'voter_preferences.csv');
    }

    if (votingPowerSource === 'upload') {
      formData.append('votingPowerFile', votingPowerFile!);
    } else {
      const blob = new Blob([votingPowerData], { type: 'text/csv' });
      formData.append('votingPowerFile', blob, 'voting_power.csv');
    }

    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to simulate');
      }

      const blobResponse = await response.blob();
      const csvText = await blobResponse.text(); // Convert blob to text

      // Parse the CSV to update the voting results state
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const parsedResults: any = {};
          results.data.forEach((row: any) => {
            const mechanism = row.Mechanism;
            const project = row.Project;
            const votes = parseFloat(row.Votes);
            if (!parsedResults[mechanism]) {
              parsedResults[mechanism] = {};
            }
            parsedResults[mechanism][project] = votes;
          });
          setVotingResults(parsedResults);
        },
      });

      // Automatically trigger the download of the CSV file
      const url = window.URL.createObjectURL(blobResponse);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'voting_results.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error in simulation:', error);
    }

    setLoading(false);
  };

  return (
    <section id="initialization" className="initialization-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Initialization</h2>
      <p className="section-paragraph">
        This section provides the initial setup for the Optimism Voting Strategy. Below, you can upload CSV files or generate random data for voter preferences and voting power.
      </p>

      {/* Voter Preferences */}
      <div className="box-pair">
        <div className="input-box">
          <label className="variable-title">Voter Preferences</label>
          <select value={voterSource} onChange={(e) => setVoterSource(e.target.value)}>
            <option value="upload">Upload CSV</option>
            <option value="generate">Generate Random Data</option>
          </select>

          {voterSource === 'upload' ? (
            <>
              <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVoterFile)} />
              <p className="instruction">Please upload a CSV file containing voting preference data.</p>
            </>
          ) : (
            <>
              <select value={voterDistribution} onChange={(e) => setVoterDistribution(e.target.value as 'uniform' | 'gaussian')}>
                <option value="uniform">Uniform Distribution</option>
                <option value="gaussian">Gaussian Distribution</option>
              </select>
              <p className="instruction">Random data will be generated using the selected distribution.</p>
            </>
          )}
        </div>
      </div>

      {/* Voting Power */}
      <div className="box-pair">
        <div className="input-box">
          <label className="variable-title">Voting Power</label>
          <select value={votingPowerSource} onChange={(e) => setVotingPowerSource(e.target.value)}>
            <option value="upload">Upload CSV</option>
            <option value="generate">Generate Random Data</option>
          </select>

          {votingPowerSource === 'upload' ? (
            <>
              <input type="file" className="input-field" accept=".csv" onChange={(e) => handleFileUpload(e, setVotingPowerFile)} />
              <p className="instruction">Please upload a CSV file containing voting power data.</p>
            </>
          ) : (
            <>
              <select value={powerDistribution} onChange={(e) => setPowerDistribution(e.target.value as 'uniform' | 'gaussian')}>
                <option value="uniform">Uniform Distribution</option>
                <option value="gaussian">Gaussian Distribution</option>
              </select>
              <p className="instruction">Random data will be generated using the selected distribution.</p>
            </>
          )}
        </div>
      </div>

      {/* Simulate Button */}
      <div className="simulate-button-container">
        <button className="simulate-button" onClick={handleSimulate} disabled={loading}>
          {loading ? 'Simulating...' : 'Simulate'}
        </button>
      </div>
    </section>
  );
};

export default Initialization;
