// pages/api/students/students.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Student {
  id: string;
  name: string;
  age: number;
  bloodType: string;
}

let students: Student[] = []; // Mock database

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, age, bloodType } = req.body;

    // Basic validation
    if (!name || !age || !bloodType) {
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
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
