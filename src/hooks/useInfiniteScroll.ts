/**
 * 무한 스크롤 커스텀 훅
 * - 스크롤이 특정 지점에 도달하면 추가 데이터 로드
 *
 * @param targetRef - 관찰할 DOM 요소
 * @param onIntersect - 교차 시 실행할 콜백
 * @param threshold - 교차 임계값 (기본값: 0.5)
 * @param rootMargin - 루트 마진 (기본값: "0px")
 */
import { useEffect, useCallback, RefObject } from "react";

interface UseInfiniteScrollProps {
  targetRef: RefObject<HTMLDivElement>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  targetRef,
  onIntersect,
  threshold = 0.5,
  rootMargin = "0px",
}: UseInfiniteScrollProps) => {
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      });
    },
    [onIntersect]
  );

  useEffect(() => {
    if (!targetRef.current) return;

    // Intersection Observer 설정
    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin,
    });

    observer.observe(targetRef.current);

    // 컴포넌트 언마운트시 Observer 해제
    return () => observer.disconnect();
  }, [targetRef, handleIntersect, threshold, rootMargin]);
};
