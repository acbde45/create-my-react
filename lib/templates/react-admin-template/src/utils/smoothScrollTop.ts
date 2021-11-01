/**
 * 当调用时滚动到页面顶部。globLastC 防止在顶部滚动时滚动到底部时出现抖动的动画。
 */
let globLastC = Infinity;

function smoothScrollTopRec(): void {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0 && globLastC > c) {
    globLastC = c;
    window.requestAnimationFrame(smoothScrollTopRec);
    window.scrollTo(0, c - c / 8);
  } else {
    globLastC = Infinity;
  }
}

function smoothScrollTop(): void {
  /**
   * Normally this gets called from componentDidMount()
   * Not waiting a tiny fraction of time can lead
   * to shaky behaviour
   */
  setTimeout((): void => {
    smoothScrollTopRec();
  }, 10);
}

export default smoothScrollTop;
