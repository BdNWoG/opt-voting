"use client";

import React from 'react';

const Results: React.FC = () => {
  return (
    <section id="results" className="results-section" style={{ padding: '20px 20px' }}>
      <h2 className="section-heading">Results</h2>
      <p className="section-paragraph">
        This section presents the results of the Optimism Voting Strategy analysis. The following charts and graphs provide a detailed breakdown of key metrics and insights derived from the data.
      </p>

      <div className="results-grid">
        <div className="result-box">
          <img src="/placeholder-bar-chart.png" alt="Bar Chart" className="chart-image" />
        </div>
        <div className="result-box">
          <img src="/placeholder-bar-chart.png" alt="Bar Chart" className="chart-image" />
        </div>
        <div className="result-box">
          <img src="/placeholder-bar-chart.png" alt="Bar Chart" className="chart-image" />
        </div>
        <div className="result-box">
          <img src="/placeholder-pie-chart.png" alt="Pie Chart" className="chart-image" />
        </div>
        <div className="result-box">
          <img src="/placeholder-scatter-plot.png" alt="Scatter Plot" className="chart-image" />
        </div>
        <div className="result-box">
          <img src="/placeholder-bar-chart.png" alt="Bar Chart" className="chart-image" />
        </div>
      </div>

      <p className="dynamic-paragraph">
        The above charts illustrate the distribution of votes, voter demographics, and the impact of various parameters on the voting outcomes. The bar charts represent different categories of data, while the pie chart and scatter plot provide additional perspectives on the overall trends.
      </p>
    </section>
  );
};

export default Results;
