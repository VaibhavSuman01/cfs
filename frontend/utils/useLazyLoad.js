import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy loading components when they enter the viewport
 * @param {Object} options - Intersection Observer options
 * @param {boolean} triggerOnce - Whether to trigger the callback only once
 * @returns {Object} - { ref, inView, entry }
 */
const useLazyLoad = (options = {}, triggerOnce = true) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);
  const observerRef = useRef(null);
  const hasTriggered = useRef(false);

  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  };

  useEffect(() => {
    // Skip if already triggered once and triggerOnce is true
    if (triggerOnce && hasTriggered.current) return;

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new IntersectionObserver
    observerRef.current = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      setEntry(entry);

      if (entry.isIntersecting && triggerOnce) {
        hasTriggered.current = true;
        // Disconnect after triggering once if triggerOnce is true
        observerRef.current.disconnect();
      }
    }, defaultOptions);

    // Start observing the target element
    const currentRef = ref.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [triggerOnce, JSON.stringify(defaultOptions)]);

  return { ref, inView, entry };
};

export default useLazyLoad;