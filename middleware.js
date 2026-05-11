import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Admin-only routes
    if (path.startsWith('/properties/add') || path.startsWith('/admin') || path.match(/\/properties\/[^/]+\/edit/)) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/properties', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/properties/add', '/properties/:id/edit', '/admin'],
};
