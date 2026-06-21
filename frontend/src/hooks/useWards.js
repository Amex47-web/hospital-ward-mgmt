import { useState, useCallback, useEffect } from 'react';
import { wardApi } from '../api/wardApi';

export function useWards() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await wardApi.list();
      setWards(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load wards');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  return { wards, loading, error, refetch: fetchWards };
}
