/**
 * Generates an accessible, local SVG initials avatar as a data URI.
 * Works completely offline with zero external network dependencies.
 */
export function getInitialsAvatar(name: string, background?: string): string {
  if (!name) return '';

  const cleanName = name.replace(/^(Dr\.|Fr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : (parts[0] ? parts[0].slice(0, 2).toUpperCase() : 'AS');

  // Deterministic palette if background not specified
  const palettes = [
    { bg: '#0D9488', text: '#FFFFFF' }, // teal
    { bg: '#059669', text: '#FFFFFF' }, // emerald
    { bg: '#0284C7', text: '#FFFFFF' }, // sky
    { bg: '#6366F1', text: '#FFFFFF' }, // indigo
    { bg: '#D97706', text: '#FFFFFF' }, // amber
    { bg: '#E11D48', text: '#FFFFFF' }, // rose
    { bg: '#7C3AED', text: '#FFFFFF' }, // violet
    { bg: '#0891B2', text: '#FFFFFF' }, // cyan
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % palettes.length;
  const color = background ? { bg: background, text: '#FFFFFF' } : palettes[colorIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" rx="28" fill="${color.bg}"/>
    <text x="50" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="38" font-weight="700" fill="${color.text}" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
