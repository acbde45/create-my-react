import { css, keyframes } from '@emotion/react';
import * as React from 'react';

const moveForever = keyframes`
  from { transform: translate3d(-90px, 0, 0) }
  to { transform: translate3d(85px, 0, 0) }
`;

const waves = css`
  position: relative;
  width: 100%;
  margin-bottom: -7px;
  height: 7vw;
  min-height: 7vw;
`;

interface IProps {
  /**
   * 动画延迟时间
   */
  animationNegativeDelay?: number;
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 上波浪的背景颜色
   */
  lowerColor: string;
  /**
   * 下波浪的背景颜色
   */
  upperColor: string;
}

/**
 * 起伏的动画波浪
 * https://codepen.io/csspoints/pen/WNeOEqd
 */
function WaveBorder(props: IProps): JSX.Element {
  const id = String(Math.random());
  const { className = '', lowerColor, upperColor, animationNegativeDelay = 4, ...rest } = props;

  const parallax = css`
    & > use {
      animation: ${moveForever} 4s cubic-bezier(0.62, 0.5, 0.38, 0.5) infinite;
      animation-delay: -${animationNegativeDelay}s;
    }
  `;

  return (
    <div className={className} style={{ background: upperColor }} {...rest}>
      <svg css={waves} viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id={id} d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g css={parallax}>
          <use href={`#${id}`} x="48" y="0" fill={lowerColor} />
        </g>
      </svg>
    </div>
  );
}

const memoized = React.memo(WaveBorder);

memoized.displayName = 'WaveBorder';

export default memoized;
