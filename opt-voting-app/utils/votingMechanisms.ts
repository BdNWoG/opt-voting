// utils/votingMechanisms.ts

import { VoterData } from './types'; // Import the VoterData type

export interface VotingResults {
  [projectIndex: number]: number;
}

// Helper function to calculate normalized preferences sum
const normalizePreferences = (voter: VoterData): number => {
  return voter.preferences.reduce((sum, pref) => sum + pref, 0);
};

// 1. Max Voting
export const maxVoting = (votersData: any[]) => {
    const projectVotes: { [project: string]: number } = {};
  
    votersData.forEach((voter) => {
      const maxPreference = Math.max(...voter.preferences);
      const topProjects = voter.preferences
        .map((pref: number, idx: number) => (pref === maxPreference ? idx : -1))
        .filter((idx: number) => idx !== -1);
  
      const selectedProject = topProjects[0]; // You can add tie-breaking logic here
      if (!projectVotes[selectedProject]) {
        projectVotes[selectedProject] = 0;
      }
      projectVotes[selectedProject] += voter.votingPower;
    });
  
    return projectVotes;
  };

// 2. Quadratic Voting - No Attack
export const quadraticVotingNoAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  votersData.forEach(voter => {
    const preferenceSum = normalizePreferences(voter);
    voter.preferences.forEach((preference, i) => {
      const voteAmount = Math.sqrt((preference / preferenceSum) * voter.votingPower);
      results[i] = (results[i] || 0) + voteAmount;
    });
  });
  return results;
};

// 3. Mean Voting - No Attack
export const meanVotingNoAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVoterCount: VotingResults = {};
  
  votersData.forEach(voter => {
    const preferenceSum = normalizePreferences(voter);
    voter.preferences.forEach((preference, i) => {
      const voteAmount = (preference / preferenceSum) * voter.votingPower;
      results[i] = (results[i] || 0) + voteAmount;
      if (preference > 0) projectVoterCount[i] = (projectVoterCount[i] || 0) + 1;
    });
  });

  // Normalize by the number of voters who voted for each project
  for (const project in results) {
    if (projectVoterCount[project]) {
      results[project] /= projectVoterCount[project];
    }
  }

  return results;
};

// 4. Quadratic Voting - Voter Collusion Attack
export const quadraticVotingVoterCollusionAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const colludingVoters = randomSelection(votersData, 2);

  votersData.forEach(voter => {
    if (colludingVoters.includes(voter)) {
      const topTwoIndices = voter.preferences
        .map((value, index) => ({ value, index }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 2)
        .map(pair => pair.index);

      topTwoIndices.forEach(idx => {
        const voteAmount = Math.sqrt(0.5 * voter.votingPower);
        results[idx] = (results[idx] || 0) + voteAmount;
      });
    } else {
      const preferenceSum = normalizePreferences(voter);
      voter.preferences.forEach((preference, i) => {
        const voteAmount = Math.sqrt((preference / preferenceSum) * voter.votingPower);
        results[i] = (results[i] || 0) + voteAmount;
      });
    }
  });

  return results;
};

// 5. Quadratic Voting - Project Collusion Attack
export const quadraticVotingProjectCollusionAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const colludingProjects = randomSelection([...Array(votersData[0].preferences.length).keys()], 2);

  votersData.forEach(voter => {
    const topPreferenceIndex = voter.preferences.indexOf(Math.max(...voter.preferences));
    if (colludingProjects.includes(topPreferenceIndex)) {
      colludingProjects.forEach(idx => {
        const voteAmount = Math.sqrt(0.5 * voter.votingPower);
        results[idx] = (results[idx] || 0) + voteAmount;
      });
    } else {
      const preferenceSum = normalizePreferences(voter);
      voter.preferences.forEach((preference, i) => {
        const voteAmount = Math.sqrt((preference / preferenceSum) * voter.votingPower);
        results[i] = (results[i] || 0) + voteAmount;
      });
    }
  });

  return results;
};

// 6. Mean Voting - Voter Epsilon Attack
export const meanVotingVoterEpsilonAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVoterCount: VotingResults = {};
  const epsilonVoter = randomSelection(votersData, 1)[0];

  votersData.forEach(voter => {
    if (voter === epsilonVoter) {
      const topPreferenceIndex = voter.preferences.indexOf(Math.max(...voter.preferences));
      voter.preferences.forEach((_, i) => {
        if (i === topPreferenceIndex) {
          results[i] = (results[i] || 0) + voter.votingPower - (0.01 * (voter.preferences.length - 1));
        } else {
          results[i] = (results[i] || 0) + 0.01;
        }
      });
      projectVoterCount[topPreferenceIndex] = (projectVoterCount[topPreferenceIndex] || 0) + 1;
    } else {
      const preferenceSum = normalizePreferences(voter);
      voter.preferences.forEach((preference, i) => {
        const voteAmount = (preference / preferenceSum) * voter.votingPower;
        results[i] = (results[i] || 0) + voteAmount;
        if (preference > 0) projectVoterCount[i] = (projectVoterCount[i] || 0) + 1;
      });
    }
  });

  // Normalize by the number of voters who voted for each project
  for (const project in results) {
    if (projectVoterCount[project]) {
      results[project] /= projectVoterCount[project];
    }
  }

  return results;
};

