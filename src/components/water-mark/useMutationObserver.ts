import { RefObject, useEffect } from "react";

const useMutationObserver = (
  ref: React.MutableRefObject<Element | null> | null,
  callback: MutationCallback,
  options: MutationObserverInit = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    if (ref && ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => {
        observer.disconnect();
      };
    }
  }, [callback, options]);
};

export default useMutationObserver;
