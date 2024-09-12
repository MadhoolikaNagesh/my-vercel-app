// src/pages/api/students.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (id) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: Number(id) },
      });
      if (student) {
        res.status(200).json(student);
      } else {
        res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ error: 'Failed to fetch student' });
    }
  } else {
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, age, bloodType } = req.body;

  if (!name || typeof age !== 'number' || !bloodType) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const student = await prisma.student.create({
      data: { name, age, bloodType },
    });
    res.status(201).json(student);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const { id, name, age, bloodType } = req.body;

  if (!id || !name || typeof age !== 'number' || !bloodType) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const student = await prisma.student.update({
      where: { id: Number(id) },
      data: { name, age, bloodType },
    });
    res.status(200).json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    await prisma.student.delete({
      where: { id: Number(id) },
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
}
