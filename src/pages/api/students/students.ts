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
      if (typeof id === 'string') {
        const student = students.find((student) => student.id === id);
        if (student) {
          return res.status(200).json(student);
        } else {
          return res.status(404).json({ error: 'Student not found' });
        }
      }
      return res.status(400).json({ error: 'ID query parameter is required' });
    }

    case 'POST': {
      const { name, age, bloodType } = req.body;
      if (!name || age === undefined || !bloodType) {
        return res.status(400).json({ error: 'Missing fields' });
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
      const updateData = req.body;
      if (!updateData.id) {
        return res.status(400).json({ error: 'ID is required for updating' });
      }
      const studentIndex = students.findIndex((student) => student.id === updateData.id);

      if (studentIndex !== -1) {
        students[studentIndex] = { ...students[studentIndex], ...updateData };
        return res.status(200).json(students[studentIndex]);
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    case 'DELETE': {
      const deleteId = req.query.id as string;
      if (!deleteId) {
        return res.status(400).json({ error: 'ID query parameter is required' });
      }
      const deleteIndex = students.findIndex((student) => student.id === deleteId);

      if (deleteIndex !== -1) {
        students.splice(deleteIndex, 1);
        return res.status(204).end();
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    }

    default: {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
