// NebulaPets UI Components Library
// Reusable vanilla JavaScript components with full accessibility

class UIComponents {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    this.setupGlobalStyles();
    this.initializeComponents();
  }

  setupGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* UI Components Base Styles */
      .ui-component {
        --ui-primary: var(--accent-1);
        --ui-secondary: var(--accent-2);
        --ui-accent: var(--accent-3);
        --ui-bg: var(--card);
        --ui-text: var(--text);
        --ui-muted: var(--muted);
        --ui-border: var(--card-border);
        --ui-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        --ui-radius: 12px;
        --ui-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* Focus styles for all components */
      .ui-component *:focus {
        outline: 2px solid var(--ui-primary);
        outline-offset: 2px;
      }

      /* Screen reader only content */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      /* Animation utilities */
      .ui-fade-in {
        animation: uiFadeIn 0.3s ease-out;
      }

      .ui-fade-out {
        animation: uiFadeOut 0.3s ease-out;
      }

      @keyframes uiFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes uiFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
    `;
    document.head.appendChild(style);
  }

  initializeComponents() {
    // Auto-initialize components based on data attributes
    try {
      this.initializeModals();
      this.initializeTabs();
      this.initializeCarousels();
    } catch (error) {
      console.error('Error initializing UI components:', error);
    }
  }

  // Modal Component
  initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        if (modalId) {
          this.openModal(modalId);
        } else {
          console.error('Modal trigger missing data-modal-trigger attribute');
        }
      });
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
      console.error(`Modal with id "${modalId}" not found`);
      return;
    }

    try {
      const modalComponent = new Modal(modal);
      modalComponent.open();
      this.components.set(modalId, modalComponent);
    } catch (error) {
      console.error(`Error opening modal "${modalId}":`, error);
    }
  }

  closeModal(modalId) {
    const modalComponent = this.components.get(modalId);
    if (modalComponent) {
      modalComponent.close();
    }
  }

  // Tabs Component
  initializeTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    tabContainers.forEach(container => {
      new Tabs(container);
    });
  }

  // Carousel Component
  initializeCarousels() {
    const carouselContainers = document.querySelectorAll('[data-carousel]');
    carouselContainers.forEach(container => {
      new Carousel(container);
    });
  }
}

// Modal Component Class
class Modal {
  constructor(element) {
    this.modal = element;
    this.isOpen = false;
    this.previousFocus = null;
    this.focusableElements = [];
    this.init();
  }

  init() {
    this.setupModal();
    this.bindEvents();
  }

  setupModal() {
    // Add modal classes and attributes
    this.modal.classList.add('ui-modal');
    this.modal.setAttribute('role', 'dialog');
    this.modal.setAttribute('aria-modal', 'true');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.setAttribute('tabindex', '-1');

    // Create backdrop if it doesn't exist
    if (!this.modal.querySelector('.ui-modal-backdrop')) {
      const backdrop = document.createElement('div');
      backdrop.className = 'ui-modal-backdrop';
      this.modal.insertBefore(backdrop, this.modal.firstChild);
    }

    // Add close button if it doesn't exist
    if (!this.modal.querySelector('.ui-modal-close')) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'ui-modal-close';
      closeBtn.innerHTML = '×';
      closeBtn.setAttribute('aria-label', 'Close modal');
      closeBtn.setAttribute('type', 'button');
      this.modal.appendChild(closeBtn);
    }

    // Add modal styles
    this.addModalStyles();
  }

  addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ui-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        opacity: 0;
        visibility: hidden;
        transition: var(--ui-transition);
      }

      .ui-modal[aria-hidden="false"] {
        opacity: 1;
        visibility: visible;
      }

      .ui-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(4px);
      }

      .ui-modal-content {
        position: relative;
        background: var(--ui-bg);
        border-radius: var(--ui-radius);
        box-shadow: var(--ui-shadow);
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        transform: scale(0.95);
        transition: var(--ui-transition);
      }

      .ui-modal[aria-hidden="false"] .ui-modal-content {
        transform: scale(1);
      }

      .ui-modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: var(--ui-text);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: var(--ui-transition);
        z-index: 1;
      }

      .ui-modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--ui-primary);
      }

      .ui-modal-header {
        padding: 1.5rem 1.5rem 0;
      }

      .ui-modal-body {
        padding: 1.5rem;
      }

      .ui-modal-footer {
        padding: 0 1.5rem 1.5rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      @media (max-width: 768px) {
        .ui-modal {
          padding: 0.5rem;
        }
        
        .ui-modal-content {
          max-width: 95vw;
          max-height: 95vh;
        }
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Close button
    const closeBtn = this.modal.querySelector('.ui-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    const backdrop = this.modal.querySelector('.ui-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    // Keyboard events
    this.modal.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'Escape':
        this.close();
        break;
      case 'Tab':
        this.trapFocus(e);
        break;
    }
  }

  trapFocus(e) {
    if (e.shiftKey) {
      if (document.activeElement === this.focusableElements[0]) {
        e.preventDefault();
        this.focusableElements[this.focusableElements.length - 1].focus();
      }
    } else {
      if (document.activeElement === this.focusableElements[this.focusableElements.length - 1]) {
        e.preventDefault();
        this.focusableElements[0].focus();
      }
    }
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.previousFocus = document.activeElement;
    
    // Get focusable elements
    this.focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    this.focusableElements = Array.from(this.focusableElements);

    // Show modal
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first element
    setTimeout(() => {
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      } else {
        this.modal.focus();
      }
    }, 100);

    // Trigger custom event
    this.modal.dispatchEvent(new CustomEvent('modal:open', { detail: this }));
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    
    // Hide modal
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Restore focus
    if (this.previousFocus) {
      this.previousFocus.focus();
    }

    // Trigger custom event
    this.modal.dispatchEvent(new CustomEvent('modal:close', { detail: this }));
  }
}

// Tabs Component Class
class Tabs {
  constructor(container) {
    this.container = container;
    this.tabs = [];
    this.panels = [];
    this.activeTab = 0;
    this.init();
  }

  init() {
    this.setupTabs();
    this.bindEvents();
    this.activateTab(0);
  }

  setupTabs() {
    this.container.classList.add('ui-tabs');
    
    // Get tab elements
    this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));

    // Add ARIA attributes
    this.tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('aria-controls', `panel-${index}`);
      tab.setAttribute('id', `tab-${index}`);
      tab.setAttribute('tabindex', '-1');
    });

    this.panels.forEach((panel, index) => {
      panel.setAttribute('aria-labelledby', `tab-${index}`);
      panel.setAttribute('id', `panel-${index}`);
      panel.setAttribute('aria-hidden', 'true');
    });
  }


  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.activateTab(index));
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }

  handleKeydown(e, index) {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.activateTab((index + 1) % this.tabs.length);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.activateTab((index - 1 + this.tabs.length) % this.tabs.length);
        break;
      case 'Home':
        e.preventDefault();
        this.activateTab(0);
        break;
      case 'End':
        e.preventDefault();
        this.activateTab(this.tabs.length - 1);
        break;
    }
  }

  activateTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Deactivate current tab
    if (this.tabs[this.activeTab]) {
      this.tabs[this.activeTab].setAttribute('aria-selected', 'false');
      this.tabs[this.activeTab].setAttribute('tabindex', '-1');
    }
    if (this.panels[this.activeTab]) {
      this.panels[this.activeTab].setAttribute('aria-hidden', 'true');
    }

    // Activate new tab
    this.activeTab = index;
    this.tabs[this.activeTab].setAttribute('aria-selected', 'true');
    this.tabs[this.activeTab].setAttribute('tabindex', '0');
    this.tabs[this.activeTab].focus();
    this.panels[this.activeTab].setAttribute('aria-hidden', 'false');

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('tabs:change', { 
      detail: { 
        activeTab: this.activeTab,
        tabs: this.tabs,
        panels: this.panels
      }
    }));
  }
}

// Carousel Component Class
class Carousel {
  constructor(container) {
    this.container = container;
    this.slides = [];
    this.currentSlide = 0;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    this.setupCarousel();
    this.bindEvents();
    this.showSlide(0);
    this.startAutoplay();
  }

  setupCarousel() {
    this.container.classList.add('ui-carousel');
    
    // Get slides
    this.slides = Array.from(this.container.querySelectorAll('.ui-carousel-slide'));
    
    if (this.slides.length === 0) return;

    // Add ARIA attributes
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Image carousel');
    
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('aria-label', `Slide ${index + 1} of ${this.slides.length}`);
    });

    // Create navigation
    this.createNavigation();
    this.addCarouselStyles();
  }

  createNavigation() {
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'ui-carousel-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous slide');
    prevBtn.setAttribute('type', 'button');
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'ui-carousel-next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next slide');
    nextBtn.setAttribute('type', 'button');

    // Indicators
    const indicators = document.createElement('div');
    indicators.className = 'ui-carousel-indicators';
    indicators.setAttribute('role', 'tablist');
    indicators.setAttribute('aria-label', 'Slide indicators');

    this.slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'ui-carousel-indicator';
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.setAttribute('aria-selected', 'false');
      indicator.setAttribute('type', 'button');
      indicator.addEventListener('click', () => this.goToSlide(index));
      indicators.appendChild(indicator);
    });

    // Add navigation to container
    this.container.appendChild(prevBtn);
    this.container.appendChild(nextBtn);
    this.container.appendChild(indicators);
  }

  addCarouselStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .ui-carousel {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: var(--ui-radius);
      }

      .ui-carousel-track {
        display: flex;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .ui-carousel-slide {
        min-width: 100%;
        flex-shrink: 0;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
      }

      .ui-carousel-slide[aria-hidden="false"] {
        opacity: 1;
      }

      .ui-carousel-prev,
      .ui-carousel-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.7);
        border: none;
        color: white;
        font-size: 1.5rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        transition: var(--ui-transition);
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .ui-carousel-prev {
        left: 1rem;
      }

      .ui-carousel-next {
        right: 1rem;
      }

      .ui-carousel-prev:hover,
      .ui-carousel-next:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: translateY(-50%) scale(1.1);
      }

      .ui-carousel-indicators {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
        z-index: 2;
      }

      .ui-carousel-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: var(--ui-transition);
      }

      .ui-carousel-indicator[aria-selected="true"] {
        background: var(--ui-primary);
        transform: scale(1.2);
      }

      .ui-carousel-indicator:hover {
        background: rgba(255, 255, 255, 0.8);
      }

      @media (max-width: 768px) {
        .ui-carousel-prev,
        .ui-carousel-next {
          width: 40px;
          height: 40px;
          font-size: 1.2rem;
        }
        
        .ui-carousel-prev {
          left: 0.5rem;
        }
        
        .ui-carousel-next {
          right: 0.5rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  bindEvents() {
    // Navigation buttons
    const prevBtn = this.container.querySelector('.ui-carousel-prev');
    const nextBtn = this.container.querySelector('.ui-carousel-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.previousSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Keyboard events
    this.container.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Touch events
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.goToSlide(this.slides.length - 1);
        break;
    }
  }

  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  showSlide(index) {
    if (this.isAnimating || index < 0 || index >= this.slides.length) return;

    this.isAnimating = true;

    // Hide current slide
    this.slides[this.currentSlide].setAttribute('aria-hidden', 'true');
    this.updateIndicator(this.currentSlide, false);

    // Show new slide
    this.currentSlide = index;
    this.slides[this.currentSlide].setAttribute('aria-hidden', 'false');
    this.updateIndicator(this.currentSlide, true);

    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 500);

    // Trigger custom event
    this.container.dispatchEvent(new CustomEvent('carousel:change', {
      detail: {
        currentSlide: this.currentSlide,
        totalSlides: this.slides.length
      }
    }));
  }

  updateIndicator(index, isActive) {
    const indicators = this.container.querySelectorAll('.ui-carousel-indicator');
    if (indicators[index]) {
      indicators[index].setAttribute('aria-selected', isActive.toString());
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prevIndex);
  }

  goToSlide(index) {
    this.showSlide(index);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// Initialize UI Components
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.UIComponents = new UIComponents();
  } catch (error) {
    console.error('Error initializing UI Components:', error);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIComponents, Modal, Tabs, Carousel };
}
