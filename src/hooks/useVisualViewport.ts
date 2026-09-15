import { useEffect, useState } from 'react';

export interface ViewportBox {
  top: number;
  height: number;
}

/**
 * The part of the page the user can actually see. On phones and tablets the
 * on-screen keyboard shrinks this area without resizing the layout viewport,
 * so an overlay pinned with `inset-0` ends up half under the keyboard. Size the
 * overlay to this box instead and it stays above the keyboard.
 *
 * Returns null while inactive or when the browser has no visualViewport.
 */
export function useVisualViewport(active: boolean): ViewportBox | null {
  const [box, setBox] = useState<ViewportBox | null>(null);

  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!active || !vv) {
      setBox(null);
      return;
    }
    const update = () =>
      setBox(prev =>
        prev && prev.top === vv.offsetTop && prev.height === vv.height
          ? prev
          : { top: vv.offsetTop, height: vv.height }
      );
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, [active]);

  return box;
}
