const API_BASE = import.meta.env.VITE_API_URL ?? '';

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

export const API = {
  auth: {
    signInEmail: apiUrl('/api/auth/sign-in/email'),
  },
  request: {
    getAll: apiUrl('/api/v1/request/getAll'),
    create: apiUrl('/api/v1/request/create'),
    update: apiUrl('/api/v1/request/update'),
    delete: apiUrl('/api/v1/request/delete'),
  },
  trips: {
    getAll: apiUrl('/api/v1/trips/getAll'),
    create: apiUrl('/api/v1/trips/create'),
    delete: apiUrl('/api/v1/trips/delete'),
  },
} as const;
