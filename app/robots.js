export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/admin', '/api', '/profile', '/messages', '/properties/add', '/properties/*/edit'],
      },
    ],
    sitemap: 'https://properties-srs5.vercel.app/sitemap.xml',
  };
}
