// Absolute base URL for the API + uploads.
// - Empty (default): relative paths, served by Vite dev proxy or nginx in prod.
// - Set at build time via VITE_API_URL when frontend and backend live on
//   different domains (e.g. Railway split services).
const RAW = import.meta.env.VITE_API_URL || '';
export const API_BASE = RAW.replace(/\/+$/, '');

export const apiUrl = (path) => {
  if (!API_BASE) return path;
  return API_BASE + (path.startsWith('/') ? path : '/' + path);
};
