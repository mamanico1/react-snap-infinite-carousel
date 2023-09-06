import { Ref, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { scrollHorizontally } from './animate';
import { debounce } from './timing';
import { useObservableRef } from './use-observable-ref';

enum ScrollDirection {
  LEFT = -1,
  RIGHT = 1
}

export type EasingFunction = 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut';

function scrollBase(scrollRef: Ref<any>) {
  // @ts-ignore
  return scrollRef.current || undefined;
}

export function useCarousel(
  count: number,
  autoScroll: boolean,
  infiniteScroll: boolean,
  transitionTime: number,
  timing: number,
  easingFunction: EasingFunction
) {
  const [scrollRef, updateRef, updateCount] = useObservableRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const intervalRef = useRef(null);
  const [animationTiming, setAnimationTiming] = useState(4000);
  const [autoTransitionEnable, setAutoTransitionEnable] = useState(autoScroll && count > 1);

  useEffect(() => {
    if (scrollRef) {
      scrollBase(scrollRef).addEventListener('scroll', onScroll);
      scrollBase(scrollRef).addEventListener('touchstart', onTouchStart);
      scrollBase(scrollRef).addEventListener('touchmove', onTouchMove);
      scrollBase(scrollRef).addEventListener('touchend', onTouchEnd);
    }
    const element = scrollBase(scrollRef);
    return () => {
      element.removeEventListener('scroll', onScroll);
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [updateCount]);

  useLayoutEffect(() => {
    if (infiniteScroll) {
      scrollBase(scrollRef).scrollLeft =
        scrollBase(scrollRef).scrollLeft + count * scrollBase(scrollRef).clientWidth;
    }
  }, []);

  useMemo(() => {
    // @ts-ignore
    const seconds = timing;
    if (seconds < 3) {
      setAnimationTiming(3500);
    } else if (seconds > 20) {
      setAnimationTiming(20500);
    } else {
      setAnimationTiming(seconds * 1000 + 500);
    }
  }, [timing]);

  function onTouchStart(e): void {
    e.stopPropagation();
    setAutoTransitionEnable(false);
  }

  function onTouchMove(e): void {
    e.stopPropagation();
    setAutoTransitionEnable(false);
  }

  function onTouchEnd(e): void {
    e.stopPropagation();
    setAutoTransitionEnable(autoScroll);
  }

  function setSnapAlign(align: string): void {
    for (const child of scrollBase(scrollRef).children) {
      child.style.scrollSnapAlign = `${align}`;
    }
  }

  function scrollTo(step = 1, idx?: number) {
    if (idx !== undefined && !isNaN(idx)) {
      step = Math.abs(scrollPos - idx);
      step = idx < scrollPos ? (step *= -1) : step;
    }
    const scrollLeft = scrollBase(scrollRef).scrollLeft;
    const scrollTarget = step * scrollBase(scrollRef).clientWidth;
    setSnapAlign('unset');

    const element = scrollBase(scrollRef);
    const startX = scrollLeft;
    const targetX = scrollLeft + scrollTarget;
    const duration = transitionTime;
    const easing = easingFunction;
    const done = () => {
      setSnapAlign('center');
    };
    scrollHorizontally({ element, startX, targetX, duration, easing, done });
  }

  const onNext = useCallback(
    (ev?: any) => {
      ev && ev.preventDefault();
      ev && ev.stopPropagation();
      if (scrollPos >= count && !infiniteScroll) {
        return;
      }
      scrollTo(ScrollDirection.RIGHT);
    },
    [autoScroll, count, scrollPos, scrollTo]
  );

  const onPrev = useCallback(
    (ev?: any) => {
      ev && ev.preventDefault();
      ev && ev.stopPropagation();
      if (scrollPos <= 0 && !infiniteScroll) {
        return;
      }
      scrollTo(ScrollDirection.LEFT);
    },
    [autoScroll, scrollPos, scrollTo]
  );

  function onReachEnd(direction) {
    const base = scrollBase(scrollRef);
    requestAnimationFrame(
      () => (base.scrollLeft = base.scrollLeft - direction * count * base.clientWidth)
    );
  }

  const onScroll = debounce((ev) => {
    const scrolledLeft = ev.target.scrollLeft;
    const clientWidth = ev.target.clientWidth;
    if (infiniteScroll) {
      if (scrolledLeft <= clientWidth) {
        onReachEnd(ScrollDirection.LEFT);
      } else if (scrolledLeft >= clientWidth * (count * 3 - 1)) {
        onReachEnd(ScrollDirection.RIGHT);
      }
    }
    setScrollPos(Math.round(ev.target.scrollLeft / ev.target.clientWidth) % count);
  }, 150);

  useEffect(() => {
    const interval = intervalRef.current;
    if (interval) {
      clearInterval(interval);
    }
    if (autoTransitionEnable) {
      // @ts-ignore
      intervalRef.current = setInterval(onNext, animationTiming);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [onNext, onPrev, animationTiming, autoTransitionEnable]);

  return {
    scrollRef: updateRef,
    scrollPos,
    scrollTo,
    onNext,
    onPrev
  };
}
