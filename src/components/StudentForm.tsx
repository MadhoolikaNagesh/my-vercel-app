import { useState } from 'react';
import { useRouter } from 'next/router';
import React from 'react';

const StudentForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [bloodType, setBloodType] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const ageNumber = age === '' ? undefined : Number(age);

    try {
      const response = await fetch('/api/students/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, age: ageNumber, bloodType }),
      });

      if (response.ok) {
        const data = await response.json();
        const { id } = data;
        router.push(`/success?id=${id}&name=${encodeURIComponent(name)}&age=${ageNumber}&bloodType=${encodeURIComponent(bloodType)}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to submit form:', errorData);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.form}>
      <div style={formStyles.formGroup}>
        <label htmlFor="name" style={formStyles.label}>Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={formStyles.input}
        />
      </div>
      <div style={formStyles.formGroup}>
        <label htmlFor="age" style={formStyles.label}>Age:</label>
        <input
          id="age"
          type="number"
          value={age === '' ? '' : age}
          onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
          required
          style={formStyles.input}
        />
      </div>
      <div style={formStyles.formGroup}>
        <label htmlFor="bloodType" style={formStyles.label}>Blood Type:</label>
        <input
          id="bloodType"
          type="text"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          required
          style={formStyles.input}
        />
      </div>
      <button type="submit" style={formStyles.button}>Submit</button>
    </form>
  );
};

export default StudentForm;

// Inline Styles
const formStyles = {
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    maxWidth: '400px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#f7f8fa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    marginBottom: '8px',
    fontSize: '16px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#0070f3',
  },
  button: {
    padding: '12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    fontSize: '16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#005bb5',
  },
};
