import React, { useEffect, useState } from 'react';
import { setup, styled } from 'goober';

setup(React.createElement);

export interface Props {
  count: number;
  onDotClicked?: (idx: number) => void;
  selectedIdx: number;
}

export function Dots({ count, onDotClicked, selectedIdx }: Props) {
  const [currentPos, setCurrentPos] = useState(selectedIdx || 0);
  const dots = Array.from(Array(count).keys());

  useEffect(() => {
    setCurrentPos(selectedIdx);
  }, [selectedIdx]);

  const onClicked = (ev, idx) => {
    ev.stopPropagation();
    setCurrentPos(idx);
    onDotClicked && onDotClicked(idx);
  };

  return (
    <DotsWrapper className="dots-wrapper">
      <DotsGrid>
        {dots.length > 1 &&
          dots.map((idx) => (
            <Dot isSelected={currentPos === idx} key={idx} onClick={(ev) => onClicked(ev, idx)} />
          ))}
      </DotsGrid>
    </DotsWrapper>
  );
}

const DotsWrapper = styled('div')`
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
`;

const DotsGrid = styled('div')`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-auto-flow: column;
  grid-gap: 5px;
`;

const Dot = styled('span')`
  all: unset;
  display: block;
  cursor: pointer;
  opacity: ${(props: { isSelected: boolean }) => (props.isSelected ? 1 : 0.5)};
  transition: opacity 0.2s linear;
  width: 12px;
  height: 12px;
  padding: 0;
  margin: 0;
  background: #a8bdd0;
  border-radius: 50%;
  box-shadow: 0 4px 7px 0 rgba(34, 25, 77, 0.1);
  border: none;
  @media (max-width: 767px) {
    width: 8px;
    height: 8px;
  }
`;
