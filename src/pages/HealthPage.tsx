import { useEffect, useState } from 'react';
import api from '../services/apiClient';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export const HealthPage = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<HealthResponse>('/api/health');
        setData(response.data);
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load health status');
      }
    };

    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-slate-100">Backend Health</h1>
      {error && (
        <div className="rounded bg-red-900/40 border border-red-600 px-4 py-3 text-red-100">
          Error: {error}
        </div>
      )}
      {data && !error && (
        <div className="rounded bg-emerald-900/30 border border-emerald-600 px-4 py-3 text-emerald-100">
          <p>Status: {data.status}</p>
          <p className="text-sm text-emerald-200 mt-1">Timestamp: {data.timestamp}</p>
        </div>
      )}
    </div>
  );
};

