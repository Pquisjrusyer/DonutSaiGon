/**
 * Donut Saigon - Main Interactive Application Script
 * Features:
 * - Brand Intro Splash Screen (Logo Reveal, Pulse & Smooth Fade-out)
 * - Lenis Smooth Momentum Scroll integrated with GSAP ScrollTrigger
 * - GSAP Scroll-triggered Animations
 * - Hero Banner Carousel (Auto-slide, Prev/Next, Dots)
 * - Testimonials Review Slider (Smooth scroll, Swipe, Prev/Next)
 * - Cart Management & Toast Notification Feedback
 * - Active Navigation Scroll Spy & Header Shrink on Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Lenis Smooth Momentum Scroll Initialization
  // ------------------------------------------------------------------------
  let lenis = null;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth Anchor Scroll with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#' && document.querySelector(targetId)) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          lenis.scrollTo(targetEl, {
            offset: -75,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      });
    });
  }

  initLenis();

  // ------------------------------------------------------------------------
  // 2. Intro Logo Splash Screen Animation
  // ------------------------------------------------------------------------
  const introOverlay = document.getElementById('introOverlay');
  const introLogoImg = document.querySelector('.intro-logo-img');
  const introTagline = document.querySelector('.intro-tagline');
  const introProgress = document.getElementById('introProgress');
  const introGlow = document.querySelector('.intro-glow-pulse');

  function startIntroAnimation() {
    if (!introOverlay || typeof gsap === 'undefined') {
      if (introOverlay) introOverlay.style.display = 'none';
      initMainAnimations();
      return;
    }

    // Lock page scrolling during intro
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';

    const introTl = gsap.timeline({
      onComplete: () => {
        introOverlay.style.display = 'none';
        document.body.style.overflow = '';
        if (lenis) lenis.start();
        initMainAnimations();
      },
    });

    // Step 1: Initial state
    introTl
      .set(introLogoImg, { opacity: 0, scale: 0.6, y: 15 })
      .set(introTagline, { opacity: 0, y: 15 })
      .set(introProgress, { width: '0%' })
      .set(introGlow, { opacity: 0, scale: 0.8 });

    // Step 2: Logo Pop & Glow in
    introTl
      .to(introLogoImg, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: 'elastic.out(1, 0.7)',
      })
      .to(
        introGlow,
        {
          opacity: 0.8,
          scale: 1.2,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.7'
      )
      .to(
        introTagline,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.5'
      )
      .to(
        introProgress,
        {
          width: '100%',
          duration: 0.85,
          ease: 'power1.inOut',
        },
        '-=0.4'
      );

    // Step 3: Zoom and Fade Out Overlay to Reveal Site
    introTl.to(introOverlay, {
      opacity: 0,
      scale: 1.04,
      duration: 0.7,
      ease: 'power3.inOut',
      delay: 0.15,
    });
  }

  // ------------------------------------------------------------------------
  // 3. GSAP ScrollTrigger Page Animations
  // ------------------------------------------------------------------------
  function initMainAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // 3.1 Header Entrance Animation
    gsap.from('#mainHeader', {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    // 3.2 Hero Banner Entrance
    gsap.from('.hero-slider-wrapper', {
      opacity: 0,
      scale: 0.98,
      duration: 1,
      ease: 'power3.out',
      delay: 0.1,
    });

    // 3.3 Section: Khám Phá Hương Vị
    if (document.querySelector('#flavors')) {
      gsap.from('#flavors .section-title, #flavors .section-subtitle', {
        scrollTrigger: {
          trigger: '#flavors',
          start: 'top 85%',
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });

      gsap.from('#flavors .product-card', {
        scrollTrigger: {
          trigger: '#flavors .flavors-container',
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }

    // 3.4 Section: Giá Trị Cốt Lõi (Values)
    if (document.querySelector('#about')) {
      gsap.from('.value-item', {
        scrollTrigger: {
          trigger: '#about',
          start: 'top 80%',
        },
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: 'back.out(1.3)',
        clearProps: 'transform,opacity',
      });
    }

    // 3.5 Section: Khách Hàng Nói Gì? (Reviews)
    if (document.querySelector('#reviews')) {
      gsap.from('#reviews .reviews-title', {
        scrollTrigger: {
          trigger: '#reviews',
          start: 'top 85%',
        },
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });

      gsap.from('.review-card', {
        scrollTrigger: {
          trigger: '.reviews-carousel-wrapper',
          start: 'top 82%',
        },
        y: 30,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }

    // 3.6 Footer Elements
    if (document.querySelector('.site-footer')) {
      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: '.site-footer',
          start: 'top 90%',
        },
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }
  }

  // Trigger Intro Splash Screen
  startIntroAnimation();

  // ------------------------------------------------------------------------
  // 4. Hero Slider Component
  // ------------------------------------------------------------------------
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('#heroDots .dot');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroSlider = document.getElementById('heroSlider');

  let currentSlide = 0;
  const totalSlides = heroSlides.length;
  let slideInterval = null;
  const AUTO_PLAY_DELAY = 5000;

  function goToSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    heroSlides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    heroDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
      dot.setAttribute('aria-selected', idx === currentSlide ? 'true' : 'false');
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }
  }

  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (heroNextBtn && heroPrevBtn) {
    heroNextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });

    heroPrevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetSlide = parseInt(dot.getAttribute('data-slide-to'), 10);
      goToSlide(targetSlide);
      startAutoPlay();
    });
  });

  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoPlay);
    heroSlider.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();

  // ------------------------------------------------------------------------
  // 5. Testimonial Reviews Slider Component
  // ------------------------------------------------------------------------
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewCards = document.querySelectorAll('.review-card');
  const reviewPrevBtn = document.getElementById('reviewPrevBtn');
  const reviewNextBtn = document.getElementById('reviewNextBtn');
  const trackContainer = document.getElementById('reviewsTrackContainer');

  let reviewCurrentIndex = 0;

  function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  function updateReviewSlider() {
    if (!reviewsTrack || reviewCards.length === 0) return;

    const visibleCount = getVisibleCardsCount();
    const maxIndex = Math.max(0, reviewCards.length - visibleCount);

    if (reviewCurrentIndex > maxIndex) {
      reviewCurrentIndex = maxIndex;
    }
    if (reviewCurrentIndex < 0) {
      reviewCurrentIndex = 0;
    }

    const firstCard = reviewCards[0];
    const cardWidth = firstCard.offsetWidth;
    const gap = 24;
    const offset = reviewCurrentIndex * (cardWidth + gap);

    reviewsTrack.style.transform = `translateX(-${offset}px)`;

    if (reviewPrevBtn) {
      reviewPrevBtn.style.opacity = reviewCurrentIndex === 0 ? '0.4' : '1';
      reviewPrevBtn.style.pointerEvents = reviewCurrentIndex === 0 ? 'none' : 'auto';
    }
    if (reviewNextBtn) {
      reviewNextBtn.style.opacity = reviewCurrentIndex >= maxIndex ? '0.4' : '1';
      reviewNextBtn.style.pointerEvents = reviewCurrentIndex >= maxIndex ? 'none' : 'auto';
    }
  }

  if (reviewNextBtn) {
    reviewNextBtn.addEventListener('click', () => {
      const visibleCount = getVisibleCardsCount();
      const maxIndex = Math.max(0, reviewCards.length - visibleCount);
      if (reviewCurrentIndex < maxIndex) {
        reviewCurrentIndex++;
        updateReviewSlider();
      }
    });
  }

  if (reviewPrevBtn) {
    reviewPrevBtn.addEventListener('click', () => {
      if (reviewCurrentIndex > 0) {
        reviewCurrentIndex--;
        updateReviewSlider();
      }
    });
  }

  // Touch Swipe for Reviews on Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (trackContainer) {
    trackContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      const visibleCount = getVisibleCardsCount();
      const maxIndex = Math.max(0, reviewCards.length - visibleCount);

      if (touchEndX < touchStartX - swipeThreshold) {
        if (reviewCurrentIndex < maxIndex) {
          reviewCurrentIndex++;
          updateReviewSlider();
        }
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        if (reviewCurrentIndex > 0) {
          reviewCurrentIndex--;
          updateReviewSlider();
        }
      }
    }, { passive: true });
  }

  window.addEventListener('resize', updateReviewSlider);
  updateReviewSlider();

  // ------------------------------------------------------------------------
  // 6. Cart State & Toast Notifications
  // ------------------------------------------------------------------------
  let cartCount = 0;

  function showToast(message, icon = '✓') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3400);
  }

  function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const mobileCartBadge = document.getElementById('mobileCartBadge');

    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.transform = 'scale(1.3)';
      setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
      }, 200);
    }
    if (mobileCartBadge) {
      mobileCartBadge.textContent = cartCount;
    }
  }

  document.addEventListener('click', (e) => {
    const ctaBtn = e.target.closest('.card-cta-btn, .product-card');
    if (ctaBtn) {
      e.stopPropagation();
      const card = ctaBtn.closest('.product-card');
      const productName = ctaBtn.getAttribute('data-product-name') || 
                          (card ? card.querySelector('.card-title')?.textContent : 'Bánh Donut');
      cartCount += 1;
      updateCartUI();
      showToast(`Đã thêm ${productName} vào giỏ hàng!`);
      return;
    }

    const navCartBtn = e.target.closest('#navCartBtn, #mobileCartLink');
    if (navCartBtn) {
      e.preventDefault();
      showToast(`Giỏ hàng của bạn đang có ${cartCount} sản phẩm.`);
    }
  });

  // ------------------------------------------------------------------------
  // 7. ScrollSpy & Header Shadow on Scroll
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const mainHeader = document.getElementById('mainHeader');
    const scrollY = window.scrollY;

    if (mainHeader) {
      if (scrollY > 40) {
        mainHeader.classList.add('scrolled');
        mainHeader.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.18)';
      } else {
        mainHeader.classList.remove('scrolled');
        mainHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }
    }

    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      const navLinks = document.querySelectorAll('.main-nav .nav-link, .mobile-drawer .drawer-link');
      navLinks.forEach((link) => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.classList.toggle('active', href === currentSectionId);
      });
    }
  }, { passive: true });
});
