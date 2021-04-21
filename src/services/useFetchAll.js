import { useState, useRef, useEffect } from 'react';

export default function useFetchAll(urls) {
  const prevUrls = useRef([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(false);

  const dedupedUrls = Array.from(new Set(urls));

  useEffect(() => {
    isMounted.current = true;
    // Only run if the array of URLs passed in changes
    if (areEqual(prevUrls.current, dedupedUrls)) {
      if (isMounted) {
        setLoading(false);
      }
      return;
    }
    prevUrls.current = dedupedUrls;

    const promises = dedupedUrls.map((url) =>
      fetch(process.env.REACT_APP_API_BASE_URL + url).then((response) => {
        if (response.ok) return response.json();
        throw response;
      }),
    );

    Promise.all(promises)
      .then((json) => {
        if (isMounted.current) setData(json);
      })
      .catch((e) => {
        console.error(e);
        if (isMounted.current) setError(e);
      })
      .finally(() => setLoading(false));

    return () => {
      isMounted.current = false;
    };
  }, [dedupedUrls]);

  return { data, loading, error };
}

function areEqual(array1, array2) {
  return (
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}
