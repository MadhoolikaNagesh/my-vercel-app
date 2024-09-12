import Head from "next/head";
import React from 'react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import StudentForm from '../components/StudentForm';

const HomePage = () => {
  return (
    <div style={inlineStyles.container}>
      <Head>
        <title>Student Details</title>
      </Head>

      <div style={inlineStyles.contentWrapper}>
        <SignedOut>
          <p style={inlineStyles.message}>Please sign in to access the form.</p>
          <SignInButton>
            <button
              style={inlineStyles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = inlineStyles.buttonHover.backgroundColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = inlineStyles.button.backgroundColor)}
            >
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <StudentForm />
        </SignedIn>
      </div>
    </div>
  );
};

export default HomePage;

// Inline Styles
const inlineStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7f8fa',
    fontFamily: 'var(--font-geist-sans)', // Use your custom font
  },
  contentWrapper: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const, // Use `as const` instead of literal type assertion
    width: '100%',
    maxWidth: '500px',
  },
  message: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#333',
  },
  button: {
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#005bb5',
  },
};
