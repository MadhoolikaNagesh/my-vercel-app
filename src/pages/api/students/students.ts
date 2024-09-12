import type { NextApiRequest, NextApiResponse } from 'next';

interface Student {
  id: string;
  name: string;
  age: number;
  bloodType: string;
}

// Mock database (use an actual database in production)
const students: Student[] = [];

// Debugging function to log requests
const logRequest = (req: NextApiRequest) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logRequest(req); // Log the request for debugging

  switch (req.method) {
    case 'GET': {
      const { id } = req.query;
      console.log('ID received in GET request:', id);
      if (typeof id === 'string') {
        const student = students.find((student) => student.id === id);
        if (student) {
          return res.status(200).json(student);
        } else {
          console.error('Student not found:', id);
          return res.status(404).json({ error: 'Student not found' });
        }
      }
      console.error('ID query parameter is required');
      return res.status(400).json({ error: 'ID query parameter is required' });
    }

    case 'POST': {
      const { name, age, bloodType } = req.body;
      if (!name || typeof age !== 'number' || !bloodType) {
        console.error('Missing or invalid fields in POST request');
        return res.status(400).json({ error: 'Missing or invalid fields' });
      }

      const newStudent: Student = {
        id: (students.length + 1).toString(),
        name,
        age,
        bloodType,
      };

      students.push(newStudent);
      return res.status(201).json(newStudent);
    }

    case 'PUT': {
      const updateData: Student = req.body;
      if (!updateData.id || !updateData.name || typeof updateData.age !== 'number' || !updateData.bloodType) {
        console.error('Missing or invalid fields in PUT request');
        return res.status(400).json({ error: 'Missing or invalid fields' });
      }
      const studentIndex = students.findIndex((student) => student.id === updateData.id);

      if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...updateData };
        return res.status(200).json(students[studentIndex]);
      } else {
        console.error('Student not found for update:', updateData.id);
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    case 'DELETE': {
      const deleteId = req.query.id as string;
      if (!deleteId) {
        console.error('ID query parameter is required for DELETE request');
        return res.status(400).json({ error: 'ID query parameter is required' });
      }
      const deleteIndex = students.findIndex((student) => student.id === deleteId);

      if (deleteIndex !== -1) {
        students.splice(deleteIndex, 1);
        return res.status(204).end();
      } else {
        console.error('Student not found for deletion:', deleteId);
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      console.error(`Method ${req.method} not allowed`);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
