import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export default function useKeyPress(keys, callback, node = null) {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event) => {
      // check if one of the pressed key is from the input
      const exclude = ['input', 'textarea'];
      if (exclude.indexOf(event.target.tagName.toLowerCase()) !== -1) {
        return 0;
      }
      // check if one of the key is part of the ones we want
      if (keys.some((key) => event.key === key)) {
        const cellTip = document.querySelector('.cell-tip');
        cellTip.classList.add('hidden');
        callbackRef.current(event);
      }
    },
    [keys],
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => targetNode && targetNode.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, node]);
}
