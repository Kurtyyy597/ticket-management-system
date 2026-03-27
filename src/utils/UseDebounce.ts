import { useEffect, useState } from "react";

export function useDebounce<V>(value: V, delay = 300): V {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debounceValue;
}