// pages/api/simulate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Extend NextApiRequest to include Multer's file typings
interface MulterNextApiRequest extends NextApiRequest {
  files: {
    [key: string]: Express.Multer.File[];
  };
}

const uploadDir = path.join(process.cwd(), 'uploads');

// Ensure the uploads directory exists
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

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Disable Next.js body parsing to allow multer to handle form-data
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

// Wrapper for Next.js to handle custom middleware
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

const simulateHandler = async (req: MulterNextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, multerMiddleware);

  const voterFile = req.files?.['voterFile']?.[0]; // Access the first 'voterFile'
  const votingPowerFile = req.files?.['votingPowerFile']?.[0]; // Access the first 'votingPowerFile'

  if (!voterFile || !votingPowerFile) {
    return res.status(400).json({ error: 'Files are missing' });
  }

  // Example: Read the files and do something with them (process them for your simulation)
  const resultFilePath = path.join(uploadDir, 'simulation-result.csv');
  
  // Simulate generating a CSV result
  fs.writeFileSync(resultFilePath, 'Column1,Column2\nData1,Data2\n'); // Example CSV data

  res.setHeader('Content-Disposition', 'attachment; filename=simulation-result.csv');
  res.setHeader('Content-Type', 'text/csv');
  fs.createReadStream(resultFilePath).pipe(res); // Stream the file back to the client
};

export default simulateHandler;
