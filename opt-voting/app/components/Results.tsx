"use client";

import React from 'react';
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

const Results: React.FC = () => {
  // Placeholder data for each bar chart
  const barChartData1 = {
    labels: ['Category 1', 'Category 2', 'Category 3'],
    datasets: [
      {
        label: 'Votes',
        data: [12, 19, 3],
        backgroundColor: 'rgba(230, 57, 70, 0.6)',
        borderColor: '#e63946',
        borderWidth: 1,
      },
    ],
  };

  const barChartData2 = {
    labels: ['Category A', 'Category B', 'Category C'],
    datasets: [
      {
        label: 'Votes',
        data: [20, 10, 15],
        backgroundColor: 'rgba(34, 202, 236, 0.6)',
        borderColor: '#22caec',
        borderWidth: 1,
      },
    ],
  };

  const barChartData3 = {
    labels: ['Segment X', 'Segment Y', 'Segment Z'],
    datasets: [
      {
        label: 'Votes',
        data: [8, 14, 18],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: '#36a2eb',
        borderWidth: 1,
      },
    ],
  };

  const barChartData4 = {
    labels: ['Item 1', 'Item 2', 'Item 3'],
    datasets: [
      {
        label: 'Votes',
        data: [25, 5, 20],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: '#4bc0c0',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Option A', 'Option B', 'Option C'],
    datasets: [
      {
        label: 'Distribution',
        data: [10, 20, 30],
        backgroundColor: [
          'rgba(230, 57, 70, 0.6)',
          'rgba(34, 202, 236, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: '#e63946',
        borderWidth: 1,
      },
    ],
  };

  const scatterChartData = {
    datasets: [
      {
        label: 'Scatter Data',
        data: [
          { x: 10, y: 20 },
          { x: 20, y: 30 },
          { x: 30, y: 10 },
        ],
        backgroundColor: 'rgba(230, 57, 70, 0.6)',
      },
    ],
  };

  // Generate dynamic text based on data
  const generateDynamicText = () => {
    const totalVotes1 = barChartData1.datasets[0].data.reduce((a, b) => a + b, 0);
    const maxVotes1 = Math.max(...barChartData1.datasets[0].data);
    const maxCategory1 = barChartData1.labels[barChartData1.datasets[0].data.indexOf(maxVotes1)];

    const totalVotes2 = barChartData2.datasets[0].data.reduce((a, b) => a + b, 0);
    const maxVotes2 = Math.max(...barChartData2.datasets[0].data);
    const maxCategory2 = barChartData2.labels[barChartData2.datasets[0].data.indexOf(maxVotes2)];

    const totalVotes3 = barChartData3.datasets[0].data.reduce((a, b) => a + b, 0);
    const maxVotes3 = Math.max(...barChartData3.datasets[0].data);
    const maxCategory3 = barChartData3.labels[barChartData3.datasets[0].data.indexOf(maxVotes3)];

    return `The above charts illustrate various metrics. The first bar chart shows a total of ${totalVotes1} votes, with ${maxCategory1} receiving the highest number of votes (${maxVotes1}). The second and third bar charts depict additional categories, with ${maxCategory2} and ${maxCategory3} leading their respective groups. The pie chart and scatter plot further highlight the distribution and relationships in the data.`;
  };

  return (
    <section id="results" className="results-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Results</h2>
      <p className="section-paragraph">
        This section presents the results of the Optimism Voting Strategy analysis. The following charts and graphs provide a detailed breakdown of key metrics and insights derived from the data.
      </p>

      <div className="results-grid">
        <div className="result-box">
          <Bar data={barChartData1} />
        </div>
        <div className="result-box">
          <Bar data={barChartData2} />
        </div>
        <div className="result-box">
          <Bar data={barChartData3} />
        </div>
        <div className="result-box">
          <Pie data={pieChartData} />
        </div>
        <div className="result-box">
          <Scatter data={scatterChartData} />
        </div>
        <div className="result-box">
          <Bar data={barChartData4} />
        </div>
      </div>

      <p className="dynamic-paragraph">
        {generateDynamicText()}
      </p>
    </section>
  );
};

export default Results;
