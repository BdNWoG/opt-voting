"use client";

import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface VotingResults {
  [key: string]: { [project: string]: number };
}

const Results: React.FC<{ votingResults: VotingResults | null }> = ({ votingResults }) => {
  const [visibleCharts, setVisibleCharts] = useState<{ [key: string]: 'bar' | 'pie' }>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Initialize the visible charts when voting mechanisms change
  useEffect(() => {
    const initialVisibility = votingMechanisms.reduce((acc, mechanism) => {
      acc[mechanism] = 'bar';
      return acc;
    }, {} as { [key: string]: 'bar' | 'pie' });
    setVisibleCharts(initialVisibility);
  }, []);

  useEffect(() => {
    console.log('Voting results updated in Results component:', votingResults); // Check if results are passed
    if (!votingResults) {
      console.log('No voting results yet!');
    }
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
    // Quadratic Voting Group
    'quadraticNoAttackResults',
    'quadraticVoterCollusionResults',
    'quadraticProjectCollusionResults',
    // Mean Voting Group
    'meanNoAttackResults',
    'meanVoterEpsilonResults',
    'meanProjectEpsilonResults',
    'trueVotingResults'
  ];

  const generateChartData = (data: { [project: string]: number }) => {
    const labels = Object.keys(data).map((project) => `Project ${project}`);
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

  // Bar chart options without a legend
  const generateChartOptions = (chartTitle: string) => ({
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 20,
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Projects',
          font: {
            size: 14,
          },
        },
        ticks: {
          padding: 5
        }
      },
      y: {
        title: {
          display: true,
          text: 'Votes',
          font: {
            size: 14,
          },
        },
        beginAtZero: true,
        ticks: {
          padding: 5
        }
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 20
      }
    },
    maintainAspectRatio: true,
  });

  // Pie chart options without axis and axis titles
  const generatePieChartOptions = (chartTitle: string) => ({
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 20,
        },
      },
      legend: {
        display: true,
        position: 'top' as const, // Place the legend on top
        align: 'center' as const, // Align the legend in the center
        labels: {
          boxWidth: 20, // Size of the color box in the legend
          padding: 10,
        },
      },
    },
  });

  const toggleChart = (mechanism: string) => {
    setVisibleCharts(prev => ({
      ...prev,
      [mechanism]: prev[mechanism] === 'bar' ? 'pie' : 'bar'
    }));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? votingMechanisms.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === votingMechanisms.length - 1 ? 0 : prev + 1));
  };

  // Generate dynamic text summarizing the voting mechanisms and the impact of attacks
  const generateDynamicText = () => {
    if (!votingResults) {
      return 'Currently displaying placeholder data. Once the actual voting results are available, they will be shown here.';
    }

    let text = '';
    let normalResults = '';
    let attackAnalysis = '';

    const projectWinners: { [mechanism: string]: string } = {};

    // First paragraph: mention which project won in each voting mechanism
    votingMechanisms.forEach((mechanism) => {
      const data = votingResults?.[mechanism];
      if (data && Object.keys(data).length > 0) {
        const maxVotes = Math.max(...Object.values(data));
        const maxProject = Object.keys(data)[Object.values(data).indexOf(maxVotes)];
        projectWinners[mechanism] = `Project ${maxProject}`;

        normalResults += `In the ${mechanism.replace(/([A-Z])/g, ' $1')} mechanism, Project ${maxProject} won with ${maxVotes} votes. `;
      }
    });

    // Check for voter and project attacks to see if the winner changed
    const quadraticVoterCollusion = projectWinners['quadraticVoterCollusionResults'];
    const quadraticNoAttack = projectWinners['quadraticNoAttackResults'];
    const quadraticProjectCollusion = projectWinners['quadraticProjectCollusionResults'];
    const meanVoterAttack = projectWinners['meanVoterEpsilonResults'];
    const meanNoAttack = projectWinners['meanNoAttackResults'];
    const meanProjectAttack = projectWinners['meanProjectEpsilonResults'];

    // Quadratic Voting - Voter Attack
    if (quadraticVoterCollusion !== quadraticNoAttack) {
      attackAnalysis += `Quadratic voting with voter collusion changed the winner from ${quadraticNoAttack} to ${quadraticVoterCollusion}. `;
    } else {
      attackAnalysis += `Quadratic voting with voter collusion did not change the outcome. `;
    }

    // Quadratic Voting - Project Attack
    if (quadraticProjectCollusion !== quadraticNoAttack) {
      attackAnalysis += `Quadratic voting with project collusion changed the winner from ${quadraticNoAttack} to ${quadraticProjectCollusion}. `;
    } else {
      attackAnalysis += `Quadratic voting with project collusion did not change the outcome. `;
    }

    // Mean Voting - Voter Attack
    if (meanVoterAttack !== meanNoAttack) {
      attackAnalysis += `Mean voting with voter collusion changed the winner from ${meanNoAttack} to ${meanVoterAttack}. `;
    } else {
      attackAnalysis += `Mean voting with voter collusion did not change the outcome. `;
    }

    // Mean Voting - Project Attack
    if (meanProjectAttack !== meanNoAttack) {
      attackAnalysis += `Mean voting with project collusion changed the winner from ${meanNoAttack} to ${meanProjectAttack}. `;
    } else {
      attackAnalysis += `Mean voting with project collusion did not change the outcome. `;
    }

    text = `${normalResults}\n${attackAnalysis}`;

    return text;
  };

  return (
    <section id="results" className="results-section">
      <h2 className="section-heading">Results</h2>
      <p className="section-paragraph">
        This section presents the results of the Optimism Voting Strategy analysis. The following charts and graphs provide a detailed breakdown of key metrics and insights derived from the data.
      </p>

      <div className="results-grid">
        <div className="slide-controls">
          <button className="slide-button" onClick={handlePrevSlide}>
            ←
          </button>
          <button className="slide-button" onClick={handleNextSlide}>
            →
          </button>
        </div>

        {/* Only render the current slide */}
        {(() => {
          const mechanism = votingMechanisms[currentSlideIndex];
          const data = votingResults?.[mechanism] || {};
          const hasData = Object.keys(data).length > 0;

          const barChartData = hasData ? generateChartData(data) : placeholderData;
          const barChartOptions = generateChartOptions(`${mechanism}`);

          const pieChartData = hasData ? generateChartData(data) : placeholderData;
          const pieChartOptions = generatePieChartOptions(`${mechanism}`);

          return (
            <div className="result-box">
              <div className="chart-container">
                {visibleCharts[mechanism] === 'bar' ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <Pie data={pieChartData} options={pieChartOptions} />
                )}
              </div>
              <button 
                className="chart-toggle-button" 
                onClick={() => toggleChart(mechanism)}
              >
                Switch to {visibleCharts[mechanism] === 'bar' ? 'Pie' : 'Bar'} Chart
              </button>
            </div>
          );
        })()}

        <div className="slide-indicator">
          {votingMechanisms.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentSlideIndex ? 'active' : ''}`}
              onClick={() => setCurrentSlideIndex(index)}
            />
          ))}
        </div>
      </div>

      <p className="dynamic-paragraph">
        {generateDynamicText()}
      </p>
    </section>
  );
};

export default Results;

