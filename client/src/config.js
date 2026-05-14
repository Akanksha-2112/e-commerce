// Centralised API base URL.
// Override at build/run time via CRA env var: REACT_APP_API_URL
// e.g.  REACT_APP_API_URL=http://localhost:5000
// Falls back to the deployed Render origin so existing deployments keep working
// if the env var is not provided.
export const API_BASE = process.env.REACT_APP_API_URL || 'https://e-commerce-2e5z.onrender.com';
