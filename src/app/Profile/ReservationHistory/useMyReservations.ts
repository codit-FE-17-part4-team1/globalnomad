import { useEffect, useState } from 'react';

export const useMyReservations = () => {
  const API_PATH = '/api/myreservations';
  const [myData, setMyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const myReservations = async (cursorId?: number, size: number = 20) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (cursorId) queryParams.append('cursorId', cursorId.toString());
        queryParams.append('size', size.toString());

        const res = await fetch(`${API_PATH}?${queryParams.toString()}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!res.ok) {
          const errorDate = await res.json().catch(() => ({}));
          throw new Error(
            errorDate.message || `Network response was not ok (${res.status})`
          );
        }

        const data = await res.json();
        setMyData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    myReservations();
  }, []);

  return { myData, loading, error };
};
