import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';
 
const isProtectedRoute = createRouteMatcher([
  '/',
  '/groups/createGroup',
  /^\/groups\/editGroup\/[a-zA-Z0-9]+$/
]);
 
export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});
 
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};