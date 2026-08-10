import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'video.movie';
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Fîlîmvan — Sinema & Film İzleme Platformu',
  description = 'En yeni ve popüler sinema eserlerini yüksek kalitede, Türkçe altyazı ve dublaj seçeneğiyle kesintisiz izleyin.',
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
  ogType = 'website',
}) => {
  const siteTitle = title.includes('Fîlîmvan') ? title : `${title} | Fîlîmvan`;
  const currentUrl = canonicalUrl || window.location.href;

  useEffect(() => {
    // 1. Document Title
    document.title = siteTitle;

    // Helper to set or update meta tag
    const setMetaTag = (nameAttr: string, attrValue: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set canonical link
    const setCanonical = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setCanonical(currentUrl);

    // 3. Open Graph Tags
    setMetaTag('property', 'og:title', siteTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', siteTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
  }, [siteTitle, description, currentUrl, ogImage, ogType]);

  return null;
};
