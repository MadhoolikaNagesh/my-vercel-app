import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request: NextRequest) => {
  // Pass the entire request object to the isPublicRoute function
  if (!isPublicRoute(request)) {
    auth().protect();
  }
});
