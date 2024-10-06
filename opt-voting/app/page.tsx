'use client';

import { useState } from 'react';
import Initialization from './components/Initialization';
import Results from './components/Results';
import Measurement from './components/Measurement';
import LiteratureReview from './components/LiteratureReview';

export default function Home() {
  // Manage the voting results state here
  const [votingResults, setVotingResults] = useState(null);

  return (
    <div>
      <section id="description" style={{ padding: '50px 20px 0px' }}>
        {/* Insert the Literature Review component here */}
        <LiteratureReview />
      </section>

      {/* Pass setVotingResults to Initialization to handle the simulation and results */}
      <Initialization setVotingResults={setVotingResults} />

      {/* Pass the votingResults to the Results component to update the charts */}
      <Results votingResults={votingResults} />

      {/* Pass the votingResults to the Measurement component to calculate and display the measurements */}
      <Measurement votingResults={votingResults} />

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
