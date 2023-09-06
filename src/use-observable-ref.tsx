import { Ref, useCallback, useRef, useState } from 'react';

export function useObservableRef<T>(
  initialValue: T | null | undefined
): [Ref<T>, (value: T) => void, number] {
  const ref = useRef(initialValue);
  const [updateCount, setUpdateCount] = useState(0);

  const updateRef = useCallback((value) => {
    ref.current = value;
    setUpdateCount((prevCount) => prevCount + 1);
  }, []);

  // @ts-ignore
  return [ref, updateRef, updateCount];
}
