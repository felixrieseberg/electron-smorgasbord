// Constants
export const releasesFile = process.platform === 'win32'
  ? 'RELEASES'
  : 'releases.json';

export const originalEnv = { ...process.env };
