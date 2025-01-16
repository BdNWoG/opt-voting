# Optimism RFP: Evaluating Voting Designs for RPGF

A simulation framework for analyzing different voting mechanisms and their vulnerability to various attack vectors in the context of Optimism's Retroactive Public Goods Funding (RPGF).

RFP Information: https://github.com/orgs/ethereum-optimism/projects/31/views/1?pane=issue&itemId=61734498

Vercel Deployment: https://opt-voting.vercel.app/

Maintainers: Billy Gao and Jay Yu

## Overview

This project implements a voting simulation system that models different voting algorithms and their responses to potential attack scenarios. The simulation supports multiple voting mechanisms including single selection, quadratic voting, and mean voting, along with their corresponding attack vectors.

## Features

- Multiple voting algorithm implementations:
  - Single Selection (Max Voting)
  - Quadratic Voting (with and without collusion attacks)
  - Mean Voting (with and without epsilon attacks)
- Configurable simulation parameters
- Support for custom preference matrices via CSV import
- Automated random preference matrix generation
- Visualization of voting outcomes

## Quick Start

App uses Next.js and Tailwind CSS.

```bash
git clone https://github.com/Stanford-Blockchain-Club/optimism-rfp-simulation
cd opt-voting
npm run dev
```

## Voting Algorithms

### Single Selection (Max Voting)
Each voter allocates all votes to their highest preference project. Implements a basic plurality voting system.

### Quadratic Voting
Vote allocation follows a square root relationship with preferences:
- Standard: `votes = sqrt(preference * vote_num)`
- Collusion Attack: Simulates coordinated voting between random voter pairs

### Mean Voting
Calculates mean preference across all voters:
- Standard: `project_votes = sum(preferences) * vote_num / N`
- Epsilon Attack: Demonstrates vulnerability to strategic minimal voting

## Configuration

Key simulation parameters:

- `num_voters`: Number of participating voters
- `num_projects`: Number of projects receiving votes
- `votes_per_voter`: Vote allocation per voter (default: 100)
- `algorithm`: Voting mechanism selection
- `attack_type`: Optional attack simulation

## License

MIT License - see LICENSE file for details

## Acknowledgments

Based on research into Optimism's Retroactive Public Goods Funding mechanisms and voting system vulnerabilities.