import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css"; // Keep this for the imported CSS module

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
            <button style={inlineStyles.button}>Sign In</button>
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
    textAlign: 'center',
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
