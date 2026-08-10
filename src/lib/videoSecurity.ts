// Video Embed Hostname Whitelist
const ALLOWED_HOSTNAMES = [
  'archive.org',
  'www.archive.org',
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'vimeo.com',
  'player.vimeo.com',
  'googleapis.com',
  'commondatastorage.googleapis.com',
  'storage.googleapis.com',
  'wikimedia.org',
  'upload.wikimedia.org',
  'b-cdn.net',
  'cloudfront.net',
  'google.com',
  // Vdohide & StreamHide Embed Providers
  'vdohide.com',
  'vdohide.org',
  'vdohide.net',
  'vidhide.com',
  'vidhidepro.com',
  'vidhide.pro',
  'streamhide.com',
  'streamhide.to',
  'filelions.to',
  'filelions.com',
  'filelions.online',
  'doodstream.com',
  'dood.to',
  'mixdrop.co',
];

export function isAllowedVideoUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsedUrl = new URL(urlStr);
    const hostname = parsedUrl.hostname.toLowerCase();

    return ALLOWED_HOSTNAMES.some(
      (allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`)
    );
  } catch (e) {
    return false;
  }
}

export function getVideoEmbedType(urlStr: string): 'html5' | 'iframe' | 'unallowed' {
  if (!isAllowedVideoUrl(urlStr)) return 'unallowed';

  const lower = urlStr.toLowerCase();
  if (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.ogg') ||
    lower.includes('gtv-videos-bucket') ||
    lower.includes('upload.wikimedia.org')
  ) {
    return 'html5';
  }

  return 'iframe';
}
