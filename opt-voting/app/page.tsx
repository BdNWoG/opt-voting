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
      {
        votingResults && (
          <Results votingResults={votingResults} />
        )
      }

      {/* Only show Measurement component if votingResults exists */}
      {votingResults && (
        <Measurement votingResults={votingResults} />
      )}
    </div>
  );
}
