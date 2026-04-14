'use client';

import { useEffect, useState } from 'react';

/**
 * useActiveSection hook — tracks which section is currently in view using scroll position.
 * Returns the ID of the section that is closest to the top of the viewport.
 * Purpose: enables active menu item highlighting based on scroll position.
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      
      // Find the section whose top is closest to 150px from the top of viewport
      // (accounting for header height)
      const triggerPoint = 150;
      let closestSection = '';
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distanceFromTrigger = Math.abs(rect.top - triggerPoint);
        
        // Only consider sections that are in or near the viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distanceFromTrigger < closestDistance) {
            closestDistance = distanceFromTrigger;
            closestSection = section.id;
          }
        }
      });

      // Map retail-model and brand-refresh to "the-model" for menu highlighting
      let displaySection = closestSection;
      if (closestSection === 'retail-model' || closestSection === 'brand-refresh') {
        displaySection = 'the-model';
      }

      if (displaySection) {
        setActiveSection(displaySection);
      }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Call once on mount to set initial state
    handleScroll();

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return activeSection;
}
