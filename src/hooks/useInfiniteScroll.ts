import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchData: (cursor?: string | null) => Promise<{
    data: T[];
    nextCursor: string | null;
  }>;
  threshold?: number;
  pageSize?: number;
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
  lastElementRef: (node: HTMLElement | null) => void;
  reset: () => void;
}

export function useInfiniteScroll<T>({
  fetchData,
  threshold = 0.5,
  pageSize = 10,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null); //스크롤 감지
  const bufferRef = useRef<T[]>([]); //임시저장
  const nextCursorRef = useRef<string | null>(null);

  const consumeFromBuffer = (count: number) => {
    const take = bufferRef.current.slice(0, count); //
    bufferRef.current = bufferRef.current.slice(count);
    return take;
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      // 버퍼에 데이터가 남아있는 경우 -> api 호출 안함
      if (bufferRef.current.length > 0) {
        const take = consumeFromBuffer(
          Math.min(pageSize, bufferRef.current.length)
        );
        setData((prev) => [...prev, ...take]);
        setIsLoading(false);
        return;
      }
      // 버퍼가 비었으면 api 호출
      const result = await fetchData(nextCursorRef.current);
      // 데이터가 없으면 종료
      if (
        (result.nextCursor !== null &&
          result.nextCursor === nextCursorRef.current) ||
        !result.data ||
        result.data.length === 0
      ) {
        setHasMore(false);
        nextCursorRef.current = result.nextCursor ?? null;
        setIsLoading(false);
        return;
      }
      // 데이터가 있으면 버퍼에 저장후 다음 커서로 이동
      bufferRef.current = result.data;
      nextCursorRef.current = result.nextCursor;

      const take = consumeFromBuffer(
        Math.min(pageSize, bufferRef.current.length)
      );
      setData((prev) => [...prev, ...take]);
      // 더 불러올 데이터 있는지 확인
      setHasMore(
        nextCursorRef.current !== null || bufferRef.current.length > 0
      );
    } catch (err) {
      setIsError(true);
      setError(
        err instanceof Error
          ? err
          : new Error('데이터를 불러오는데 오류가 발생했습니다.')
      );
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, pageSize, fetchData]);

  // 마지막 요소 감지
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore, threshold]
  );
  // 초기 로드시 초기화 (사용자 진입시 실행)
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      loadMore();
    }
  }, [isInitialized, loadMore]);
  // 전체 데이터 초기화
  const reset = useCallback(() => {
    setData([]);
    nextCursorRef.current = null;
    bufferRef.current = [];
    setHasMore(true);
    setIsError(false);
    setError(null);
    setIsInitialized(false);
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    hasMore,
    lastElementRef,
    reset,
  };
}
