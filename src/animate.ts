import { EasingFunction } from '@/components/snap-infinite-carousel/use-carousel';

interface scrollProps {
  element: any;
  startX: number;
  targetX: number;
  duration: number;
  easing: EasingFunction;
  done: () => void;
}
export function scrollHorizontally({
  element,
  startX,
  targetX,
  duration = 1000,
  easing = 'linear',
  done
}: scrollProps) {
  const startTime = performance.now();

  function updateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = ease(easing, progress);
    element.scrollLeft = startX + (targetX - startX) * easedProgress;

    if (progress < 1) {
      requestAnimationFrame(updateScroll);
    } else {
      done?.();
    }
  }
  requestAnimationFrame(updateScroll);
}

function ease(easing, t) {
  switch (easing) {
    case 'linear':
      return t;
    case 'easeIn':
      return t * t;
    case 'easeOut':
      return t * (2 - t);
    case 'easeInOut':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    default:
      return t;
  }
}
