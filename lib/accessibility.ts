// Focus Management
export const FocusManager = {
  // Trap focus in modals
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable?.focus();
            e.preventDefault();
          }
        }
      }
      
      // Close modal on Escape
      if (e.key === 'Escape') {
        const closeButton = element.querySelector('[aria-label="Close"]') as HTMLElement;
        closeButton?.click();
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when modal opens
    firstFocusable?.focus();
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },
  
  // Announce dynamic content to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
  
  // Create skip link for keyboard navigation
  createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg';
    
    return skipLink;
  },
  
  // Manage focus for single-page app navigation
  focusMainContent(): void {
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      // Remove tabindex after focus to prevent it from being focusable via mouse
      setTimeout(() => main.removeAttribute('tabindex'), 0);
    }
  }
};

// Keyboard Navigation Enhancement
export const KeyboardNavigation = {
  // Initialize global keyboard shortcuts
  init(): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.openSearch();
      }
      
      // Cmd/Ctrl + N for new entry
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        this.createNewEntry();
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeActiveModal();
      }
      
      // Arrow key navigation for lists
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        this.handleListNavigation(e);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  },
  
  openSearch(): void {
    const searchTrigger = document.querySelector('[aria-label="Search entries"]') as HTMLElement;
    searchTrigger?.click();
    FocusManager.announce('Search opened');
  },
  
  createNewEntry(): void {
    const newEntryButton = document.querySelector('[aria-label="Create new entry"]') as HTMLElement;
    newEntryButton?.click();
    FocusManager.announce('New entry created');
  },
  
  closeActiveModal(): void {
    const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    if (activeModal) {
      const closeButton = activeModal.querySelector('[aria-label="Close"]') as HTMLElement;
      closeButton?.click();
    }
  },
  
  handleListNavigation(e: KeyboardEvent): void {
    const currentFocus = document.activeElement as HTMLElement;
    const listItems = Array.from(
      document.querySelectorAll('[role="listitem"], .timeline-entry, .nav-item')
    ) as HTMLElement[];
    
    const currentIndex = listItems.indexOf(currentFocus);
    
    if (currentIndex === -1) return;
    
    let nextIndex: number;
    
    if (e.key === 'ArrowDown') {
      nextIndex = Math.min(currentIndex + 1, listItems.length - 1);
    } else {
      nextIndex = Math.max(currentIndex - 1, 0);
    }
    
    if (nextIndex !== currentIndex) {
      e.preventDefault();
      listItems[nextIndex]?.focus();
    }
  }
};

// Color Contrast Utilities
export const ContrastUtils = {
  // Calculate relative luminance
  getLuminance(hex: string): number {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },
  
  // Calculate contrast ratio between two colors
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  // Check if color combination meets WCAG guidelines
  meetsWCAGStandard(
    foreground: string, 
    background: string, 
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    
    if (level === 'AAA') {
      return size === 'large' ? ratio >= 4.5 : ratio >= 7;
    } else {
      return size === 'large' ? ratio >= 3 : ratio >= 4.5;
    }
  },
  
  // Convert hex to RGB
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
};

// Reduced Motion Utilities
export const MotionUtils = {
  // Check if user prefers reduced motion
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Get appropriate animation duration based on user preference
  getAnimationDuration(defaultDuration: number): number {
    return this.prefersReducedMotion() ? 0 : defaultDuration;
  },
  
  // Get motion-safe animation variants
  getMotionSafeVariants(variants: any): any {
    if (this.prefersReducedMotion()) {
      // Return variants with no motion
      return Object.keys(variants).reduce((acc, key) => {
        acc[key] = { opacity: variants[key].opacity || 1 };
        return acc;
      }, {} as any);
    }
    return variants;
  }
};

// Screen Reader Utilities
export const ScreenReaderUtils = {
  // Create visually hidden but screen reader accessible text
  createSROnlyText(text: string): HTMLElement {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  },
  
  // Update aria-label dynamically
  updateAriaLabel(element: HTMLElement, text: string): void {
    element.setAttribute('aria-label', text);
  },
  
  // Update aria-describedby relationships
  updateAriaDescribedBy(element: HTMLElement, descriptionId: string): void {
    element.setAttribute('aria-describedby', descriptionId);
  },
  
  // Create live region for dynamic updates
  createLiveRegion(priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  }
};

// Touch and Mouse Interaction Utils
export const InteractionUtils = {
  // Ensure touch targets meet minimum size requirements (44x44px)
  validateTouchTargetSize(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },
  
  // Add touch-friendly spacing to clickable elements
  ensureTouchFriendly(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      element.style.minWidth = '44px';
      element.style.minHeight = '44px';
      element.style.padding = element.style.padding || '8px';
    }
  }
};