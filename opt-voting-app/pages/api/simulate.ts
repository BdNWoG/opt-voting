import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import { parse } from 'csv-parse';
import {
  maxVoting,
  quadraticVotingNoAttack,
  meanVotingNoAttack,
  quadraticVotingVoterCollusionAttack,
  quadraticVotingProjectCollusionAttack,
  meanVotingVoterEpsilonAttack,
  meanVotingProjectEpsilonAttack,
  trueVoting,
  medianVotingNoAttack,
  medianVotingVoterEpsilonAttack,
  medianVotingProjectEpsilonAttack,
} from '../../utils/votingMechanisms'; // Import voting functions

// Directory for storing uploaded files
const uploadDir = '/tmp'; // Use tmp for temporary file storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const multerMiddleware = upload.fields([
  { name: 'voterFile', maxCount: 1 },
  { name: 'votingPowerFile', maxCount: 1 },
]);

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const parseCSV = async (filePath: string): Promise<any[]> => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    parse(fileContent, { trim: true, skip_records_with_empty_values: true }, (err, records) => {
      if (err) {
        reject(err);
      }
      // Skip the first row, which contains the titles
      const dataWithoutHeaders = records.slice(1); // Skips the first row (headers)
      resolve(dataWithoutHeaders);
    });
  });
};

// Helper to convert results to CSV format
const generateCSV = (data: any) => {
  const headers = ['Mechanism', 'Project', 'Votes'];
  let csv = `${headers.join(',')}\n`;

  Object.keys(data).forEach((mechanism) => {
    const mechanismResults = data[mechanism];
    Object.keys(mechanismResults).forEach((project) => {
      csv += `${mechanism},${project},${mechanismResults[project]}\n`;
    });
  });

  return csv;
};

const simulateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Simulation started');
  await runMiddleware(req, res, multerMiddleware);

  const voterFile = req.files?.['voterFile']?.[0];
  const votingPowerFile = req.files?.['votingPowerFile']?.[0];

  if (!voterFile || !votingPowerFile) {
    console.error('Files are missing');
    return res.status(400).json({ error: 'Files are missing' });
  }

  const voterFilePath = voterFile.path;
  const votingPowerFilePath = votingPowerFile.path;

  try {
    const preferenceMatrix = await parseCSV(voterFilePath);
    const votingPowerMatrix = await parseCSV(votingPowerFilePath);

    const votersData = preferenceMatrix.map((preferences, index) => {
      const votingPower = votingPowerMatrix[index][1]; // Using the correct column, skipping header
      return {
        voterId: index + 1, // Assuming voter ID is based on index
        preferences: preferences.slice(1).map(Number), // Skip the first column which contains titles
        votingPower: Number(votingPower), // Ensure votingPower is a number
      };
    });
    
    // Max Voting Mechanism
    const maxVotingResults = maxVoting(votersData);
    
    // Quadratic Voting - No Attack
    const quadraticNoAttackResults = quadraticVotingNoAttack(votersData);

    // Mean Voting - No Attack
    const meanNoAttackResults = meanVotingNoAttack(votersData);

    // Quadratic Voting - Voter Collusion Attack
    const quadraticVoterCollusionResults = quadraticVotingVoterCollusionAttack(votersData);

    // Quadratic Voting - Project Collusion Attack
    const quadraticProjectCollusionResults = quadraticVotingProjectCollusionAttack(votersData);

    // Mean Voting - Voter Epsilon Attack
    const meanVoterEpsilonResults = meanVotingVoterEpsilonAttack(votersData);

    // Mean Voting - Project Epsilon Attack
    const meanProjectEpsilonResults = meanVotingProjectEpsilonAttack(votersData);

    // True Voting
    const trueVotingResults = trueVoting(votersData);

    // Median Voting - No Attack
    const medianNoAttackResults = medianVotingNoAttack(votersData);

    // Median Voting - Voter Epsilon Attack
    const medianVoterEpsilonResults = medianVotingVoterEpsilonAttack(votersData);

    // Median Voting - Project Epsilon Attack
    const medianProjectEpsilonResults = medianVotingProjectEpsilonAttack(votersData);

    const votingResults = {
      maxVotingResults,
      quadraticNoAttackResults,
      meanNoAttackResults,
      quadraticVoterCollusionResults,
      quadraticProjectCollusionResults,
      meanVoterEpsilonResults,
      meanProjectEpsilonResults,
      trueVotingResults,
      medianNoAttackResults,
      medianVoterEpsilonResults,
      medianProjectEpsilonResults,
    };

    console.log('Generating CSV for voting results');
    const csvContent = generateCSV(votingResults);

    // Send the CSV file as response without saving it to disk
    res.setHeader('Content-Disposition', 'attachment; filename=voting_results.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Error processing files' });
  } finally {
    // Cleanup: remove uploaded files
    fs.unlinkSync(voterFilePath);
    fs.unlinkSync(votingPowerFilePath);
  }
};

export default simulateHandler;
