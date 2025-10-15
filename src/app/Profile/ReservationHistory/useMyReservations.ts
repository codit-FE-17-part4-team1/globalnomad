import { useEffect, useState } from 'react';

export const useMyReservations = () => {
  const BASE_URL = 'https://sp-globalnomad-api.vercel.app/17-1/';
  const path = 'my-reservations';
  const [myData, setMyData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}${path}`);
        const data = await res.json();
        setMyData(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);
  return { myData, loading };
};
