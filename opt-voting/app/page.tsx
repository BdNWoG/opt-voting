'use client';

import { useState } from 'react';
import Initialization from './components/Initialization';
import Measurement from './components/Measurement';
import Results from './components/Results';

export default function Home() {
  // Manage the voting results state here
  const [votingResults, setVotingResults] = useState(null);

  return (
    <div>
      <section id="description" style={{ padding: '50px 20px 0px' }}>
        <h2 className="section-heading">Description</h2>
        <p className="section-paragraph">
          This is a brief paragraph of text that describes the purpose of the Optimism Voting Strategy. 
          It provides an overview of the research and its potential implications in blockchain technology.
        </p>
      </section>

      {/* Pass setVotingResults to Initialization to handle the simulation and results */}
      <Initialization setVotingResults={setVotingResults} />

      {/* Pass the votingResults to the Results component to update the charts */}
      <Results votingResults={votingResults} />

      <Measurement />

      <section id="explanation" style={{ padding: '20px 20px' }}>
        <h2 className="section-heading">Explanation</h2>
        <p className="section-paragraph">
          This will be many paragraphs of text that explains the working behind the Optimism Voting Strategy. 
          It provides a detailed explanation of the research and its potential basis, including proofs, images, and more.
        </p>
      </section>
    </div>
  );
}
