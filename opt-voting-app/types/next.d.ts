// types/next.d.ts
import { FileArray } from 'multer';

// Declare a module to extend the NextApiRequest interface
declare module 'next' {
  import { NextApiRequest } from 'next';

  // Extend the NextApiRequest to include files
  export interface NextApiRequest {
    files?: FileArray; // The files property is added by multer
  }
}
