/**
 * Utility functions for optimizing images in the application
 */

/**
 * Generates a properly sized and optimized image URL
 * @param {string} src - The source URL of the image
 * @param {number} width - The desired width of the image
 * @param {number} quality - The quality of the image (1-100)
 * @returns {string} - The optimized image URL
 */
export const getOptimizedImageUrl = (src, width = 640, quality = 75) => {
  // If it's an external URL or SVG, return as is
  if (!src || src.startsWith('http') || src.endsWith('.svg')) {
    return src;
  }

  // For Next.js Image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
};

/**
 * Lazy loads images using the Intersection Observer API
 * @param {HTMLImageElement} imgElement - The image element to lazy load
 * @param {string} src - The source URL of the image
 * @param {Object} options - Options for lazy loading
 */
export const lazyLoadImage = (imgElement, src, options = {}) => {
  if (!imgElement || !src) return;

  const defaultOptions = {
    rootMargin: '200px 0px',
    threshold: 0.01,
    ...options
  };

  const loadImage = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  };

  const observer = new IntersectionObserver(loadImage, defaultOptions);
  observer.observe(imgElement);

  return () => {
    if (imgElement) observer.unobserve(imgElement);
  };
};

/**
 * Preloads critical images to improve perceived performance
 * @param {Array} imageSrcs - Array of image sources to preload
 */
export const preloadCriticalImages = (imageSrcs = []) => {
  if (!imageSrcs.length) return;

  imageSrcs.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};