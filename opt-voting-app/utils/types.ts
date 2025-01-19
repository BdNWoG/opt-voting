// utils/types.ts

export interface VoterData {
    voterId: number;
    preferences: number[];  // Array of preferences for each project
    votingPower: number;    // Voting power for the voter
}
  