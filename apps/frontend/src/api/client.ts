import axios from 'axios';

import type { ApiResponse } from '@audience-builder/shared';

/**
 * Principal-Grade API Client
 *
 * Features:
 * - Automatic Correlation ID injection
 * - Standardized response unwrapping
 * - Global error normalization
 * - Request/Response logging (Observability)
 */

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- 📊 Observability Interceptors ---

apiClient.interceptors.request.use((config) => {
  // Generate a unique correlation ID for this request cycle
  const correlationId = crypto.randomUUID();
  config.headers['x-correlation-id'] = correlationId;

  if (import.meta.env.DEV) {
    console.log(
      `%c[OUTBOUND] ${config.method?.toUpperCase()} ${config.url}`,
      'color: #3b82f6; font-weight: bold;',
      {
        correlationId,
        data: config.data,
      },
    );
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<any>;

    if (import.meta.env.DEV) {
      console.log(
        `%c[INBOUND] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        'color: #10b981; font-weight: bold;',
        {
          status: response.status,
          correlationId: response.config.headers['x-correlation-id'],
          data: data.data,
        },
      );
    }

    return data.data; // Return only the unwrapped data payload
  },
  (error) => {
    const response = error.response?.data as ApiResponse<null>;
    const correlationId = error.config?.headers?.['x-correlation-id'];

    const normalizedError = {
      message: response?.error || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      correlationId,
      metadata: response?.metadata,
    };

    if (import.meta.env.DEV) {
      console.error(
        `%c[ERROR] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        'color: #ef4444; font-weight: bold;',
        normalizedError,
      );
    }

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
