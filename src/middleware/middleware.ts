import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware((auth, request) => {
  const { pathname } = new URL(request.url);
  
  if (!isPublicRoute(pathname)) {
    auth().protect();
  }
});
