'use client';

import Script from 'next/script';

// TODO: Reemplazar con el Measurement ID real de GA4
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('[GA4] Measurement ID no configurado. Reemplazar G-XXXXXXXXXX en components/GoogleAnalytics.jsx');
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