// 7. Mean Voting - Project Epsilon Attack
export const meanVotingProjectEpsilonAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVoterCount: VotingResults = {};
  const epsilonProject = randomSelection([...Array(votersData[0].preferences.length).keys()], 1)[0];

  votersData.forEach(voter => {
    const topPreferenceIndex = voter.preferences.indexOf(Math.max(...voter.preferences));
    if (topPreferenceIndex === epsilonProject) {
      voter.preferences.forEach((_, i) => {
        if (i === epsilonProject) {
          results[i] = (results[i] || 0) + voter.votingPower - (0.01 * (voter.preferences.length - 1));
        } else {
          results[i] = (results[i] || 0) + 0.01;
        }
      });
      projectVoterCount[epsilonProject] = (projectVoterCount[epsilonProject] || 0) + 1;
    } else {
      const preferenceSum = normalizePreferences(voter);
      voter.preferences.forEach((preference, i) => {
        const voteAmount = (preference / preferenceSum) * voter.votingPower;
        results[i] = (results[i] || 0) + voteAmount;
        if (preference > 0) projectVoterCount[i] = (projectVoterCount[i] || 0) + 1;
      });
    }
  });

  // Normalize by the number of voters who voted for each project
  for (const project in results) {
    if (projectVoterCount[project]) {
      results[project] /= projectVoterCount[project];
    }
  }

  return results;
};

// 8. True Voting
export const trueVoting = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  votersData.forEach(voter => {
    const preferenceSum = normalizePreferences(voter);
    voter.preferences.forEach((preference, i) => {
      const voteAmount = (preference / preferenceSum) * voter.votingPower;
      results[i] = (results[i] || 0) + voteAmount;
    });
  });
  return results;
};

// Utility function to randomly select voters or projects
function randomSelection<T>(arr: T[], num: number): T[] {
  return arr.sort(() => 0.5 - Math.random()).slice(0, num);
}

// 9. Median Voting - No Attack
export const medianVotingNoAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVotes: { [key: number]: number[] } = {};

  // Collect all votes for each project
  votersData.forEach(voter => {
    const preferenceSum = normalizePreferences(voter);
    voter.preferences.forEach((preference, i) => {
      const voteAmount = (preference / preferenceSum) * voter.votingPower;
      if (!projectVotes[i]) {
        projectVotes[i] = [];
      }
      projectVotes[i].push(voteAmount);
    });
  });

  // Calculate median for each project
  Object.keys(projectVotes).forEach(projectIndex => {
    const votes = projectVotes[Number(projectIndex)].sort((a, b) => a - b);
    const mid = Math.floor(votes.length / 2);
    results[Number(projectIndex)] = votes.length % 2 === 0 
      ? (votes[mid - 1] + votes[mid]) / 2 
      : votes[mid];
  });

  return results;
};

// 10. Median Voting - Voter Epsilon Attack
export const medianVotingVoterEpsilonAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVotes: { [key: number]: number[] } = {};
  const epsilonProject = 0; // Attacking first project for simplicity

  votersData.forEach(voter => {
    const topPreferenceIndex = voter.preferences.indexOf(Math.max(...voter.preferences));
    
    if (topPreferenceIndex === epsilonProject) {
      // Epsilon attack: give almost all voting power to preferred project
      voter.preferences.forEach((_, i) => {
        if (!projectVotes[i]) {
          projectVotes[i] = [];
        }
        if (i === epsilonProject) {
          projectVotes[i].push(voter.votingPower - (0.01 * (voter.preferences.length - 1)));
        } else {
          projectVotes[i].push(0.01);
        }
      });
    } else {
      // Normal voting for non-attacking voters
      const preferenceSum = normalizePreferences(voter);
      voter.preferences.forEach((preference, i) => {
        if (!projectVotes[i]) {
          projectVotes[i] = [];
        }
        const voteAmount = (preference / preferenceSum) * voter.votingPower;
        projectVotes[i].push(voteAmount);
      });
    }
  });

  // Calculate median for each project
  Object.keys(projectVotes).forEach(projectIndex => {
    const votes = projectVotes[Number(projectIndex)].sort((a, b) => a - b);
    const mid = Math.floor(votes.length / 2);
    results[Number(projectIndex)] = votes.length % 2 === 0 
      ? (votes[mid - 1] + votes[mid]) / 2 
      : votes[mid];
  });

  return results;
};

// 11. Median Voting - Project Epsilon Attack
export const medianVotingProjectEpsilonAttack = (votersData: VoterData[]): VotingResults => {
  const results: VotingResults = {};
  const projectVotes: { [key: number]: number[] } = {};
  const epsilonProject = 0; // Project performing the attack

  votersData.forEach(voter => {
    const preferenceSum = normalizePreferences(voter);
    voter.preferences.forEach((preference, i) => {
      if (!projectVotes[i]) {
        projectVotes[i] = [];
      }
      
      if (i === epsilonProject) {
        // The attacking project inflates its own votes slightly
        const voteAmount = (preference / preferenceSum) * voter.votingPower * 1.1;
        projectVotes[i].push(voteAmount);
      } else {
        // Other projects receive normal votes
        const voteAmount = (preference / preferenceSum) * voter.votingPower;
        projectVotes[i].push(voteAmount);
      }
    });
  });

  // Calculate median for each project
  Object.keys(projectVotes).forEach(projectIndex => {
    const votes = projectVotes[Number(projectIndex)].sort((a, b) => a - b);
    const mid = Math.floor(votes.length / 2);
    results[Number(projectIndex)] = votes.length % 2 === 0 
      ? (votes[mid - 1] + votes[mid]) / 2 
      : votes[mid];
  });

  return results;
};
