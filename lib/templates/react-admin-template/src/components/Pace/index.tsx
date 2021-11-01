import { css, Global } from '@emotion/react';
import PaceJS from 'pace-js';
import * as React from 'react';

interface IProps {
  /**
   * 颜色
   */
  color: string;
}

/**
 * 浏览器顶部页面加载的进度条
 *
 * [pace.js](https://github.com/CodeByZach/pace) 查看细节
 */
function Pace(props: IProps): JSX.Element | null {
  const { color } = props;
  PaceJS.start();

  return (
    <Global
      styles={css`
        .pace {
          pointer-events: none;
          user-select: none;
        }
        .pace-inactive {
          display: none;
        }
        .pace .pace-progress {
          background: ${color || null};
          position: fixed;
          z-index: 2000;
          top: 0;
          right: 100%;
          width: 100%;
          height: 2px;
        }
      `}
    />
  );
}

const memoized = React.memo(Pace);

memoized.displayName = 'Pace';

export default memoized;

declare global {
  interface Window {
    paceOptions: {
      ajax: {
        trackMethods: string[];
      };
    };
  }
}

/**
 * Pace has defaultly only GET requests enabled. Enable for Post requets too.
 */
window.paceOptions = {
  ajax: {
    trackMethods: ['GET', 'POST'],
  },
};
