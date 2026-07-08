'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { shouldTrackPath } from '@/utils/analytics';

export default function GoogleAnalytics({ analyticsId, facebookPixelId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hostname = window.location.hostname;
    const allowedHosts = ['localhost', 'roggeroyroma.com', 'www.roggeroyroma.com', 'roggeroyroma.com.ar', 'www.roggeroyroma.com.ar'];
    
    if (!allowedHosts.includes(hostname)) return;

    // Track Google Analytics page views manually
    if (analyticsId && window.gtag) {
      if (shouldTrackPath(pathname)) {
        const query = searchParams?.toString();
        const pagePath = query ? `${pathname}?${query}` : pathname;

        window.gtag('event', 'page_view', {
          page_path: pagePath,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
    }

    // Track Facebook Pixel page views
    if (facebookPixelId && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams, analyticsId, facebookPixelId]);

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const allowedHosts = ['localhost', 'roggeroyroma.com', 'www.roggeroyroma.com', 'roggeroyroma.com.ar', 'www.roggeroyroma.com.ar'];
    if (!allowedHosts.includes(hostname)) return null;
  }

  return (
    <>
      {/* Google Analytics */}
      {analyticsId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analyticsId}', {
                  send_page_view: false,
                });
              `,
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
