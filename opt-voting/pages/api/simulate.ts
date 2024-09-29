// pages/api/simulate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
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
  trueVoting, // Import the new True Voting function
} from '../../utils/votingMechanisms'; // Import voting functions
import { VoterData } from '../../utils/types'; // Import VoterData type

// Directory for storing uploaded files
const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Disable body parsing for the file upload route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Middleware to handle file uploads
const multerMiddleware = upload.fields([
  { name: 'voterFile', maxCount: 1 },
  { name: 'votingPowerFile', maxCount: 1 },
]);

// Helper to run multer middleware
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

// Function to read and parse a CSV file
const parseCSV = async (filePath: string): Promise<any[]> => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    parse(fileContent, { trim: true }, (err, records) => {
      if (err) {
        reject(err);
      }
      resolve(records);
    });
  });
};

const simulateHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, multerMiddleware);

  const voterFile = req.files?.['voterFile']?.[0];
  const votingPowerFile = req.files?.['votingPowerFile']?.[0];

  if (!voterFile || !votingPowerFile) {
    return res.status(400).json({ error: 'Files are missing' });
  }

  // Paths to the uploaded files
  const voterFilePath = voterFile.path;
  const votingPowerFilePath = votingPowerFile.path;

  try {
    // Parse the voterFile (preference matrix)
    const preferenceMatrix = await parseCSV(voterFilePath);
    // Parse the votingPowerFile (voter power matrix)
    const votingPowerMatrix = await parseCSV(votingPowerFilePath);

    // Correlating voter preferences and voting power
    const votersData: VoterData[] = preferenceMatrix.map((preferences, index) => {
      const votingPower = votingPowerMatrix[index][0]; // Assuming only one column for voting power
      return {
        voterId: index + 1, // Voter ID starting from 1
        preferences: preferences.map(Number), // Preferences as an array of numbers
        votingPower: Number(votingPower), // Voting power as a number
      };
    });

    // Execute voting mechanisms
    const maxVotingResults = maxVoting(votersData);
    const quadraticNoAttackResults = quadraticVotingNoAttack(votersData);
    const meanNoAttackResults = meanVotingNoAttack(votersData);
    const quadraticVoterCollusionResults = quadraticVotingVoterCollusionAttack(votersData);
    const quadraticProjectCollusionResults = quadraticVotingProjectCollusionAttack(votersData);
    const meanVoterEpsilonResults = meanVotingVoterEpsilonAttack(votersData);
    const meanProjectEpsilonResults = meanVotingProjectEpsilonAttack(votersData);
    const trueVotingResults = trueVoting(votersData); // Execute the new True Voting

    // Return results of all voting mechanisms
    res.status(200).json({
      maxVotingResults,
      quadraticNoAttackResults,
      meanNoAttackResults,
      quadraticVoterCollusionResults,
      quadraticProjectCollusionResults,
      meanVoterEpsilonResults,
      meanProjectEpsilonResults,
      trueVotingResults, // Include the True Voting results
    });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Error processing files' });
  }
};

export default simulateHandler;
