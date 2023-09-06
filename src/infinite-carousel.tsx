import { setup, styled } from 'goober';
import React, { useMemo } from 'react';
import { useCarousel, EasingFunction } from './use-carousel';
import { Dots } from  './dots';

setup(React.createElement);

interface Props {
  children: React.ReactNode[];
  autoScroll?: boolean;
  infiniteScroll?: boolean;
  interval?: number;
  transitionTime?: number;
  easingFunction?: EasingFunction;
}

export default function InfiniteCarousel({
  children,
  autoScroll = true,
  interval = 4,
  infiniteScroll = true,
  transitionTime = 1500,
  easingFunction = 'ease'
}: Props) {
  const blocksCount = children.length;
  const { scrollRef, scrollPos, onNext, onPrev, scrollTo } = useCarousel(
    blocksCount,
    autoScroll,
    infiniteScroll,
    transitionTime,
    interval,
    easingFunction
  );

  const elements = useMemo(() => {
    if (infiniteScroll && children.length > 1) {
      return [...children, ...children, ...children];
    }
    return children;
  }, [children, infiniteScroll]);

  if (children.length <= 0) return null;
  return (
    <Wrapper>
      <div style={{ width: '100%', position: 'relative' }}>
        <Carousel count={blocksCount} autoscroll={autoScroll} ref={scrollRef}>
          {elements}
        </Carousel>
        <Dots
          count={blocksCount}
          selectedIdx={scrollPos}
          onDotClicked={(idx) => scrollTo(1, idx)}
        />
        <Prev
          className="left-arrow arrow"
          style={{ opacity: scrollPos === 0 && !infiniteScroll ? `0` : `1` }}
          onClick={onPrev}>
          {'ᐸ'}
        </Prev>
        <Next
          className="right-arrow arrow"
          style={{
            opacity: scrollPos === blocksCount - 1 && !infiniteScroll ? `0` : `1`
          }}
          onClick={onNext}>
          {'ᐳ'}
        </Next>
      </div>
    </Wrapper>
  );
}
const Wrapper = styled(`div`)`
  width: 100%;
  max-width: 100vw;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  & > * {
    width: 100%;
    max-width: 100%;
  }
  position: relative;
  overflow: hidden;
  *::-webkit-scrollbar {
    display: none;
  }
  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const Prev = styled('div')`
  position: absolute;
  width: 40px;
  height: 40px;
  left: 20px;
  top: calc(50% - 20px);
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.17);
  cursor: pointer;
  border-radius: 50%;
  @media (max-width: 767px) {
    display: none;
  }
`;

const Next = styled('div')`
  position: absolute;
  width: 40px;
  height: 40px;
  right: 20px;
  top: calc(50% - 20px);
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0 6px 14px 0 rgba(0, 0, 0, 0.17);
  cursor: pointer;
  border-radius: 50%;
  @media (max-width: 767px) {
    display: none;
  }
`;
type CarouselProps = {
  count: number;
  autoscroll: boolean;
};

const Carousel = styled(`div`, React.forwardRef)`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
  display: grid;
  grid-template-columns: repeat(
    ${(props: CarouselProps) => (props.autoscroll ? props.count * 3 : props.count)},
    100%
  );
  grid-auto-flow: column;
  grid-gap: 10px;

  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  & > * {
    scroll-behavior: smooth;
    scroll-snap-align: center;
  }
`;
