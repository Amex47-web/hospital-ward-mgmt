import { useState, useCallback, useEffect } from 'react';
import { wardApi } from '../api/wardApi';
import { bedApi } from '../api/bedApi';

export function useWardDetails(wardId) {
  const [ward, setWard] = useState(null);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWardDetails = useCallback(async () => {
    if (!wardId) return;
    setLoading(true);
    setError(null);
    try {
      const [wardRes, bedsRes] = await Promise.all([
        wardApi.get(wardId),
        bedApi.listByWard(wardId),
      ]);
      setWard(wardRes.data);
      setBeds(bedsRes.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load ward details');
    } finally {
      setLoading(false);
    }
  }, [wardId]);

  useEffect(() => {
    fetchWardDetails();
  }, [fetchWardDetails]);

  return { ward, beds, loading, error, refetch: fetchWardDetails };
}
