import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';

interface Student {
  id: string;
  name: string;
  age: number;
  bloodType: string;
}

const SuccessPage = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [updateName, setUpdateName] = useState<string>('');
  const [updateAge, setUpdateAge] = useState<string>('');
  const [updateBloodType, setUpdateBloodType] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const { id, name, age, bloodType } = router.query;
      setUpdateName(typeof name === 'string' ? name : '');
      setUpdateAge(typeof age === 'string' ? age : '');
      setUpdateBloodType(typeof bloodType === 'string' ? bloodType : '');
    }
  }, [isMounted, router.query]);

  const fetchStudentData = useCallback(async () => {
    const { id } = router.query;
    if (id && typeof id === 'string') {
      try {
        const response = await fetch(`/api/students/students?id=${encodeURIComponent(id)}`);
        if (response.ok) {
          const data: Student = await response.json();
          setStudent(data);
          setUpdateName(data.name);
          setUpdateAge(data.age.toString());
          setUpdateBloodType(data.bloodType);
        } else {
          console.error('Failed to fetch student data:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred while fetching student data:', error);
      }
    }
  }, [router.query]);
  
  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleDelete = async () => {
    const { id } = router.query;
    if (typeof id === 'string') {
      try {
        const response = await fetch(`/api/students/students?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          router.push('/success?message=Student%20deleted%20successfully');
        } else {
          console.error('Failed to delete student');
        }
      } catch (error) {
        console.error('An error occurred while deleting student:', error);
      }
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id } = router.query;
    if (typeof id === 'string') {
      try {
        const response = await fetch('/api/students/students', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            name: updateName,
            age: Number(updateAge),
            bloodType: updateBloodType,
          }),
        });
        if (response.ok) {
          const data: Student = await response.json();
          setStudent(data);
          router.push(
            `/success?id=${id}&name=${encodeURIComponent(data.name)}&age=${data.age}&bloodType=${encodeURIComponent(data.bloodType)}&message=Student%20updated%20successfully`
          );
        } else {
          console.error('Failed to update student');
        }
      } catch (error) {
        console.error('An error occurred while updating student:', error);
      }
    }
  };

  const handleRedirectToManageStudentPage = () => {
    router.push('/manage-student');
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <h1 style={styles.header as React.CSSProperties}>Success</h1>
      {isMounted && router.query.message && <p style={styles.message as React.CSSProperties}>{router.query.message}</p>}
      <div style={styles.info as React.CSSProperties}>
        {isMounted && (
          <>
            <p>
              <strong>Student ID:</strong> {router.query.id}
            </p>
            <p>
              <strong>Name:</strong> {router.query.name}
            </p>
            <p>
              <strong>Age:</strong> {router.query.age}
            </p>
            <p>
              <strong>Blood Type:</strong> {router.query.bloodType}
            </p>
          </>
        )}
      </div>

      {student && (
        <div style={styles.formContainer as React.CSSProperties}>
          <h2 style={styles.subHeader as React.CSSProperties}>Update Student</h2>
          <form onSubmit={handleUpdate} style={styles.form as React.CSSProperties}>
            <div style={styles.formGroup as React.CSSProperties}>
              <label htmlFor="updateName" style={styles.label as React.CSSProperties}>
                Name:
              </label>
              <input
                id="updateName"
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
                type="text"
                required
                style={styles.input as React.CSSProperties}
              />
            </div>
            <div style={styles.formGroup as React.CSSProperties}>
              <label htmlFor="updateAge" style={styles.label as React.CSSProperties}>
                Age:
              </label>
              <input
                id="updateAge"
                value={updateAge}
                onChange={(e) => setUpdateAge(e.target.value)}
                type="number"
                required
                style={styles.input as React.CSSProperties}
              />
            </div>
            <div style={styles.formGroup as React.CSSProperties}>
              <label htmlFor="updateBloodType" style={styles.label as React.CSSProperties}>
                Blood Type:
              </label>
              <input
                id="updateBloodType"
                value={updateBloodType}
                onChange={(e) => setUpdateBloodType(e.target.value)}
                type="text"
                required
                style={styles.input as React.CSSProperties}
              />
            </div>
            <button type="submit" style={styles.button as React.CSSProperties}>
              Update
            </button>
          </form>

          <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: '#ff4d4f' }}>
            Delete Student
          </button>
        </div>
      )}

      <button onClick={handleRedirectToManageStudentPage} style={styles.button as React.CSSProperties}>
        Go to Manage Page
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  header: {
    fontSize: '36px',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    fontSize: '18px',
    color: '#28a745',
    marginBottom: '20px',
  },
  info: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    width: '100%',
  },
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
};

export default SuccessPage;
