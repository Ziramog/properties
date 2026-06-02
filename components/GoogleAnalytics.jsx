'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-PW4FH9WHQB';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  // Track page views on route changes (SPA navigation)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const allowedHosts = ['localhost', 'roggeroyroma.com', 'www.roggeroyroma.com', 'roggeroyroma.com.ar', 'www.roggeroyroma.com.ar'];
    
    if (!allowedHosts.includes(hostname)) return;
    if (!window.gtag) return;

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  // Only render script on allowed hosts
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const allowedHosts = ['localhost', 'roggeroyroma.com', 'www.roggeroyroma.com', 'roggeroyroma.com.ar', 'www.roggeroyroma.com.ar'];
    if (!allowedHosts.includes(hostname)) return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
            });
          `,
        }}
      />
    </>
  );
}
