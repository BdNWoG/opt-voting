"use client";

import React, { useEffect, useState } from 'react';

interface VotingResults {
  [key: string]: { [project: string]: number };
}

interface MeasurementProps {
  votingResults: VotingResults | null;
}

const Measurement: React.FC<MeasurementProps> = ({ votingResults }) => {
  const [projectWinnersCount, setProjectWinnersCount] = useState(0);
  const [quadraticVoterAttackDifference, setQuadraticVoterAttackDifference] = useState(0);
  const [quadraticProjectAttackDifference, setQuadraticProjectAttackDifference] = useState(0);
  const [meanVoterAttackDifference, setMeanVoterAttackDifference] = useState(0);
  const [meanProjectAttackDifference, setMeanProjectAttackDifference] = useState(0);

  useEffect(() => {
    if (!votingResults) return;

    // 1. Calculate the number of different project winners
    const winnerSet = new Set<string>();
    const mechanisms = ['maxVotingResults', 'quadraticNoAttackResults', 'meanNoAttackResults', 'quadraticVoterCollusionResults', 'quadraticProjectCollusionResults', 'meanVoterEpsilonResults', 'meanProjectEpsilonResults', 'trueVotingResults'];

    mechanisms.forEach((mechanism) => {
      const data = votingResults[mechanism];
      if (data) {
        const maxVotes = Math.max(...Object.values(data));
        const winner = Object.keys(data).find((project) => data[project] === maxVotes);
        if (winner) {
          winnerSet.add(winner); // Add winner to the set
        }
      }
    });

    setProjectWinnersCount(winnerSet.size);

    // 2. Calculate percentage difference between Quadratic Voting and Voter Attack
    setQuadraticVoterAttackDifference(calculatePercentageDifference(votingResults['quadraticNoAttackResults'], votingResults['quadraticVoterCollusionResults']));

    // 3. Calculate percentage difference between Quadratic Voting and Project Attack
    setQuadraticProjectAttackDifference(calculatePercentageDifference(votingResults['quadraticNoAttackResults'], votingResults['quadraticProjectCollusionResults']));

    // 4. Calculate percentage difference between Mean Voting and Voter Attack
    setMeanVoterAttackDifference(calculatePercentageDifference(votingResults['meanNoAttackResults'], votingResults['meanVoterEpsilonResults']));

    // 5. Calculate percentage difference between Mean Voting and Project Attack
    setMeanProjectAttackDifference(calculatePercentageDifference(votingResults['meanNoAttackResults'], votingResults['meanProjectEpsilonResults']));

  }, [votingResults]);

  const calculatePercentageDifference = (noAttackData: { [project: string]: number }, attackData: { [project: string]: number }): number => {
    if (!noAttackData || !attackData) return 0;
  
    let totalSquaredDifference = 0;
    let totalSquaredOriginal = 0;
  
    Object.keys(noAttackData).forEach((project) => {
      const noAttackVotes = noAttackData[project] || 0;
      const attackVotes = attackData[project] || 0;
  
      if (noAttackVotes === 0) {
        // If there are no votes in the no-attack scenario, skip this project
        return;
      }
  
      // Convert raw vote counts to percentages
      const noAttackPercentage = noAttackVotes / Object.values(noAttackData).reduce((a, b) => a + b, 0) * 100;
      const attackPercentage = attackVotes / Object.values(attackData).reduce((a, b) => a + b, 0) * 100;
  
      // Square the difference in percentage and sum it
      const percentageDifference = Math.abs(noAttackPercentage - attackPercentage);
      totalSquaredDifference += Math.pow(percentageDifference, 2);
  
      // Sum of the squared original vote percentages
      totalSquaredOriginal += Math.pow(noAttackPercentage, 2);
    });
  
    if (totalSquaredOriginal === 0) return 0; // Avoid division by zero
  
    // Final result: (Sum of squared differences) / (Sum of squared original percentages)
    return totalSquaredDifference / totalSquaredOriginal * 100;
  };

  const measurementValues = [
    { 
      label: 'Number of Different Project Winners', 
      value: projectWinnersCount, 
      max: 8,
      explanation: 'This represents the number of distinct project winners across the 8 voting mechanisms. It shows how varied the winning projects are across different voting systems.'
    },
    // Quadratic Voting Section
    { 
      label: 'Difference between Quadratic Voting and Voter Attack', 
      value: quadraticVoterAttackDifference, 
      max: 100,
      explanation: 'This percentage measures how much voter collusion (or attack) in quadratic voting changed the vote totals for projects compared to normal quadratic voting.'
    },
    { 
      label: 'Difference between Quadratic Voting and Project Attack', 
      value: quadraticProjectAttackDifference, 
      max: 100,
      explanation: 'This percentage reflects the impact of project collusion in quadratic voting. It compares the changes in vote totals caused by project-level manipulation.'
    },
    // Mean Voting Section
    { 
      label: 'Difference between Mean Voting and Voter Attack', 
      value: meanVoterAttackDifference, 
      max: 100,
      explanation: 'This shows how voter collusion (or attack) affected the vote totals under the mean voting mechanism. A higher percentage indicates more influence from voter collusion.'
    },
    { 
      label: 'Difference between Mean Voting and Project Attack', 
      value: meanProjectAttackDifference, 
      max: 100,
      explanation: 'This percentage measures the impact of project-level manipulation in mean voting. It shows the extent to which project collusion altered the vote results.'
    },
  ];

  return (
    <section id="measurement" className="measurement-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Measurement</h2>
      <p className="section-paragraph">
        This section provides a detailed overview of the key measurements involved in the Optimism Voting Strategy.
      </p>

      <div className="table-container">
        <table className="measurement-table">
          <thead>
            <tr>
              <th>Measurement</th>
              <th>Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {measurementValues.map((measurement, index) => (
              <tr key={index}>
                <td>{measurement.label}</td>
                <td className="value-cell">{measurement.value.toFixed(2)}</td>
                <td>{measurement.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow-x: auto;
          margin: 20px 0;
        }
        
        .measurement-table {
          width: 100%;
          border-collapse: collapse;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .measurement-table th,
        .measurement-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        
        .measurement-table th {
          background-color: #f5f5f5;
          font-weight: 600;
        }
        
        .value-cell {
          font-family: monospace;
          font-weight: 500;
        }
        
        .measurement-table tr:hover {
          background-color: #f8f8f8;
        }
      `}</style>
    </section>
  );
};

export default Measurement;
