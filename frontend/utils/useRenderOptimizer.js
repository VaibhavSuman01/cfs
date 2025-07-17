import { useRef, useEffect } from 'react';

/**
 * Custom hook for tracking and optimizing component render performance
 * @param {string} componentName - The name of the component to track
 * @param {Object} dependencies - The dependencies that trigger re-renders
 * @param {boolean} logPerformance - Whether to log performance metrics
 * @returns {Object} - Performance metrics and optimization suggestions
 */
const useRenderOptimizer = (componentName, dependencies = {}, logPerformance = false) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());
  const renderTimes = useRef([]);
  
  // Track render count and time
  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;
    renderTimes.current.push(renderTime);
    
    // Keep only the last 10 render times
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }
    
    // Log performance metrics if enabled
    if (logPerformance) {
      console.log(`[${componentName}] Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`);
      
      // Log dependencies that triggered the render
      if (dependencies && Object.keys(dependencies).length > 0) {
        console.log(`[${componentName}] Render triggered by:`, dependencies);
      }
      
      // Provide optimization suggestions if render time is high
      if (renderTime > 50) {
        console.warn(`[${componentName}] Render time is high (${renderTime.toFixed(2)}ms). Consider optimizing.`);
      }
      
      // Suggest memoization if component renders frequently
      if (renderCount.current > 5 && renderTimes.current.length >= 5) {
        const avgRenderTime = renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length;
        console.log(`[${componentName}] Average render time: ${avgRenderTime.toFixed(2)}ms`);
        
        if (avgRenderTime > 20) {
          console.warn(`[${componentName}] Consider using React.memo() or useMemo() to optimize renders.`);
        }
      }
    }
    
    lastRenderTime.current = currentTime;
  });
  
  return {
    renderCount: renderCount.current,
    renderTimes: renderTimes.current,
    averageRenderTime: renderTimes.current.length > 0
      ? renderTimes.current.reduce((sum, time) => sum + time, 0) / renderTimes.current.length
      : 0
  };
};

export default useRenderOptimizer;