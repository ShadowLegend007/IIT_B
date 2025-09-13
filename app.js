// NebulaPets Navigation and Form Validation
// Responsive navigation and accessible form handling

class NebulaPetsApp {
  constructor() {
    this.init();
  }

  init() {
    try {
      this.setupNavigation();
      this.setupFormValidation();
      this.setupSmoothScrolling();
      this.setupAccessibility();
    } catch (error) {
      console.error('Error initializing NebulaPets app:', error);
    }
  }

  // Navigation functionality
  setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (!navToggle || !navMenu) {
      console.warn('Navigation elements not found');
      return;
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', !isExpanded);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(11, 16, 32, 0.98)';
      } else {
        navbar.style.background = 'rgba(11, 16, 32, 0.95)';
      }
    });
  }

  // Form validation and submission
  setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) {
      console.warn('Contact form not found');
      return;
    }

    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('.form-submit');
    const successMessage = document.getElementById('form-success');

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.submitForm(form);
      } else {
        // Focus first invalid field
        const firstError = form.querySelector('.form-input.error, .form-textarea.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });

    // Submit button loading state
    submitBtn.addEventListener('click', () => {
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(field)} is required.`;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // Name validation
    if (fieldName === 'name' && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long.';
      }
    }

    // Message validation
    if (fieldName === 'message' && value) {
      if (value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long.';
      }
    }

    // Show error if invalid
    if (!isValid && errorElement) {
      field.classList.add('error');
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
      
      // Animate error message with fallback
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(errorElement, 
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
      } else {
        // Fallback animation
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
          errorElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          errorElement.style.opacity = '1';
          errorElement.style.transform = 'translateY(0)';
        });
      }
    }

    return isValid;
  }

  clearError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    field.classList.remove('error');
    if (errorElement) {
      errorElement.classList.remove('show');
      errorElement.textContent = '';
    }
  }

  getFieldLabel(field) {
    const label = field.previousElementSibling;
    return label ? label.textContent.replace(' *', '') : field.name;
  }

  async submitForm(form) {
    const submitBtn = form.querySelector('.form-submit');
    const successMessage = document.getElementById('form-success');
    const formData = new FormData(form);

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate API call (replace with actual endpoint)
      await this.simulateApiCall(formData);
      
      // Show success message
      successMessage.textContent = 'Thank you! Your message has been sent successfully. We\'ll get back to you soon!';
      successMessage.classList.add('show');
      
      // Animate success message
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(successMessage, 
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }

      // Reset form
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.classList.remove('show');
      }, 5000);

    } catch (error) {
      console.error('Form submission error:', error);
      successMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
      successMessage.classList.add('show');
    } finally {
      // Reset button state
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
    }
  }

  simulateApiCall(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error('Simulated API error'));
        }
      }, 2000);
    });
  }

  // Smooth scrolling for navigation links
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Accessibility enhancements
  setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#hero';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--accent-1);
      color: #0e1116;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        // Focus first menu item when opening
        const firstMenuItem = navMenu.querySelector('a');
        if (firstMenuItem) {
          setTimeout(() => firstMenuItem.focus(), 100);
        }
      }
    });

    // Trap focus in mobile menu
    navMenu.addEventListener('keydown', (e) => {
      if (!navMenu.classList.contains('active')) return;
      
      const menuItems = navMenu.querySelectorAll('a');
      const firstItem = menuItems[0];
      const lastItem = menuItems[menuItems.length - 1];
      
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      }
    });

    // Announce form validation errors to screen readers
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(errorMsg => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (errorMsg.classList.contains('show')) {
              // Announce error to screen readers
              const announcement = document.createElement('div');
              announcement.setAttribute('aria-live', 'assertive');
              announcement.setAttribute('aria-atomic', 'true');
              announcement.className = 'sr-only';
              announcement.textContent = errorMsg.textContent;
              document.body.appendChild(announcement);
              
              setTimeout(() => {
                document.body.removeChild(announcement);
              }, 1000);
            }
          }
        });
      });
      
      observer.observe(errorMsg, { attributes: true });
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  try {
    window.nebulaPetsApp = new NebulaPetsApp();
  } catch (error) {
    console.error('Error initializing NebulaPets app:', error);
  }
});

// Screen reader only class
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);
