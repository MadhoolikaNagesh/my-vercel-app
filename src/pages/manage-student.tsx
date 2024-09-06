import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';

const ManageStudentPage = () => {
  const { isSignedIn } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [studentData, setStudentData] = useState<any>(null);
  const [updateName, setUpdateName] = useState('');
  const [updateAge, setUpdateAge] = useState<number | ''>('');
  const [updateBloodType, setUpdateBloodType] = useState('');
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  const handleFetch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/students/students?id=${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        setUpdateName(data.name);
        setUpdateAge(data.age);
        setUpdateBloodType(data.bloodType);
      } else if (response.status === 404) {
        alert('Invalid ID: Student not found');
        setStudentData(null);
        setUpdateName('');
        setUpdateAge('');
        setUpdateBloodType('');
      } else {
        console.error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('An error occurred while fetching student data:', error);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/students/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: studentId, name: updateName, age: Number(updateAge), bloodType: updateBloodType }),
      });
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        alert('Student updated successfully');
        router.push(`/success?id=${studentId}&name=${encodeURIComponent(data.name)}&age=${data.age}&bloodType=${encodeURIComponent(data.bloodType)}&message=Student%20updated%20successfully`);
      } else {
        console.error('Failed to update student');
      }
    } catch (error) {
      console.error('An error occurred while updating student:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/students/students?id=${studentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Student deleted successfully');
        setStudentData(null);
        setUpdateName('');
        setUpdateAge('');
        setUpdateBloodType('');
        router.push(`/success?message=Student%20deleted%20successfully`);
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('An error occurred while deleting student:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h1 style={styles.heading}>Manage Student</h1>
        <form onSubmit={handleFetch} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="studentId" style={styles.label}>Student ID:</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Fetch Student</button>
        </form>

        {studentData && (
          <div style={styles.studentInfo}>
            <h2 style={styles.subheading}>Student Details</h2>
            <p style={styles.studentDetail}>ID: {studentData.id}</p>
            <p style={styles.studentDetail}>Name: {studentData.name}</p>
            <p style={styles.studentDetail}>Age: {studentData.age}</p>
            <p style={styles.studentDetail}>Blood Type: {studentData.bloodType}</p>

            <h3 style={styles.subheading}>Update Student</h3>
            <form onSubmit={handleUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label htmlFor="updateName" style={styles.label}>Name:</label>
                <input
                  id="updateName"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  style={styles.input}
                  type="text"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="updateAge" style={styles.label}>Age:</label>
                <input
                  id="updateAge"
                  value={updateAge}
                  onChange={(e) => setUpdateAge(Number(e.target.value))}
                  style={styles.input}
                  type="number"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="updateBloodType" style={styles.label}>Blood Type:</label>
                <input
                  id="updateBloodType"
                  value={updateBloodType}
                  onChange={(e) => setUpdateBloodType(e.target.value)}
                  style={styles.input}
                  type="text"
                  required
                />
              </div>
              <button type="submit" style={styles.button}>Update</button>
            </form>
            <button onClick={handleDelete} style={styles.deleteButton}>Delete Student</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudentPage;

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  formWrapper: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  form: {
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#005bb5',
  },
  studentInfo: {
    textAlign: 'left',
    marginTop: '20px',
  },
  subheading: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  studentDetail: {
    marginBottom: '8px',
  },
  deleteButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '20px',
  },
};
