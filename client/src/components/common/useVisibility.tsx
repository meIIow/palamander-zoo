import { useEffect, useRef, useState } from 'react';

import type { ContainerRef } from './container-context.ts';

type VisibilityOutput = [
  React.MutableRefObject<null | HTMLDivElement>,
  boolean,
];

function useVisibility(containerRef: ContainerRef): VisibilityOutput {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const evaluateVisibility: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
  ) => {
    setIsVisible(!!entries[0]?.isIntersecting);
  };

  useEffect(() => {
    if (!elementRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(evaluateVisibility, {
      root: containerRef.current,
    });
    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [containerRef, elementRef]); // may be a race case - but seems to work

  return [elementRef, isVisible];
}

export type { VisibilityOutput };
export default useVisibility;
