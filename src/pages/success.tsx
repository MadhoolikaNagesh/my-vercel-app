import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SuccessPage = () => {
  const router = useRouter();
  const { id, name, age, bloodType, message } = router.query;

  const [student, setStudent] = useState<any>(null);
  const [updateName, setUpdateName] = useState(name || '');
  const [updateAge, setUpdateAge] = useState(age || '');
  const [updateBloodType, setUpdateBloodType] = useState(bloodType || '');

  useEffect(() => {
    if (id) {
      fetchStudentData();
    }
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`/api/students?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setUpdateName(data.name);
        setUpdateAge(data.age);
        setUpdateBloodType(data.bloodType);
      } else {
        console.error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('An error occurred while fetching student data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/students?id=${id}`, {
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
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name: updateName, age: Number(updateAge), bloodType: updateBloodType }),
      });
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        router.push(`/success?id=${id}&name=${encodeURIComponent(data.name)}&age=${data.age}&bloodType=${encodeURIComponent(data.bloodType)}&message=Student%20updated%20successfully`);
      } else {
        console.error('Failed to update student');
      }
    } catch (error) {
      console.error('An error occurred while updating student:', error);
    }
  };

  const handleRedirectToManagePage = () => {
    router.push('/manage-student');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Success</h1>
      {message && <p style={styles.message}>{message}</p>}
      <div style={styles.info}>
        <p><strong>Student ID:</strong> {id}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Blood Type:</strong> {bloodType}</p>
      </div>

      {student && (
        <div style={styles.formContainer}>
          <h2 style={styles.subHeader}>Update Student</h2>
          <form onSubmit={handleUpdate} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="updateName" style={styles.label}>Name:</label>
              <input
                id="updateName"
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
                type="text"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="updateAge" style={styles.label}>Age:</label>
              <input
                id="updateAge"
                value={updateAge}
                onChange={(e) => setUpdateAge(Number(e.target.value))}
                type="number"
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="updateBloodType" style={styles.label}>Blood Type:</label>
              <input
                id="updateBloodType"
                value={updateBloodType}
                onChange={(e) => setUpdateBloodType(e.target.value)}
                type="text"
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>Update</button>
          </form>

          <button onClick={handleDelete} style={{ ...styles.button, backgroundColor: '#ff4d4f' }}>Delete Student</button>
        </div>
      )}

      <button onClick={handleRedirectToManagePage} style={styles.button}>Go to Manage Page</button>
    </div>
  );
};

export default SuccessPage;

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
