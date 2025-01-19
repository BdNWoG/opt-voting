"""
Voting mechanism implementations for RPGF simulation framework.

This module contains implementations of various voting mechanisms and their
corresponding attack scenarios for analyzing voting behavior in Optimism's
Retroactive Public Goods Funding (RPGF) program.
"""

from typing import Dict, List, Union
import random
import numpy as np

# Type aliases
VotingResults = Dict[int, float]
VoterData = Dict[str, Union[int, List[float], float]]

class VotingMechanisms:
    """Collection of voting mechanisms and their attack variants."""

    # Base Voting Mechanisms
    @classmethod
    def max_voting(cls, voters_data: List[VoterData]) -> VotingResults:
        """Single Selection (Max) Voting Implementation.
        
        Each voter allocates all their voting power to their highest preference.
        
        Args:
            voters_data: List of voter data including preferences and voting power
            
        Returns:
            Dict mapping project indices to their vote totals
        """
        project_votes: Dict[int, float] = {}
        
        for voter in voters_data:
            max_preference = max(voter['preferences'])
            # In case of ties, select first project with max preference
            selected_project = voter['preferences'].index(max_preference)
            project_votes[selected_project] = (
                project_votes.get(selected_project, 0) + voter['voting_power']
            )
        
        return project_votes

    @classmethod
    def true_voting(cls, voters_data: List[VoterData]) -> VotingResults:
        """True Voting Implementation (Baseline).
        
        Direct preference-weighted allocation of voting power.
        
        Args:
            voters_data: List of voter data
            
        Returns:
            Dict of voting results
        """
        results: VotingResults = {}
        
        for voter in voters_data:
            preference_sum = sum(voter['preferences'])
            for i, preference in enumerate(voter['preferences']):
                vote_amount = (preference / preference_sum) * voter['voting_power']
                results[i] = results.get(i, 0) + vote_amount
        
        return results

    # Quadratic Voting Mechanisms
    @classmethod
    def quadratic_voting_no_attack(cls, voters_data: List[VoterData]) -> VotingResults:
        """Standard Quadratic Voting Implementation."""
        results: VotingResults = {}
        
        for voter in voters_data:
            preference_sum = sum(voter['preferences'])
            for i, preference in enumerate(voter['preferences']):
                vote_amount = np.sqrt((preference / preference_sum) * voter['voting_power'])
                results[i] = results.get(i, 0) + vote_amount
        
        return results

    @classmethod
    def quadratic_voting_voter_collusion(cls, voters_data: List[VoterData]) -> VotingResults:
        """Quadratic Voting with Voter Collusion Attack."""
        results: VotingResults = {}
        colluding_voters = random.sample(voters_data, 2) # randomly select 2 voters to collude
        
        for voter in voters_data:
            if voter in colluding_voters:
                # Colluding voters coordinate on top two preferences
                preferences_with_indices = [
                    (pref, idx) for idx, pref in enumerate(voter['preferences'])
                ]
                top_two_indices = [
                    idx for _, idx in sorted(
                        preferences_with_indices, 
                        key=lambda x: x[0], 
                        reverse=True
                    )[:2]
                ]
                
                for idx in top_two_indices:
                    vote_amount = np.sqrt(0.5 * voter['voting_power'])
                    results[idx] = results.get(idx, 0) + vote_amount
            else:
                # Non-colluding voters vote normally
                preference_sum = sum(voter['preferences'])
                for i, preference in enumerate(voter['preferences']):
                    vote_amount = np.sqrt((preference / preference_sum) * voter['voting_power'])
                    results[i] = results.get(i, 0) + vote_amount
        
        return results

    @classmethod
    def quadratic_voting_project_collusion(cls, voters_data: List[VoterData]) -> VotingResults:
        """Quadratic Voting with Project Collusion Attack."""
        results: VotingResults = {}
        num_projects = len(voters_data[0]['preferences'])
        colluding_projects = random.sample(range(num_projects), 2) # randomly select 2 projects to collude
        
        for voter in voters_data:
            top_preference_index = voter['preferences'].index(max(voter['preferences']))
            
            if top_preference_index in colluding_projects:
                # Split votes between colluding projects
                for idx in colluding_projects:
                    vote_amount = np.sqrt(0.5 * voter['voting_power'])
                    results[idx] = results.get(idx, 0) + vote_amount
            else:
                # Normal voting for non-colluding projects
                preference_sum = sum(voter['preferences'])
                for i, preference in enumerate(voter['preferences']):
                    vote_amount = np.sqrt((preference / preference_sum) * voter['voting_power'])
                    results[i] = results.get(i, 0) + vote_amount
        
        return results

    # Mean Voting Mechanisms
    @classmethod
    def mean_voting_no_attack(cls, voters_data: List[VoterData]) -> VotingResults:
        """Standard Mean Voting Implementation."""
        results: VotingResults = {}
        project_voter_count: VotingResults = {}
        
        # Collect votes
        for voter in voters_data:
            preference_sum = sum(voter['preferences'])
            for i, preference in enumerate(voter['preferences']):
                vote_amount = (preference / preference_sum) * voter['voting_power']
                results[i] = results.get(i, 0) + vote_amount
                if preference > 0:
                    project_voter_count[i] = project_voter_count.get(i, 0) + 1
        
        # Normalize by voter count
        for project in results:
            if project_voter_count.get(project, 0) > 0:
                results[project] /= project_voter_count[project]
        
        return results

    @classmethod
    def mean_voting_voter_epsilon(cls, voters_data: List[VoterData]) -> VotingResults:
        """Mean Voting with Voter Epsilon Attack."""
        results: VotingResults = {}
        project_voter_count: VotingResults = {}
        epsilon_voter = random.sample(voters_data, 1)[0]
        
        for voter in voters_data:
            if voter == epsilon_voter:
                # Epsilon attack strategy
                top_preference_index = voter['preferences'].index(max(voter['preferences']))
                num_projects = len(voter['preferences'])
                
                for i in range(num_projects):
                    if i == top_preference_index:
                        results[i] = results.get(i, 0) + voter['voting_power'] - (0.01 * (num_projects - 1))
                    else:
                        results[i] = results.get(i, 0) + 0.01
                project_voter_count[top_preference_index] = project_voter_count.get(top_preference_index, 0) + 1
            else:
                # Normal voting for non-attacking voters
                preference_sum = sum(voter['preferences'])
                for i, preference in enumerate(voter['preferences']):
                    vote_amount = (preference / preference_sum) * voter['voting_power']
                    results[i] = results.get(i, 0) + vote_amount
                    if preference > 0:
                        project_voter_count[i] = project_voter_count.get(i, 0) + 1
        
        # Normalize results
        for project in results:
            if project_voter_count.get(project, 0) > 0:
                results[project] /= project_voter_count[project]
        
        return results

    # Median Voting Mechanisms
    @classmethod
    def median_voting_no_attack(cls, voters_data: List[VoterData]) -> VotingResults:
        """Standard Median Voting Implementation."""
        results: VotingResults = {}
        project_votes: Dict[int, List[float]] = {}
        
        # Collect all votes
        for voter in voters_data:
            preference_sum = sum(voter['preferences'])
            for i, preference in enumerate(voter['preferences']):
                vote_amount = (preference / preference_sum) * voter['voting_power']
                if i not in project_votes:
                    project_votes[i] = []
                project_votes[i].append(vote_amount)
        
        # Calculate median for each project
        for project_index, votes in project_votes.items():
            votes.sort()
            mid = len(votes) // 2
            results[project_index] = (
                votes[mid] if len(votes) % 2 == 1 
                else (votes[mid-1] + votes[mid]) / 2
            )
        
        return results