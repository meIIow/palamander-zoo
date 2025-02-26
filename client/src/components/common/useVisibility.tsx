import { useEffect, useRef, useState } from 'react';

type VisibilityOutput = [
  React.MutableRefObject<null | HTMLDivElement>,
  boolean,
];

function useVisibility(container: null | HTMLDivElement): VisibilityOutput {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const evaluateVisibility: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[],
  ) => {
    setIsVisible(!!entries[0]?.isIntersecting);
  };

  useEffect(() => {
    if (!elementRef.current || !container) return;
    const observer = new IntersectionObserver(evaluateVisibility, {
      root: container,
    });
    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [container, elementRef]);

  return [elementRef, isVisible];
}

export type { VisibilityOutput };
export default useVisibility;
