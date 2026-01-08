/**
 * Preconnect links component for better performance
 * This component adds preconnect links to external domains
 */
export function PreconnectLinks() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sfb.vn';
  const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  
  return (
    <>
      {/* Preconnect to Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preconnect to API if external */}
      {apiBaseUrl && (apiBaseUrl.startsWith('http://') || apiBaseUrl.startsWith('https://')) && (
        <link rel="preconnect" href={apiBaseUrl} />
      )}
      
      {/* DNS prefetch for common external resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    </>
  );
}

