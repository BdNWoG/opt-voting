"use client";

import React, { useEffect } from 'react';
import { Bar, Pie, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

interface VotingResults {
  [key: string]: { [project: string]: number };
}

const Results: React.FC<{ votingResults: VotingResults | null }> = ({ votingResults }) => {
  useEffect(() => {
    console.log('Voting results updated in Results component:', votingResults); // Check if results are passed
  }, [votingResults]);

  // Placeholder data if no votingResults yet
  const placeholderData = {
    labels: ['Placeholder Project 1', 'Placeholder Project 2', 'Placeholder Project 3'],
    datasets: [
      {
        label: 'Votes',
        data: [20, 30, 50],
        backgroundColor: ['rgba(230, 57, 70, 0.6)', 'rgba(34, 202, 236, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: '#e63946',
        borderWidth: 1,
      },
    ],
  };

  const votingMechanisms = [
    'maxVotingResults',
    'quadraticNoAttackResults',
    'meanNoAttackResults',
    'quadraticVoterCollusionResults',
    'quadraticProjectCollusionResults',
    'meanVoterEpsilonResults',
    'meanProjectEpsilonResults',
    'trueVotingResults'
  ];

  const generateChartData = (data: { [project: string]: number }) => {
    const labels = Object.keys(data);
    const values = Object.values(data);

    return {
      labels,
      datasets: [
        {
          label: 'Votes',
          data: values,
          backgroundColor: [
            'rgba(230, 57, 70, 0.6)',
            'rgba(34, 202, 236, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: '#e63946',
          borderWidth: 1,
        },
      ],
    };
  };

  const chartPairs = votingMechanisms.map((mechanism) => {
    const data = votingResults?.[mechanism] || {}; // Use empty object if no data
    const hasData = Object.keys(data).length > 0;

    const barChartData = hasData ? generateChartData(data) : placeholderData;
    const pieChartData = hasData ? generateChartData(data) : placeholderData;

    return (
      <React.Fragment key={mechanism}>
        <div className="result-box">
          <Bar data={barChartData} />
        </div>
        <div className="result-box">
          <Pie data={pieChartData} />
        </div>
      </React.Fragment>
    );
  });

  const scatterChartData1 = {
    datasets: [
      {
        label: 'Scatter Data 1',
        data: [
          { x: 10, y: 20 },
          { x: 20, y: 30 },
          { x: 30, y: 10 },
        ],
        backgroundColor: 'rgba(230, 57, 70, 0.6)',
      },
    ],
  };

  const scatterChartData2 = {
    datasets: [
      {
        label: 'Scatter Data 2',
        data: [
          { x: 15, y: 25 },
          { x: 25, y: 35 },
          { x: 35, y: 15 },
        ],
        backgroundColor: 'rgba(34, 202, 236, 0.6)',
      },
    ],
  };

  const generateDynamicText = () => {
    if (!votingResults) {
      return 'Currently displaying placeholder data. Once the actual voting results are available, they will be shown here.';
    }

    const summaries = votingMechanisms.map((mechanism, index) => {
      const data = votingResults?.[mechanism];
      if (!data || Object.keys(data).length === 0) return `Mechanism ${index + 1}: No data available.`;

      const totalVotes = Object.values(data).reduce((a, b) => a + b, 0);
      const maxVotes = Math.max(...Object.values(data));
      const maxProject = Object.keys(data)[Object.values(data).indexOf(maxVotes)];

      return `Mechanism ${index + 1}: Total votes: ${totalVotes}, Highest votes received by ${maxProject} (${maxVotes} votes).`;
    });

    return summaries.join(' ');
  };

  return (
    <section id="results" className="results-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Results</h2>
      <p className="section-paragraph">
        This section presents the results of the Optimism Voting Strategy analysis. The following charts and graphs provide a detailed breakdown of key metrics and insights derived from the data.
      </p>

      <div className="results-grid">
        {/* Generate the 8 pairs of bar charts and pie charts */}
        {chartPairs}

        {/* Scatter plots */}
        <div className="result-box">
          <Scatter data={scatterChartData1} />
        </div>
        <div className="result-box">
          <Scatter data={scatterChartData2} />
        </div>
      </div>

      <p className="dynamic-paragraph">
        {generateDynamicText()}
      </p>
    </section>
  );
};

export default Results;
