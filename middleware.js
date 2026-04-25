import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    if (req.nextauth.token?.role !== 'admin') {
      const path = req.nextUrl.pathname;
      if (path.startsWith('/properties/add') || path.match(/\/properties\/[^/]+\/edit/)) {
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
  matcher: ['/properties/add', '/properties/:id/edit'],
};
