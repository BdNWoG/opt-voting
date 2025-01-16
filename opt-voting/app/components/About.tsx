import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" style={{ padding: '20px 20px 0px' }}>
      <h2 className="section-heading">About</h2>
      <p className="section-paragraph">
        A project by Stanford Blockchain Club's research and governance team to evaluate the robustness of different voting mechanisms in the context of Optimism's RPGF. We develop a simulation framework for three primary voting mechanisms used in previous RetroPGF rounds: Single Selection Maximum (Max Voting), Quadratic Voting, and Mean Voting.



        This is a research project developed by Stanford Blockchain Club to evaluate the robustness of different voting mechanisms in the context of Optimism's Retroactive Public Goods Funding (RPGF).

        We develop a simulation framework for evaluating voting mechanism designs in the context of Optimism's RPGF.
      </p>
      
      <p className="section-paragraph">
        The framework implements three primary voting mechanisms: Single Selection (Max Voting), Quadratic Voting, and Mean Voting. Each mechanism undergoes systematic evaluation against established attack models, including collusion and epsilon attacks, facilitating rigorous assessment of their game-theoretic properties and security characteristics.
      </p>

    </section>
  );
};

export default About;