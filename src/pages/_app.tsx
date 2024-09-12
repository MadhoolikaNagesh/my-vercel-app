import { ClerkProvider,  SignedIn,  UserButton } from '@clerk/nextjs'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      
      <SignedIn>
        <UserButton />
      </SignedIn>
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
