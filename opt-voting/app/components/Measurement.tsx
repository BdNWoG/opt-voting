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

    let totalDifference = 0;
    let totalVotes = 0;

    Object.keys(noAttackData).forEach((project) => {
      const noAttackVotes = noAttackData[project] || 0;
      const attackVotes = attackData[project] || 0;
      totalDifference += Math.abs(noAttackVotes - attackVotes);
      totalVotes += noAttackVotes;
    });

    if (totalVotes === 0) return 0; // Avoid division by zero
    return (totalDifference / totalVotes) * 100;
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
        This section provides a detailed overview of the key measurements involved in the Optimism Voting Strategy. Each measurement is represented by a value that reflects its current state.
      </p>

      <div className="measurement-container">
        {measurementValues.map((measurement, index) => (
          <div className="box-pair" key={index}>
            <div className="slider-box">
              <label className="variable-title">{measurement.label}</label>
              <input
                type="range"
                className="slider"
                min="0"
                max={measurement.max}
                value={measurement.value}
                readOnly /* Make the slider fixed */
              />
              <p className="slider-value">{measurement.value.toFixed(2)}</p>
            </div>
            <div className="info-box">
              <h3>{measurement.label}</h3>
              <p>{measurement.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Measurement;
