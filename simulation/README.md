# RPGF Voting Mechanism Simulation

A Python-based simulation framework for generating and analyzing voting mechanism data for Optimism's Retroactive Public Goods Funding (RPGF) research paper.

## Overview

This simulation framework generates comprehensive datasets to analyze different voting mechanisms (Single Selection, Quadratic, and Mean Voting) under various attack scenarios. The results are used to support empirical findings in our research paper on RPGF voting mechanisms.

## Features

- Voting mechanism implementations:
  - Single Selection (Max Voting)
  - Quadratic Voting
    - Standard implementation
    - Collusion attack scenarios
    - Sybil attack scenarios
  - Mean Voting
    - Standard implementation
    - Epsilon attack scenarios
    - Strategic voting simulations
  - Median Voting
    - Standard implementation
    - Resistance to extreme preferences
    - Manipulation through strategic voting

- Data generation capabilities:
  - Synthetic voter preference matrices
  - Attack vector simulations
  - Multiple rounds of voting
  - Various distribution patterns for voter preferences

- Analysis tools:
  - Statistical metrics calculation
  - Result comparison across mechanisms
  - Attack impact quantification
  - Data visualization utilities

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to simulation directory
cd simulation

# Install required packages
pip install -r requirements.txt
```

## Usage

### Basic Simulation

```bash
python simulation.py --mechanism [voting-mechanism] --voters [num-voters] --projects [num-projects]
```

### Advanced Options

```bash
python simulation.py \
  --mechanism quadratic \
  --voters 1000 \
  --projects 100 \
  --attack-type collusion \
  --attack-strength 0.3 \
  --rounds 100 \
  --output-dir "./results"
```

### Configuration Parameters

- `--mechanism`: Voting mechanism to simulate (single/quadratic/mean)
- `--voters`: Number of voters
- `--projects`: Number of projects
- `--attack-type`: Type of attack to simulate (none/collusion/epsilon/sybil)
- `--attack-strength`: Attack strength parameter (0.0 to 1.0)
- `--rounds`: Number of simulation rounds
- `--output-dir`: Directory for output data
- `--seed`: Random seed for reproducibility

## Output Format

Results are saved in CSV format with the following structure:

```
results/
├── raw_data/
│   ├── simulation_run_[timestamp].csv
│   └── attack_results_[timestamp].csv
├── analysis/
│   ├── statistical_metrics.csv
│   └── comparison_results.csv
└── visualizations/
    ├── distribution_plots.png
    └── attack_impact_charts.png
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

[Add your license here]

## Citation

If you use this simulation framework in your research, please cite:

```bibtex
[Add citation information for your paper here]
```
