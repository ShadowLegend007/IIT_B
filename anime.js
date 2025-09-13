// NebulaPets Animation System
// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation Controller Class
class NebulaPetsAnimations {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (!this.prefersReducedMotion) {
      this.setupInitialStates();
      this.createMainTimeline();
      this.setupOrbitalAnimations();
      this.setupButtonAnimations();
      this.setupScrollAnimations();
      this.setupFloatingAnimations();
      this.setupGlitchEffect();
    } else {
      this.setupReducedMotionFallback();
    }
  }

  setupInitialStates() {
    // Set initial states for all animated elements
    gsap.set([".animate-title", ".animate-tagline", ".animate-desc", ".animate-btn", ".animate-graphic"], {
      opacity: 0,
      y: 50
    });

    gsap.set(".animate-list-item", {
      opacity: 0,
      x: -30
    });

    gsap.set([".animate-planet", ".animate-satellite"], {
      scale: 0,
      rotation: 0
    });
  }

  createMainTimeline() {
    // Main timeline for page load animations
    const tl = gsap.timeline();

    // Hero content entrance animation sequence
    tl.to(".animate-title", {
      duration: 1.2,
      opacity: 1,
      y: 0,
      ease: "power3.out"
    })
    .to(".animate-tagline", {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: "power2.out"
    }, "-=0.6")
    .to(".animate-desc", {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: "power2.out"
    }, "-=0.4")
    .to(".animate-list-item", {
      duration: 0.6,
      opacity: 1,
      x: 0,
      stagger: 0.15,
      ease: "power2.out"
    }, "-=0.2")
    .to(".animate-btn", {
      duration: 0.8,
      opacity: 1,
      y: 0,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(".animate-graphic", {
      duration: 1,
      opacity: 1,
      y: 0,
      ease: "power2.out"
    }, "-=0.8");
  }

  setupOrbitalAnimations() {
    // Planet animation with elastic bounce
    gsap.to(".animate-planet", {
      duration: 1.5,
      scale: 1,
      ease: "elastic.out(1, 0.3)",
      delay: 1.2
    });

    // Satellite animation with back ease
    gsap.to(".animate-satellite", {
      duration: 1.2,
      scale: 1,
      ease: "back.out(1.7)",
      delay: 1.5
    });
  }

  setupButtonAnimations() {
    const ctaBtn = document.querySelector('.cta-btn');
    
    if (!ctaBtn) return;

    // Continuous pulse animation for CTA button
    gsap.to(".cta-btn", {
      scale: 1.05,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2.5
    });

    // Enhanced hover effects
    ctaBtn.addEventListener('mouseenter', () => {
      gsap.to(ctaBtn, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    ctaBtn.addEventListener('mouseleave', () => {
      gsap.to(ctaBtn, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    // Click animation
    ctaBtn.addEventListener('click', (e) => {
      gsap.to(ctaBtn, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    });
  }

  setupScrollAnimations() {
    // Parallax effect for hero graphic
    gsap.to(".hero-graphic", {
      y: -50,
      duration: 2,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Scroll-triggered animations for future content
    gsap.utils.toArray('.animate-on-scroll').forEach(element => {
      gsap.fromTo(element, {
        opacity: 0,
        y: 100
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }

  setupFloatingAnimations() {
    // Floating animation for planet
    gsap.to(".planet", {
      y: -10,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Floating animation for satellite
    gsap.to(".satellite", {
      y: 8,
      duration: 2.5,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });
  }

  setupGlitchEffect() {
    // Enhanced glitch effect with GSAP
    gsap.to(".glitch", {
      textShadow: "2px 0 #ff00f6, -2px 0 #00ffe7",
      duration: 0.1,
      ease: "none",
      yoyo: true,
      repeat: -1,
      delay: 2
    });
  }

  setupReducedMotionFallback() {
    // Fallback for reduced motion - just fade in
    gsap.set([".animate-title", ".animate-tagline", ".animate-desc", ".animate-btn", ".animate-graphic", ".animate-list-item"], {
      opacity: 1,
      y: 0,
      x: 0
    });
  }

  // Public methods for external control
  pauseAllAnimations() {
    gsap.globalTimeline.pause();
  }

  resumeAllAnimations() {
    gsap.globalTimeline.resume();
  }

  killAllAnimations() {
    gsap.killTweensOf("*");
  }

  // Method to add new scroll-triggered animations
  addScrollAnimation(selector, options = {}) {
    const defaultOptions = {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    };

    const finalOptions = { ...defaultOptions, ...options };

    gsap.fromTo(selector, {
      opacity: 0,
      y: 100
    }, finalOptions);
  }

  // Method to create custom entrance animations
  createEntranceAnimation(selector, delay = 0) {
    gsap.fromTo(selector, {
      opacity: 0,
      y: 50,
      scale: 0.9
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: delay
    });
  }
}

// Utility functions for common animations
const AnimationUtils = {
  // Fade in animation
  fadeIn: (selector, duration = 0.5) => {
    gsap.fromTo(selector, { opacity: 0 }, { opacity: 1, duration });
  },

  // Slide in from left
  slideInLeft: (selector, duration = 0.6) => {
    gsap.fromTo(selector, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration });
  },

  // Slide in from right
  slideInRight: (selector, duration = 0.6) => {
    gsap.fromTo(selector, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration });
  },

  // Scale in animation
  scaleIn: (selector, duration = 0.5) => {
    gsap.fromTo(selector, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration, ease: "back.out(1.7)" });
  },

  // Bounce animation
  bounce: (selector, duration = 0.6) => {
    gsap.to(selector, { y: -20, duration: duration/2, ease: "power2.out", yoyo: true, repeat: 1 });
  },

  // Pulse animation
  pulse: (selector, scale = 1.1, duration = 1) => {
    gsap.to(selector, { scale: scale, duration, ease: "power2.inOut", yoyo: true, repeat: -1 });
  }
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.nebulaPetsAnimations = new NebulaPetsAnimations();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NebulaPetsAnimations, AnimationUtils };
}
