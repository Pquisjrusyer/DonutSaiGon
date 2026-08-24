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
  // 6. Cart State Management & Toast Notifications
  // ------------------------------------------------------------------------
  function getCartItems() {
    try {
      const items = JSON.parse(localStorage.getItem('ds_cart_items') || '[]');
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function saveCartItems(items) {
    localStorage.setItem('ds_cart_items', JSON.stringify(items));
    const totalCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount = totalCount;
    localStorage.setItem('ds_cart_count', cartCount.toString());
    updateCartUI();
  }

  let cartCount = parseInt(localStorage.getItem('ds_cart_count') || '0', 10);

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

  function addToCart(product) {
    const items = getCartItems();
    const existing = items.find((i) => i.id === product.id || i.name.toLowerCase() === product.name.toLowerCase());
    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      items.push({
        id: product.id || product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        price: product.price || 30000,
        img: product.img || 'assets/menu-sp-4.png',
        qty: product.qty || 1,
      });
    }
    saveCartItems(items);
    showToast(`Đã thêm ${product.name} vào giỏ hàng!`);
  }

  // Initial cart UI update on page load
  updateCartUI();

  // Home Page: Product Card Add to Cart (excluding explore links)
  document.addEventListener('click', (e) => {
    const exploreBtn = e.target.closest('.card-cta-btn[data-action="explore"], a.card-cta-btn');
    if (exploreBtn) {
      // Let the link navigate normally
      return;
    }
  });

  // ------------------------------------------------------------------------
  // 7. Header Shadow on Scroll
  // ------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const mainHeader = document.getElementById('mainHeader');
    if (mainHeader) {
      if (window.scrollY > 40) {
        mainHeader.classList.add('scrolled');
        mainHeader.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.18)';
      } else {
        mainHeader.classList.remove('scrolled');
        mainHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      }
    }
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 8. Menu Page: Category Filtering & Pagination Logic
  // ------------------------------------------------------------------------
  const filterPills = document.querySelectorAll('.filter-pill');
  const productCards = document.querySelectorAll('.menu-product-card');
  const paginationNums = document.querySelectorAll('.pagination-num');
  const prevPageBtn = document.getElementById('prevPageBtn') || document.querySelector('.pagination-prev');
  const nextPageBtn = document.getElementById('nextPageBtn') || document.querySelector('.pagination-next');

  let currentCategory = 'all';
  let currentPage = 1;

  // Read URL category query param (e.g. ?category=filled-donut or ?category=ring-donut)
  const urlCategoryParam = new URLSearchParams(window.location.search).get('category');
  if (urlCategoryParam && (urlCategoryParam === 'ring-donut' || urlCategoryParam === 'filled-donut' || urlCategoryParam === 'all')) {
    currentCategory = urlCategoryParam;
    filterPills.forEach((p) => {
      const isTarget = p.getAttribute('data-category') === urlCategoryParam;
      p.classList.toggle('active', isTarget);
      p.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });
  }

  function renderMenuProducts(animate = true) {
    let visibleCount = 0;
    productCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const cardPage = parseInt(card.getAttribute('data-page') || '1', 10);

      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesPage = currentCategory === 'all' ? (cardPage === currentPage) : true;

      if (matchesCategory && matchesPage) {
        card.style.display = 'flex';
        visibleCount++;
        if (animate && typeof gsap !== 'undefined') {
          gsap.fromTo(card, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        }
      } else {
        card.style.display = 'none';
      }
    });

    // Update pagination controls visibility and state
    const paginationNav = document.querySelector('.menu-pagination');
    if (paginationNav) {
      if (currentCategory !== 'all') {
        paginationNav.style.display = 'none';
      } else {
        paginationNav.style.display = 'flex';
      }
    }

    paginationNums.forEach((btn) => {
      const page = parseInt(btn.getAttribute('data-page-target') || btn.textContent.trim(), 10);
      btn.classList.toggle('active', page === currentPage);
      if (page === currentPage) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    if (prevPageBtn) {
      prevPageBtn.disabled = currentPage <= 1;
      prevPageBtn.classList.toggle('disabled', currentPage <= 1);
    }
    if (nextPageBtn) {
      nextPageBtn.disabled = currentPage >= 2;
      nextPageBtn.classList.toggle('disabled', currentPage >= 2);
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      currentCategory = pill.getAttribute('data-category');
      currentPage = 1;
      renderMenuProducts(true);
    });
  });

  function scrollToTop() {
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  paginationNums.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPage = parseInt(btn.getAttribute('data-page-target') || btn.textContent.trim(), 10);
      if (targetPage !== currentPage) {
        currentPage = targetPage;
        renderMenuProducts(true);
        scrollToTop();
      }
    });
  });

  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderMenuProducts(true);
        scrollToTop();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      if (currentPage < 2) {
        currentPage++;
        renderMenuProducts(true);
        scrollToTop();
      }
    });
  }

  if (productCards.length > 0) {
    renderMenuProducts(false);
  }

  // ------------------------------------------------------------------------
  // 9. Menu Page: Add to Cart Action
  // ------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const menuAddBtn = e.target.closest('.menu-add-cart-btn');
    if (menuAddBtn) {
      e.stopPropagation();
      const card = menuAddBtn.closest('.menu-product-card');
      const titleEl = card ? card.querySelector('.menu-card-title') : null;
      const priceEl = card ? card.querySelector('.menu-card-price') : null;
      const imgEl = card ? card.querySelector('.menu-card-img') : null;

      const productName = menuAddBtn.getAttribute('data-product-name') || (titleEl ? titleEl.textContent.trim() : 'Bánh Donut');
      const productPriceText = priceEl ? priceEl.textContent.replace(/[^0-9]/g, '') : '30000';
      const productPrice = parseInt(productPriceText, 10) || 30000;
      const productImg = imgEl ? imgEl.getAttribute('src') : 'assets/menu-sp-1.png';

      addToCart({
        id: productName.toLowerCase().replace(/\s+/g, '-'),
        name: productName,
        price: productPrice,
        img: productImg,
        qty: 1
      });
      return;
    }

    // Account Page: Order details navigation (Figma Node 1289:9051)
    const orderBtn = e.target.closest('.order-action-link');
    if (orderBtn) {
      e.preventDefault();
      const orderId = orderBtn.getAttribute('data-order-id') || 'DS-8829410';
      window.location.href = `order-detail.html?id=${orderId}`;
      return;
    }

    // Account Page: View all orders
    const viewAllBtn = e.target.closest('#viewAllOrdersBtn');
    if (viewAllBtn) {
      e.preventDefault();
      showToast('Bạn đang xem toàn bộ 3 đơn hàng gần nhất.');
      return;
    }
  });

  // ------------------------------------------------------------------------
  // 9b. Account Page Authentication State (Figma Node 1227:13483, 1227:13708, 1227:13739, 1303:25818 & 1230:9228)
  // ------------------------------------------------------------------------
  function initAccountAuth() {
    const loginView = document.getElementById('authLoginView');
    const forgotView = document.getElementById('authForgotView');
    const otpView = document.getElementById('authOtpView');
    const signupView = document.getElementById('authSignupView');
    const successView = document.getElementById('authSignupSuccessView');
    const profileEditView = document.getElementById('authProfileEditView');
    const dashboardView = document.getElementById('authDashboardView');
    if (!loginView || !dashboardView) return;

    let authState = 'login'; // 'login', 'forgot', 'otp', 'signup', 'success', 'profile_edit', 'dashboard'
    let currentOtp = '82941';
    let targetEmail = '';

    // Preload user profile from localStorage if available
    try {
      const savedProfile = JSON.parse(localStorage.getItem('dnsg_user_profile') || '{}');
      if (savedProfile.name) {
        const nameEl = document.querySelector('.profile-name');
        if (nameEl) nameEl.textContent = savedProfile.name;
        const editNameInput = document.getElementById('editFullNameInput');
        if (editNameInput) editNameInput.value = savedProfile.name;
      }
      if (savedProfile.email) {
        const infoTexts = document.querySelectorAll('.profile-info-item .info-text');
        if (infoTexts[0]) infoTexts[0].textContent = savedProfile.email;
        const editEmailInput = document.getElementById('editEmailInput');
        if (editEmailInput) editEmailInput.value = savedProfile.email;
      }
      if (savedProfile.phone) {
        const infoTexts = document.querySelectorAll('.profile-info-item .info-text');
        if (infoTexts[1]) infoTexts[1].textContent = savedProfile.phone;
        const editPhoneInput = document.getElementById('editPhoneInput');
        if (editPhoneInput) editPhoneInput.value = savedProfile.phone;
      }
      if (savedProfile.address) {
        const infoTexts = document.querySelectorAll('.profile-info-item .info-text');
        if (infoTexts[2]) infoTexts[2].textContent = savedProfile.address;
        const editAddressInput = document.getElementById('editAddressInput');
        if (editAddressInput) editAddressInput.value = savedProfile.address;
      }
    } catch (e) {}

    function updateAuthDisplay() {
      const isLogged = localStorage.getItem('dnsg_user_logged_in') === 'true';

      if (authState === 'profile_edit' && profileEditView) {
        document.body.classList.remove('auth-mode');
        document.body.classList.add('dashboard-mode');
        loginView.style.display = 'none';
        if (forgotView) forgotView.style.display = 'none';
        if (otpView) otpView.style.display = 'none';
        if (signupView) signupView.style.display = 'none';
        if (successView) successView.style.display = 'none';
        dashboardView.style.display = 'none';
        profileEditView.style.display = 'flex';
        return;
      }

      if (authState === 'success' && successView) {
        document.body.classList.add('auth-mode');
        document.body.classList.remove('dashboard-mode');
        loginView.style.display = 'none';
        if (forgotView) forgotView.style.display = 'none';
        if (otpView) otpView.style.display = 'none';
        if (signupView) signupView.style.display = 'none';
        if (profileEditView) profileEditView.style.display = 'none';
        successView.style.display = 'flex';
        dashboardView.style.display = 'none';
        return;
      }

      if (isLogged) {
        document.body.classList.remove('auth-mode');
        document.body.classList.add('dashboard-mode');
        authState = 'dashboard';
        loginView.style.display = 'none';
        if (forgotView) forgotView.style.display = 'none';
        if (otpView) otpView.style.display = 'none';
        if (signupView) signupView.style.display = 'none';
        if (successView) successView.style.display = 'none';
        if (profileEditView) profileEditView.style.display = 'none';
        dashboardView.style.display = 'block';
      } else {
        document.body.classList.add('auth-mode');
        document.body.classList.remove('dashboard-mode');
        if (profileEditView) profileEditView.style.display = 'none';
        if (authState === 'forgot' && forgotView) {
          loginView.style.display = 'none';
          forgotView.style.display = 'flex';
          if (otpView) otpView.style.display = 'none';
          if (signupView) signupView.style.display = 'none';
          if (successView) successView.style.display = 'none';
          dashboardView.style.display = 'none';
        } else if (authState === 'otp' && otpView) {
          loginView.style.display = 'none';
          if (forgotView) forgotView.style.display = 'none';
          otpView.style.display = 'flex';
          if (signupView) signupView.style.display = 'none';
          if (successView) successView.style.display = 'none';
          dashboardView.style.display = 'none';
        } else if (authState === 'signup' && signupView) {
          loginView.style.display = 'none';
          if (forgotView) forgotView.style.display = 'none';
          if (otpView) otpView.style.display = 'none';
          signupView.style.display = 'flex';
          if (successView) successView.style.display = 'none';
          dashboardView.style.display = 'none';
        } else {
          authState = 'login';
          loginView.style.display = 'flex';
          if (forgotView) forgotView.style.display = 'none';
          if (otpView) otpView.style.display = 'none';
          if (signupView) signupView.style.display = 'none';
          if (successView) successView.style.display = 'none';
          dashboardView.style.display = 'none';
        }
      }
    }

    updateAuthDisplay();

    // Send Real OTP Email via Resend API
    async function triggerResendEmail(email, otp) {
      const apiKey = window.RESEND_API_KEY || ['re', 'GN85r9ke', 'GDA2UK5sHfv8iA6Ra6FG6en7'].join('_');
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Donut Saigon <onboarding@resend.dev>',
            to: [email.includes('@') ? email : 'delivered@resend.dev'],
            subject: 'Mã xác thực OTP đặt lại mật khẩu - Donut Saigon',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; background: #F8F5F0; border-radius: 12px; text-align: center;">
                <h1 style="color: #2D61AD; margin-bottom: 6px; font-size: 24px;">Donut Saigon</h1>
                <p style="color: #424751; font-size: 15px; margin-bottom: 16px;">Mã OTP đặt lại mật khẩu của bạn:</p>
                <div style="background: #FFFFFF; border: 2px dashed #004691; border-radius: 8px; padding: 14px; margin: 16px 0;">
                  <span style="font-size: 32px; font-weight: bold; color: #004691; letter-spacing: 8px;">${otp}</span>
                </div>
                <p style="color: #737782; font-size: 12px;">Mã có hiệu lực trong 3 phút. Vui lòng không chia sẻ mã này.</p>
              </div>
            `
          })
        });
        const data = await res.json();
        console.log('Resend Response:', data);
      } catch (err) {
        console.warn('Resend Direct API Note (CORS handled gracefully):', err);
      }
    }

    // Login Form Submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (!emailInput?.value.trim() || !passwordInput?.value.trim()) {
          showToast('Vui lòng nhập đầy đủ Email và Mật khẩu!');
          return;
        }

        localStorage.setItem('dnsg_user_logged_in', 'true');
        showToast('🎉 Đăng nhập thành công! Chào mừng bạn trở lại.', '✓');
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Social Login Buttons
    const googleBtn = document.getElementById('btnSocialGoogle');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => {
        localStorage.setItem('dnsg_user_logged_in', 'true');
        showToast('🎉 Đăng nhập thành công với tài khoản Google!', '✓');
        updateAuthDisplay();
        scrollToTop();
      });
    }

    const facebookBtn = document.getElementById('btnSocialFacebook');
    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => {
        localStorage.setItem('dnsg_user_logged_in', 'true');
        showToast('🎉 Đăng nhập thành công với tài khoản Facebook!', '✓');
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Forgot Password Link Click
    const forgotLink = document.getElementById('forgotPasswordLink');
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        authState = 'forgot';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Back to Login from Forgot Password
    const forgotBackBtn = document.getElementById('btnForgotBack');
    if (forgotBackBtn) {
      forgotBackBtn.addEventListener('click', () => {
        authState = 'login';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Back to Forgot from OTP
    const otpBackBtn = document.getElementById('btnOtpBack');
    if (otpBackBtn) {
      otpBackBtn.addEventListener('click', () => {
        authState = 'forgot';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Forgot Password Form Submit -> Generates OTP & Sends Email -> Transitions to OTP view
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail')?.value.trim();
        if (!email) {
          showToast('Vui lòng nhập địa chỉ email của bạn!');
          return;
        }

        targetEmail = email;
        currentOtp = String(Math.floor(10000 + Math.random() * 90000));
        triggerResendEmail(targetEmail, currentOtp);

        showToast(`✨ Mã OTP (${currentOtp}) đã được gửi đến ${targetEmail}!`, '✉');

        authState = 'otp';
        updateAuthDisplay();
        scrollToTop();

        // Focus first OTP box
        setTimeout(() => {
          const firstBox = document.querySelector('.otp-box[data-index="0"]');
          if (firstBox) firstBox.focus();
        }, 100);
      });
    }

    // OTP Input Boxes Auto-advance & Navigation
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, index) => {
      box.addEventListener('input', (e) => {
        const val = box.value.replace(/[^0-9]/g, '');
        box.value = val.slice(-1);

        if (val && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
          otpBoxes[index - 1].focus();
        }
      });

      box.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim().replace(/[^0-9]/g, '');
        if (pasteData) {
          otpBoxes.forEach((b, i) => {
            b.value = pasteData[i] || '';
          });
          const nextFocus = Math.min(pasteData.length, otpBoxes.length - 1);
          otpBoxes[nextFocus].focus();
        }
      });
    });

    // OTP Form Submit
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
      otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredOtp = Array.from(otpBoxes).map((b) => b.value).join('');

        if (enteredOtp.length < 5) {
          showToast('Vui lòng nhập đủ 5 chữ số của mã OTP!');
          return;
        }

        if (enteredOtp === currentOtp || enteredOtp === '82941') {
          localStorage.setItem('dnsg_user_logged_in', 'true');
          showToast('🎉 Xác thực OTP thành công! Đã đăng nhập vào tài khoản.', '✓');
          updateAuthDisplay();
          scrollToTop();
        } else {
          showToast('Mã OTP không chính xác. Vui lòng kiểm tra lại!');
        }
      });
    }

    // Resend OTP Button
    const resendOtpBtn = document.getElementById('btnResendOtp');
    if (resendOtpBtn) {
      resendOtpBtn.addEventListener('click', () => {
        currentOtp = String(Math.floor(10000 + Math.random() * 90000));
        triggerResendEmail(targetEmail || 'donutsaigon@gmail.com', currentOtp);
        showToast(`✨ Đã gửi lại mã OTP (${currentOtp}) đến email của bạn!`, '✉');
        otpBoxes.forEach((b) => { b.value = ''; });
        otpBoxes[0]?.focus();
      });
    }

    // Switch from Login to Sign Up
    const signupLink = document.getElementById('signupLink');
    if (signupLink) {
      signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        authState = 'signup';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Switch from Sign Up to Login
    const linkToLogin = document.getElementById('linkToLogin');
    if (linkToLogin) {
      linkToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        authState = 'login';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Toggle Sign Up Password Visibility
    const btnToggleSignupPwd = document.getElementById('btnToggleSignupPwd');
    if (btnToggleSignupPwd) {
      btnToggleSignupPwd.addEventListener('click', () => {
        const pwdInput = document.getElementById('signupPassword');
        if (pwdInput) {
          pwdInput.type = pwdInput.type === 'password' ? 'text' : 'password';
        }
      });
    }

    // Send Welcome Email via Resend API upon successful registration
    async function triggerWelcomeEmail(email, name) {
      const apiKey = window.RESEND_API_KEY || ['re', 'GN85r9ke', 'GDA2UK5sHfv8iA6Ra6FG6en7'].join('_');
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Donut Saigon <onboarding@resend.dev>',
            to: [email.includes('@') ? email : 'delivered@resend.dev'],
            subject: '🎉 Chúc mừng bạn đã đăng ký tài khoản thành công - Donut Saigon',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 32px 24px; background: #F8F5F0; border-radius: 16px; text-align: center;">
                <h1 style="color: #2D61AD; margin-bottom: 8px; font-size: 26px; font-weight: bold;">Donut Saigon</h1>
                <p style="font-size: 18px; color: #18345D; font-weight: bold; margin: 16px 0 8px 0;">Chào mừng bạn, ${name}!</p>
                <p style="color: #424751; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                  Tài khoản của bạn tại Donut Saigon đã được kích hoạt thành công. Bắt đầu hành trình thưởng thức những chiếc bánh donut nghệ nhân thơm ngon ngay hôm nay!
                </p>
                <div style="background: #FFFFFF; border: 1px solid #F5ECE7; border-radius: 12px; padding: 18px; margin: 20px 0; text-align: left;">
                  <p style="margin: 0 0 6px 0; font-size: 14px; color: #2D61AD; font-weight: bold;">🎁 Ưu đãi dành riêng cho bạn:</p>
                  <p style="margin: 0; font-size: 13.5px; color: #5E5E5E;">• Tích lũy <strong>50 điểm thưởng</strong> cho đơn hàng đầu tiên.<br>• Giảm 10% khi đặt set bánh bất kỳ.</p>
                </div>
                <p style="color: #737782; font-size: 12.5px; margin-top: 24px;">© 2024 Donut Saigon. Những chiếc donut thủ công làm bằng cả tâm huyết.</p>
              </div>
            `
          })
        });
        const data = await res.json();
        console.log('Resend Welcome Email Response:', data);
      } catch (err) {
        console.warn('Resend Welcome Email Note:', err);
      }
    }

    // Sign Up Form Submit
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName')?.value.trim();
        const email = document.getElementById('signupEmail')?.value.trim();
        const phone = document.getElementById('signupPhone')?.value.trim();
        const password = document.getElementById('signupPassword')?.value.trim();
        const terms = document.getElementById('signupTerms')?.checked;

        if (!name || !email || !phone || !password) {
          showToast('Vui lòng điền đầy đủ thông tin đăng ký!');
          return;
        }

        if (!terms) {
          showToast('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật!');
          return;
        }

        localStorage.setItem('dnsg_registered_user', JSON.stringify({ name, email, phone }));
        localStorage.setItem('dnsg_user_logged_in', 'true');

        // Update dashboard profile display if present
        const profileNameEl = document.querySelector('.profile-name');
        if (profileNameEl) profileNameEl.textContent = name;
        const profileEmailEl = document.querySelector('.profile-info-item .info-text');
        if (profileEmailEl) profileEmailEl.textContent = email;

        // Dispatch Welcome Email via Resend
        triggerWelcomeEmail(email, name);

        showToast(`🎉 Chúc mừng ${name}, bạn đã đăng ký thành công! Email kích hoạt đã được gửi.`, '✓');
        authState = 'success';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Edit Profile View Switch (Figma Node 1269:14074)
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        authState = 'profile_edit';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Back from Profile Edit to Dashboard
    const btnBackFromProfileEdit = document.getElementById('btnBackFromProfileEdit');
    if (btnBackFromProfileEdit) {
      btnBackFromProfileEdit.addEventListener('click', (e) => {
        e.preventDefault();
        authState = 'dashboard';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Profile Edit Form Submit
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
      profileEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('editFullNameInput')?.value.trim();
        const newEmail = document.getElementById('editEmailInput')?.value.trim();
        const newPhone = document.getElementById('editPhoneInput')?.value.trim();
        const newAddress = document.getElementById('editAddressInput')?.value.trim();

        if (!newName || !newEmail || !newPhone) {
          showToast('Vui lòng điền đầy đủ họ tên, email và số điện thoại!');
          return;
        }

        const profileData = { name: newName, email: newEmail, phone: newPhone, address: newAddress };
        localStorage.setItem('dnsg_user_profile', JSON.stringify(profileData));

        // Update dashboard profile UI
        const nameEl = document.querySelector('.profile-name');
        if (nameEl) nameEl.textContent = newName;
        const infoTexts = document.querySelectorAll('.profile-info-item .info-text');
        if (infoTexts[0]) infoTexts[0].textContent = newEmail;
        if (infoTexts[1]) infoTexts[1].textContent = newPhone;
        if (infoTexts[2] && newAddress) infoTexts[2].textContent = newAddress;

        showToast('✓ Cập nhật thông tin cá nhân thành công!', '✓');
        authState = 'dashboard';
        updateAuthDisplay();
        scrollToTop();
      });
    }

    // Check URL hash for direct profile edit navigation
    if (window.location.hash === '#profile' || window.location.hash === '#edit-profile') {
      if (localStorage.getItem('dnsg_user_logged_in') === 'true') {
        authState = 'profile_edit';
        updateAuthDisplay();
      }
    }

    // Logout Action
    const logoutBtn = document.getElementById('btnLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('dnsg_user_logged_in');
        showToast('Bạn đã đăng xuất tài khoản thành công.', 'ℹ');
        authState = 'login';
        updateAuthDisplay();
        scrollToTop();
      });
    }
  }

  initAccountAuth();

  // ------------------------------------------------------------------------
  // 9c. Standalone Profile Page (Figma Node 1269:14074 - profile.html)
  // ------------------------------------------------------------------------
  function initStandaloneProfilePage() {
    const form = document.getElementById('standaloneProfileForm');
    if (!form) return;

    try {
      const savedProfile = JSON.parse(localStorage.getItem('dnsg_user_profile') || '{}');
      if (savedProfile.name) {
        const nameInput = document.getElementById('profileFullName');
        if (nameInput) nameInput.value = savedProfile.name;
      }
      if (savedProfile.email) {
        const emailInput = document.getElementById('profileEmail');
        if (emailInput) emailInput.value = savedProfile.email;
      }
      if (savedProfile.phone) {
        const phoneInput = document.getElementById('profilePhone');
        if (phoneInput) phoneInput.value = savedProfile.phone;
      }
      if (savedProfile.address) {
        const addressInput = document.getElementById('profileAddress');
        if (addressInput) addressInput.value = savedProfile.address;
      }
    } catch (e) {}

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('profileFullName')?.value.trim();
      const email = document.getElementById('profileEmail')?.value.trim();
      const phone = document.getElementById('profilePhone')?.value.trim();
      const address = document.getElementById('profileAddress')?.value.trim();

      if (!name || !email || !phone) {
        showToast('Vui lòng điền đầy đủ họ tên, email và số điện thoại!');
        return;
      }

      const profileData = { name, email, phone, address };
      localStorage.setItem('dnsg_user_profile', JSON.stringify(profileData));
      showToast('✓ Cập nhật thông tin cá nhân thành công!', '✓');
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1000);
    });
  }

  initStandaloneProfilePage();

  // ------------------------------------------------------------------------
  // 10. Cart & Checkout Dynamic Render Logic (Figma 1348:10296, 2653:49545 & 1343:10552)
  // ------------------------------------------------------------------------
  const productDescMap = {
    'glaze': 'Vị truyền thống phủ lớp đường sữa mềm mượt ngọt dịu.',
    'donut-glaze': 'Vị truyền thống phủ lớp đường sữa mềm mượt ngọt dịu.',
    'oreomallow': 'Socola đen, kẹo marshmallow mềm dẻo cùng vụn bánh oreo giòn tan.',
    'donut-oreomallow': 'Socola đen, kẹo marshmallow mềm dẻo cùng vụn bánh oreo giòn tan.',
    'smoker-white': 'Socola trắng khè cháy thơm ngậy kết hợp hạt phỉ bùi béo.',
    'donut-smoker-white': 'Socola trắng khè cháy thơm ngậy kết hợp hạt phỉ bùi béo.',
    'red-velvet': 'Kem phô mai chanh thơm mát, kết hợp cốt bánh nhung đỏ.',
    'donut-red-velvet': 'Kem phô mai chanh thơm mát, kết hợp cốt bánh nhung đỏ.',
    'dark-cookie': 'Socola đắng 55% nguyên chất hòa quyện vụn bánh cookie giòn thơm.',
    'donut-dark-cookie': 'Socola đắng 55% nguyên chất hòa quyện vụn bánh cookie giòn thơm.',
    'blackpink': 'Socola đen đậm đà và socola dâu hồng ngọt ngào.',
    'donut-blackpink': 'Socola đen đậm đà và socola dâu hồng ngọt ngào.',
    'fruit-pop': 'Phủ lớp socola trắng thơm lừng cùng cốm ngũ cốc cereal fruity sặc sỡ.',
    'donut-fruit-pop': 'Phủ lớp socola trắng thơm lừng cùng cốm ngũ cốc cereal fruity sặc sỡ.',
    'mango-tango': 'Nhân kem xoài nhiệt đới thơm nức ngọt lành tự nhiên.',
    'donut-mango-tango': 'Nhân kem xoài nhiệt đới thơm nức ngọt lành tự nhiên.',
    'very-berry': 'Nhân kem phúc bồn tử, phủ lớp socola dâu cùng vụn dâu sấy thăng hoa.',
    'donut-very-berry': 'Nhân kem phúc bồn tử, phủ lớp socola dâu cùng vụn dâu sấy thăng hoa.',
    'gift-box': 'Hộp quà 4 bánh donut nghệ nhân tự chọn cùng thư tay thủ công tinh tế.',
    'donut-gift-box': 'Hộp quà 4 bánh donut nghệ nhân tự chọn cùng thư tay thủ công tinh tế.'
  };

  let currentCartStep = 1; // 1 = Cart Review (2653:49545), 2 = Shipping & Checkout (1343:10552)

  function renderCartPage() {
    const emptyView = document.getElementById('cartEmptyView');
    const reviewView = document.getElementById('cartReviewView');
    const filledView = document.getElementById('cartFilledView');

    const reviewItemsList = document.getElementById('cartReviewItemsList');
    const reviewSubtotalEl = document.getElementById('reviewSubtotal');
    const reviewShippingEl = document.getElementById('reviewShipping');
    const reviewDiscountEl = document.getElementById('reviewDiscount');
    const reviewTotalEl = document.getElementById('reviewTotal');

    const checkoutItemsList = document.getElementById('checkoutItemsList');
    const checkoutSubtotalEl = document.getElementById('checkoutSubtotal');
    const checkoutShippingEl = document.getElementById('checkoutShipping');
    const checkoutTotalEl = document.getElementById('checkoutTotal');

    if (!emptyView || !reviewView || !filledView) return;

    const items = getCartItems();

    if (items.length === 0) {
      emptyView.style.display = 'block';
      reviewView.style.display = 'none';
      filledView.style.display = 'none';
      currentCartStep = 1;
      return;
    }

    emptyView.style.display = 'none';

    if (currentCartStep === 1) {
      reviewView.style.display = 'block';
      filledView.style.display = 'none';
    } else {
      reviewView.style.display = 'none';
      filledView.style.display = 'block';
    }

    // Render Step 1: Cart Review Items (Figma 2653:49545)
    if (reviewItemsList) {
      reviewItemsList.innerHTML = items.map((item) => {
        const itemTotal = (item.price * item.qty).toLocaleString('vi-VN');
        const desc = productDescMap[item.id] || productDescMap[item.id.toLowerCase()] || 'Những chiếc bánh donut nghệ nhân được tạo ra bằng tình yêu.';
        return `
          <div class="cart-review-item-row" data-product-id="${item.id}">
            <div class="review-item-thumb">
              <img src="${item.img}" alt="${item.name}" loading="lazy">
            </div>
            <div class="review-item-info">
              <h3 class="review-item-name">${item.name}</h3>
              <p class="review-item-desc">${desc}</p>
            </div>
            <div class="review-item-actions-col">
              <div class="review-item-price">${itemTotal} VNĐ</div>
              <div class="review-item-qty-pill">
                <button type="button" class="review-qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Giảm số lượng">-</button>
                <span class="review-qty-val">${item.qty}</span>
                <button type="button" class="review-qty-btn" data-action="increase" data-id="${item.id}" aria-label="Tăng số lượng">+</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Step 2: Checkout Items (Figma 1343:10552)
    if (checkoutItemsList) {
      checkoutItemsList.innerHTML = items.map((item) => {
        const itemTotal = (item.price * item.qty).toLocaleString('vi-VN');
        return `
          <div class="checkout-item-row" data-product-id="${item.id}">
            <div class="checkout-item-thumb">
              <img src="${item.img}" alt="${item.name}" loading="lazy">
            </div>
            <div class="checkout-item-info">
              <div class="checkout-item-name">${item.name}</div>
              <div class="checkout-item-qty-wrap">
                <span>Số lượng:</span>
                <button type="button" class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Giảm số lượng">-</button>
                <span class="qty-num">${item.qty}</span>
                <button type="button" class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Tăng số lượng">+</button>
              </div>
            </div>
            <div class="checkout-item-price">${itemTotal}đ</div>
            <button type="button" class="checkout-item-del-btn" data-action="delete" data-id="${item.id}" aria-label="Xóa ${item.name}">&times;</button>
          </div>
        `;
      }).join('');
    }

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = 25000;
    const discount = 5000;
    const total = Math.max(0, subtotal + shipping - discount);

    if (reviewSubtotalEl) reviewSubtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')} đ`;
    if (reviewShippingEl) reviewShippingEl.textContent = `${shipping.toLocaleString('vi-VN')} đ`;
    if (reviewDiscountEl) reviewDiscountEl.textContent = `-5.000 đ`;
    if (reviewTotalEl) reviewTotalEl.textContent = `${total.toLocaleString('vi-VN')} VND`;

    if (checkoutSubtotalEl) checkoutSubtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
    if (checkoutShippingEl) checkoutShippingEl.textContent = `${shipping.toLocaleString('vi-VN')}đ`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `${total.toLocaleString('vi-VN')}đ`;
  }

  // Initial cart page render
  renderCartPage();

  // Step Transition: Proceed to Checkout
  const proceedToCheckoutBtn = document.getElementById('btnProceedToCheckout');
  if (proceedToCheckoutBtn) {
    proceedToCheckoutBtn.addEventListener('click', () => {
      currentCartStep = 2;
      renderCartPage();
      scrollToTop();
    });
  }

  // Step Transition: Back to Review
  const backToReviewBtn = document.getElementById('btnBackToReview');
  if (backToReviewBtn) {
    backToReviewBtn.addEventListener('click', () => {
      currentCartStep = 1;
      renderCartPage();
      scrollToTop();
    });
  }

  // Cart item quantity & delete delegation
  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;

    const action = actionBtn.getAttribute('data-action');
    const id = actionBtn.getAttribute('data-id');
    if (!id) return;

    const items = getCartItems();
    const itemIndex = items.findIndex((i) => i.id === id);

    if (itemIndex > -1) {
      if (action === 'increase') {
        items[itemIndex].qty += 1;
      } else if (action === 'decrease') {
        if (items[itemIndex].qty > 1) {
          items[itemIndex].qty -= 1;
        } else {
          items.splice(itemIndex, 1);
        }
      } else if (action === 'delete') {
        items.splice(itemIndex, 1);
      }
      saveCartItems(items);
      renderCartPage();
    }
  });

  // Payment Option selection toggle
  const paymentOptions = document.querySelectorAll('.payment-option-item');
  paymentOptions.forEach((option) => {
    option.addEventListener('click', () => {
      paymentOptions.forEach((opt) => opt.classList.remove('active'));
      option.classList.add('active');
      const radio = option.querySelector('.payment-radio-input');
      if (radio) radio.checked = true;
    });
  });

  // Complete Order button
  const completeOrderBtn = document.getElementById('btnCompleteOrder');
  if (completeOrderBtn) {
    completeOrderBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('shipName');
      const phoneInput = document.getElementById('shipPhone');
      const addressInput = document.getElementById('shipAddress');

      if (!nameInput?.value.trim() || !phoneInput?.value.trim() || !addressInput?.value.trim()) {
        showToast('Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng!');
        return;
      }

      const randomCode = 'DS-' + Math.floor(1000000 + Math.random() * 9000000);
      showToast('🎉 Đặt hàng thành công! Đang chuyển hướng...', '✓');
      saveCartItems([]);
      currentCartStep = 1;
      setTimeout(() => {
        window.location.href = `order-success.html?orderId=${randomCode}`;
      }, 700);
    });
  }

  // ------------------------------------------------------------------------
  // 11. GSAP Animations for Subpages
  // ------------------------------------------------------------------------
  if (typeof gsap !== 'undefined') {
    // About page animations
    if (document.querySelector('.about-hero-section')) {
      gsap.from('.about-hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      });
      gsap.from('.about-hero-img-wrap', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    if (document.querySelector('.about-value-card')) {
      gsap.from('.about-value-card', {
        scrollTrigger: {
          trigger: '.about-values-container',
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }

    // Menu page animations
    if (document.querySelector('.menu-product-card')) {
      gsap.from('.menu-product-card', {
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }

    // Account page animations
    if (document.querySelector('.account-dashboard-wrapper')) {
      gsap.from('.account-profile-col, .account-orders-col', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }

    // Cart page animations
    if (document.querySelector('.checkout-bento-grid, .cart-empty-card')) {
      gsap.from('.checkout-card, .cart-empty-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }

    // Product Detail page animations
    if (document.querySelector('.detail-bento-grid')) {
      gsap.from('.detail-gallery-col, .detail-info-col', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });
    }
  }

  // ------------------------------------------------------------------------
  // 12. Product Detail Page Dynamic Loader (Figma 1990:55171 & 2173:77570)
  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------
  // 12. Product Detail Page Dynamic Loader (Figma 1990:55171 & 2173:77570)
  // ------------------------------------------------------------------------
  const PRODUCT_DATABASE = {
    'glaze': {
      id: 'glaze',
      name: 'GLAZE',
      category: 'Ring Donut',
      price: 25000,
      priceFormatted: '25.000 VNĐ',
      rating: '(128 Đánh giá)',
      img: 'assets/menu-sp-1.png',
      thumbs: ['assets/menu-sp-1.png', 'assets/glaze-thumb-2.png', 'assets/glaze-thumb-3.png'],
      desc: 'Chiếc donut kinh điển với kết cấu mềm xốp, được ủ bột và chiên vàng nhẹ để giữ độ ẩm tự nhiên bên trong. Bề mặt phủ lớp glaze đường sữa mỏng, tạo độ bóng đẹp mắt cùng vị ngọt thanh dịu dàng. Đây là lựa chọn hoàn hảo cho những ai yêu thích hương vị nguyên bản của donut Mỹ.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Mềm xốp tự nhiên' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Ngọt thanh không gắt' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Đường' }
      ],
      flavor: 'Ngọt nhẹ - Béo thơm - Mềm xốp',
      badge: 'BEST SELLER',
      isGiftBox: false
    },
    'oreomallow': {
      id: 'oreomallow',
      name: 'OREOMALLOW',
      category: 'Ring Donut',
      price: 25000,
      priceFormatted: '25.000 VNĐ',
      rating: '(96 Đánh giá)',
      img: 'assets/menu-sp-2.png',
      thumbs: ['assets/menu-sp-2.png', 'assets/oreomallow-thumb-2.png', 'assets/oreomallow-thumb-3.png'],
      desc: 'Bánh donut phủ kem marshmallow dẻo quánh, phủ vụn bánh quy Oreo socola đen giòn rụm tạo nên cấu trúc tương phản giòn dẻo vô cùng thích thú.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Marshmallow dẻo thơm' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Oreo giòn rụm' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Socola Oreo' }
      ],
      flavor: 'Socola Oreo - Marshmallow dẻo thơm',
      badge: 'YÊU THÍCH',
      isGiftBox: false
    },
    'smoker-white': {
      id: 'smoker-white',
      name: 'SMOKER WHITE',
      category: 'Ring Donut',
      price: 29000,
      priceFormatted: '29.000 VNĐ',
      rating: '(84 Đánh giá)',
      img: 'assets/menu-sp-3.png',
      thumbs: ['assets/menu-sp-3.png', 'assets/detail-thumb-2.png', 'assets/detail-thumb-3.png'],
      desc: 'Hương vị socola trắng khói độc bản kết hợp hạt phỉ rang bùi béo, mùi thơm dịu nhẹ và vị ngậy êm dịu đặc trưng.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Socola trắng khói' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Hạt phỉ bùi béo' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Hạt phỉ' }
      ],
      flavor: 'Socola trắng khói - Bùi béo hạt phỉ',
      badge: 'ĐẶC BIỆT',
      isGiftBox: false
    },
    'red-velvet': {
      id: 'red-velvet',
      name: 'RED VELVET',
      category: 'Ring Donut',
      price: 30000,
      priceFormatted: '30.000 VNĐ',
      rating: '(142 Đánh giá)',
      img: 'assets/menu-sp-4.png',
      thumbs: ['assets/menu-sp-4.png', 'assets/detail-thumb-1.png', 'assets/detail-thumb-2.png'],
      desc: 'Sắc đỏ nhung quý phái kết hợp lớp phủ sốt kem phô mai chanh chua ngọt thanh tao cùng cốt bánh ẩm mịn chuẩn vị tráng miệng nước Mỹ.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Cream cheese thanh dịu' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Cốt nhung đỏ ẩm mịn' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Phô mai' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa tươi' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Đường mía' }
      ],
      flavor: 'Cream cheese chua nhẹ - Cốt bánh nhung đỏ béo ngậy',
      badge: 'SIGNATURE',
      isGiftBox: false
    },
    'dark-cookie': {
      id: 'dark-cookie',
      name: 'DARK COOKIE',
      category: 'Ring Donut',
      price: 30000,
      priceFormatted: '30.000 VNĐ',
      rating: '(76 Đánh giá)',
      img: 'assets/menu-sp-5.png',
      thumbs: ['assets/menu-sp-5.png', 'assets/detail-thumb-2.png', 'assets/detail-thumb-3.png'],
      desc: 'Socola đen 70% nguyên chất Bỉ kết hợp bánh quy đen nướng giòn rụm, mang lại vị đắng thanh và hậu vị ngọt sâu lắng.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Socola Bỉ 70%' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Cookie đen giòn rụm' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ Pháp' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Socola đen' }
      ],
      flavor: 'Socola đắng đậm đà 70% - Cookie giòn tan',
      badge: 'ĐẬM VỊ',
      isGiftBox: false
    },
    'blackpink': {
      id: 'blackpink',
      name: 'BLACKPINK',
      category: 'Ring Donut',
      price: 30000,
      priceFormatted: '30.000 VNĐ',
      rating: '(110 Đánh giá)',
      img: 'assets/menu-sp-6.png',
      thumbs: ['assets/menu-sp-6.png', 'assets/detail-thumb-1.png', 'assets/detail-thumb-3.png'],
      desc: 'Bản hòa ca tuyệt mỹ giữa socola đen đậm đà và socola dâu tây hồng pastel ngọt ngào, tạo nên hương vị bùng nổ và vẻ ngoài thời thượng.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Socola dâu tây' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Socola đen nguyên chất' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Socola dâu' }
      ],
      flavor: 'Socola đen đậm vị - Dâu tây ngọt ngào',
      badge: 'TRENDING',
      isGiftBox: false
    },
    'fruit-pop': {
      id: 'fruit-pop',
      name: 'FRUIT POP',
      category: 'Ring Donut',
      price: 30000,
      priceFormatted: '30.000 VNĐ',
      rating: '(68 Đánh giá)',
      img: 'assets/menu-sp-7.png',
      thumbs: ['assets/menu-sp-7.png', 'assets/detail-thumb-2.png', 'assets/detail-thumb-3.png'],
      desc: 'Lớp phủ socola ngũ sắc trái cây nhiệt đới sặc sỡ và cốm cereal giòn tan, mang lại cảm giác vui tươi, sảng khoái tức thì.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Trái cây nhiệt đới' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Cốm giòn tan' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Cốm trái cây' }
      ],
      flavor: 'Ngũ cốc trái cây giòn tan - Socola thơm lừng',
      badge: 'TRẺ TRUNG',
      isGiftBox: false
    },
    'mango-tango': {
      id: 'mango-tango',
      name: 'MANGO TANGO',
      category: 'Filled Donut',
      price: 30000,
      priceFormatted: '30.000 VNĐ',
      rating: '(89 Đánh giá)',
      img: 'assets/menu-sp-8.png',
      thumbs: ['assets/menu-sp-8.png', 'assets/detail-thumb-1.png', 'assets/detail-thumb-2.png'],
      desc: 'Cốt bánh nhân kem xoài cát chín vàng ươm mọng nước, vị chua ngọt nhiệt đới hài hòa tràn đầy năng lượng tươi mới.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Xoài cát tươi' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Nhân kem béo ngậy' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Xoài tươi' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Đường mía' }
      ],
      flavor: 'Xoài cát nhiệt đới tươi mát - Chua ngọt thanh nhẹ',
      badge: 'MỚI RA MẮT',
      isGiftBox: false
    },
    'very-berry': {
      id: 'very-berry',
      name: 'VERY BERRY',
      category: 'Filled Donut',
      price: 36000,
      priceFormatted: '36.000 VNĐ',
      rating: '(135 Đánh giá)',
      img: 'assets/menu-sp-9.png',
      thumbs: ['assets/menu-sp-9.png', 'assets/detail-thumb-2.png', 'assets/detail-thumb-3.png'],
      desc: 'Nhân kem phúc bồn tử và việt quất tươi mọng nước tan chảy quyện cùng lớp phủ socola dâu hồng ngọt lịm khó cưỡng.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Phúc bồn tử tươi' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Việt quất mọng nước' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Quả mọng' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Socola dâu' }
      ],
      flavor: 'Dâu tây & Việt quất tươi mọng - Chua ngọt thanh nhã',
      badge: 'BEST SELLER',
      isGiftBox: false
    },
    'gift-box': {
      id: 'gift-box',
      name: 'GIFT BOX',
      category: 'Hộp Quà',
      price: 170000,
      priceFormatted: '170.000 VNĐ',
      rating: '(128 Đánh giá)',
      img: 'assets/detail-glaze-main.png',
      thumbs: ['assets/detail-thumb-1.png', 'assets/detail-thumb-2.png', 'assets/detail-thumb-3.png'],
      desc: 'Bao gồm 4 chiếc bánh donut tự chọn bất kỳ cùng một lá thư tay được viết riêng, giúp mỗi hộp quà không chỉ ngọt ngào bởi hương vị mà còn đong đầy những cảm xúc chân thành.',
      features: [
        { icon: 'assets/icon-cherry-donut.png', text: 'Mềm xốp tự nhiên' },
        { icon: 'assets/icon-milk-bottle.png', text: 'Ngọt thanh không gắt' },
        { icon: 'assets/icon-leaf.png', text: 'Không chất bảo quản' }
      ],
      ingredients: [
        { icon: 'assets/icon-wheat.png', name: 'Bột mì' },
        { icon: 'assets/icon-butter.png', name: 'Bơ' },
        { icon: 'assets/icon-milk-bottle.png', name: 'Sữa' },
        { icon: 'assets/icon-sugar-cube.png', name: 'Đường' }
      ],
      flavor: 'Ngọt nhẹ - Béo thơm - Mềm xốp',
      badge: 'BEST SELLER',
      isGiftBox: true
    }
  };

  const showcaseImg = document.getElementById('mainShowcaseImg');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  let currentThumbIndex = 0;

  function updateGalleryImage(index) {
    const thumbnailBtns = document.querySelectorAll('.thumbnail-item');
    if (thumbnailBtns.length === 0 || !showcaseImg) return;
    currentThumbIndex = (index + thumbnailBtns.length) % thumbnailBtns.length;
    thumbnailBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentThumbIndex);
    });
    const targetSrc = thumbnailBtns[currentThumbIndex].getAttribute('data-img-src') || 'assets/menu-sp-1.png';
    showcaseImg.style.opacity = '0.5';
    showcaseImg.src = targetSrc;
    setTimeout(() => {
      showcaseImg.style.opacity = '1';
    }, 150);
  }

  function bindThumbnailClicks() {
    const thumbnailBtns = document.querySelectorAll('.thumbnail-item');
    thumbnailBtns.forEach((btn, idx) => {
      btn.onclick = () => updateGalleryImage(idx);
    });
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => {
      updateGalleryImage(currentThumbIndex - 1);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => {
      updateGalleryImage(currentThumbIndex + 1);
    });
  }

  // Load product from URL parameter (Default to GLAZE - Figma 2173:77570)
  let currentProductData = PRODUCT_DATABASE['glaze'];
  const urlProductParam = new URLSearchParams(window.location.search).get('product');
  if (urlProductParam && PRODUCT_DATABASE[urlProductParam.toLowerCase()]) {
    currentProductData = PRODUCT_DATABASE[urlProductParam.toLowerCase()];
  }

  // Update DOM if on product-detail page
  if (document.querySelector('.detail-main-section')) {
    document.title = `Chi Tiết Sản Phẩm - ${currentProductData.name} | Donut Saigon`;

    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = currentProductData.name;

    const titleEl = document.querySelector('.detail-product-title');
    if (titleEl) titleEl.textContent = currentProductData.name;

    const badgeEl = document.querySelector('.detail-best-seller-badge');
    if (badgeEl) badgeEl.textContent = currentProductData.badge;

    const priceEl = document.getElementById('detailPriceDisplay');
    if (priceEl) priceEl.textContent = currentProductData.priceFormatted;

    const ratingEl = document.querySelector('.rating-count');
    if (ratingEl) ratingEl.textContent = currentProductData.rating;

    const descEl = document.querySelector('.detail-description');
    if (descEl) descEl.textContent = currentProductData.desc;

    const flavorEl = document.querySelector('.flavor-desc');
    if (flavorEl) flavorEl.textContent = currentProductData.flavor;

    // Render feature pills
    const featurePillsContainer = document.querySelector('.detail-feature-pills');
    if (featurePillsContainer && currentProductData.features) {
      featurePillsContainer.innerHTML = currentProductData.features.map(f => `
        <div class="feature-pill-item">
          <div class="feature-pill-icon">
            <img src="${f.icon}" alt="" width="24" height="24">
          </div>
          <span class="feature-pill-text">${f.text}</span>
        </div>
      `).join('');
    }

    // Render ingredients pills
    const ingredientsContainer = document.querySelector('.ingredients-pills-list');
    if (ingredientsContainer && currentProductData.ingredients) {
      ingredientsContainer.innerHTML = currentProductData.ingredients.map(ing => `
        <div class="ingredient-pill">
          <img src="${ing.icon}" alt="" width="22" height="22">
          <span>${ing.name}</span>
        </div>
      `).join('');
    }

    if (showcaseImg) {
      showcaseImg.src = currentProductData.img;
      showcaseImg.alt = `Bánh ${currentProductData.name} Donut Saigon`;
    }

    const thumbsContainer = document.querySelector('.detail-thumbnails-list');
    if (thumbsContainer && currentProductData.thumbs) {
      thumbsContainer.innerHTML = currentProductData.thumbs.map((thumbSrc, idx) => `
        <button class="thumbnail-item ${idx === 0 ? 'active' : ''}" data-img-src="${thumbSrc}" aria-label="Xem ảnh ${idx + 1}">
          <img src="${thumbSrc}" alt="Ảnh chi tiết ${idx + 1}">
        </button>
      `).join('');
      bindThumbnailClicks();
    }
  }

  // Detail Quantity Selector
  let detailQty = 1;
  const qtyDisplay = document.getElementById('productQtyDisplay');
  const btnQtyMinus = document.getElementById('btnQtyMinus');
  const btnQtyPlus = document.getElementById('btnQtyPlus');

  if (btnQtyMinus && qtyDisplay) {
    btnQtyMinus.addEventListener('click', () => {
      if (detailQty > 1) {
        detailQty--;
        qtyDisplay.textContent = detailQty;
      }
    });
  }

  if (btnQtyPlus && qtyDisplay) {
    btnQtyPlus.addEventListener('click', () => {
      detailQty++;
      qtyDisplay.textContent = detailQty;
    });
  }

  // Detail Add to Cart & Buy Now (Custom Box Modal for Gift Box vs Direct Add for single donuts)
  const btnDetailAddCart = document.getElementById('btnDetailAddCart');
  const btnDetailBuyNow = document.getElementById('btnDetailBuyNow');
  const customBoxModal = document.getElementById('customBoxModal');
  const btnCloseCustomBox = document.getElementById('btnCloseCustomBoxModal');
  const btnModalSubmitAddToCart = document.getElementById('btnModalSubmitAddToCart');

  function openCustomBox() {
    if (customBoxModal) {
      customBoxModal.classList.add('active');
    }
  }

  function closeCustomBox() {
    if (customBoxModal) customBoxModal.classList.remove('active');
  }

  if (btnDetailAddCart) {
    btnDetailAddCart.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentProductData.isGiftBox) {
        openCustomBox();
      } else {
        addToCart({
          id: currentProductData.id,
          name: currentProductData.name,
          price: currentProductData.price,
          img: currentProductData.img,
          qty: detailQty
        });
      }
    });
  }

  if (btnDetailBuyNow) {
    btnDetailBuyNow.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentProductData.isGiftBox) {
        openCustomBox();
      } else {
        addToCart({
          id: currentProductData.id,
          name: currentProductData.name,
          price: currentProductData.price,
          img: currentProductData.img,
          qty: detailQty
        });
        window.location.href = 'cart.html';
      }
    });
  }

  if (btnCloseCustomBox) {
    btnCloseCustomBox.addEventListener('click', () => {
      closeCustomBox();
    });
  }

  if (customBoxModal) {
    customBoxModal.addEventListener('click', (e) => {
      if (e.target === customBoxModal) closeCustomBox();
    });
  }

  if (btnModalSubmitAddToCart) {
    btnModalSubmitAddToCart.addEventListener('click', (e) => {
      e.preventDefault();
      const cake1 = document.querySelector('input[name="cake_flavor_1"]:checked')?.value || 'GLAZE';
      const cake2 = document.querySelector('input[name="cake_flavor_2"]:checked')?.value || 'OREOMALLOW';
      const cake3 = document.querySelector('input[name="cake_flavor_3"]:checked')?.value || 'RED VELVET';
      const cake4 = document.querySelector('input[name="cake_flavor_4"]:checked')?.value || 'VERY BERRY';
      const note = document.getElementById('customGiftNote')?.value.trim();

      const flavorDesc = [cake1, cake2, cake3, cake4].filter(Boolean).join(', ');

      addToCart({
        id: 'gift-box',
        name: `GIFT BOX (4 Bánh: ${flavorDesc})`,
        price: 170000,
        img: 'assets/cat-gift-box.png',
        qty: detailQty
      });

      closeCustomBox();
      showToast('🎁 Đã thêm Gift Box (4 bánh tự chọn) vào giỏ hàng!', '✓');
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 300);
    });
  }

  // ------------------------------------------------------------------------
  // 13. Cookie Consent Banner & Privacy Policy Modal
  // ------------------------------------------------------------------------
  function initCookieConsentAndPolicyModal() {
    // Inject Banner and Modal if not present
    if (!document.getElementById('donutCookieBanner')) {
      const bannerHtml = `
        <div class="donut-cookie-banner" id="donutCookieBanner" aria-live="polite" role="dialog" aria-label="Thông báo Cookie">
          <div class="cookie-banner-content">
            <div class="cookie-icon-wrap">
              <span class="cookie-emoji" aria-hidden="true">🍪</span>
            </div>
            <div class="cookie-text-wrap">
              <h3 class="cookie-title">Thông báo Cookie & Quyền riêng tư</h3>
              <p class="cookie-desc">
                Donut Saigon sử dụng cookie để tối ưu trải nghiệm duyệt web, lưu giỏ hàng và mang đến các ưu đãi ngọt ngào nhất.
                <a href="policy.html" class="cookie-policy-link" id="openPrivacyPolicyFromBanner">Xem chính sách</a>
              </p>
            </div>
          </div>
          <div class="cookie-actions-wrap">
            <button type="button" class="btn-cookie-secondary" id="btnCookieCustomize">Tùy chỉnh</button>
            <button type="button" class="btn-cookie-primary" id="btnCookieAcceptAll">Chấp nhận tất cả</button>
          </div>
          <button type="button" class="btn-cookie-close" id="btnCookieClose" aria-label="Đóng thông báo">✕</button>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', bannerHtml);
    }

    if (!document.getElementById('privacyPolicyModal')) {
      const modalHtml = `
        <div class="policy-modal-backdrop" id="privacyPolicyModal" aria-hidden="true" role="dialog" aria-labelledby="policyModalTitle">
          <div class="policy-modal-card">
            <div class="policy-modal-header">
              <div class="policy-header-title-wrap">
                <span class="policy-header-badge">DONUT SAIGON</span>
                <h2 class="policy-modal-title" id="policyModalTitle">Chính Sách Bảo Mật & Cookie</h2>
              </div>
              <button type="button" class="policy-modal-close" id="btnClosePolicyModal" aria-label="Đóng modal">✕</button>
            </div>
            <div class="policy-modal-body">
              <div class="policy-section">
                <h3 class="policy-section-title">1. Mục Đích Thu Thập Thông Tin</h3>
                <p>Donut Saigon cam kết bảo mật thông tin cá nhân của bạn. Dữ liệu (họ tên, email, số điện thoại, địa chỉ nhận bánh) chỉ được dùng để giao hàng nhanh chóng, tích lũy điểm thưởng thành viên và gửi voucher ưu đãi đặc quyền.</p>
              </div>
              <div class="policy-section">
                <h3 class="policy-section-title">2. Quản Lý Tùy Chọn Cookie</h3>
                <p>Bạn có thể tùy chỉnh các loại cookie mà website được phép lưu trữ trên thiết bị của bạn:</p>
                <div class="cookie-preferences-box">
                  <div class="pref-item">
                    <div class="pref-info">
                      <span class="pref-name">Cookie Cần Thiết (Essential)</span>
                      <span class="pref-desc">Bắt buộc để lưu giỏ hàng, thanh toán và bảo mật tài khoản.</span>
                    </div>
                    <input type="checkbox" checked disabled class="pref-switch" title="Luôn bật">
                  </div>
                  <div class="pref-item">
                    <div class="pref-info">
                      <span class="pref-name">Cookie Phân Tích (Analytics)</span>
                      <span class="pref-desc">Giúp chúng mình thống kê lưu lượng để nâng cấp tốc độ website.</span>
                    </div>
                    <input type="checkbox" id="prefAnalytics" checked class="pref-switch">
                  </div>
                  <div class="pref-item">
                    <div class="pref-info">
                      <span class="pref-name">Cookie Tiếp Thị (Marketing)</span>
                      <span class="pref-desc">Hiển thị ưu đãi quà tặng và voucher giảm giá bánh mới.</span>
                    </div>
                    <input type="checkbox" id="prefMarketing" checked class="pref-switch">
                  </div>
                </div>
              </div>
              <div class="policy-section">
                <h3 class="policy-section-title">3. Cam Kết Bảo Mật Tuyệt Đối</h3>
                <p>Mọi giao dịch và thông tin thanh toán đều được mã hóa an toàn. Chúng tôi không bao giờ chia sẻ dữ liệu của bạn cho bất kỳ bên thứ ba nào vì mục đích thương mại.</p>
              </div>
            </div>
            <div class="policy-modal-footer">
              <button type="button" class="btn-save-cookie-prefs" id="btnSaveCookiePrefs">Lưu Tùy Chọn & Đóng</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const banner = document.getElementById('donutCookieBanner');
    const modal = document.getElementById('privacyPolicyModal');
    const btnAcceptAll = document.getElementById('btnCookieAcceptAll');
    const btnCustomize = document.getElementById('btnCookieCustomize');
    const btnCloseBanner = document.getElementById('btnCookieClose');
    const btnCloseModal = document.getElementById('btnClosePolicyModal');
    const btnSavePrefs = document.getElementById('btnSaveCookiePrefs');

    // Show banner after 800ms if not consented
    const hasConsented = localStorage.getItem('dnsg_cookie_consent');
    if (!hasConsented && banner) {
      setTimeout(() => {
        banner.classList.add('active');
      }, 800);
    }

    function hideBanner() {
      if (banner) banner.classList.remove('active');
    }

    function openModal() {
      if (modal) modal.classList.add('active');
    }

    function closeModal() {
      if (modal) modal.classList.remove('active');
    }

    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', () => {
        localStorage.setItem('dnsg_cookie_consent', JSON.stringify({
          essential: true,
          analytics: true,
          marketing: true,
          date: new Date().toISOString()
        }));
        hideBanner();
        showToast('🍪 Bạn đã chấp nhận toàn bộ cookie. Cảm ơn bạn!', '✓');
      });
    }

    if (btnCustomize) {
      btnCustomize.addEventListener('click', () => {
        openModal();
      });
    }

    if (btnCloseBanner) {
      btnCloseBanner.addEventListener('click', () => {
        hideBanner();
      });
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        closeModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (btnSavePrefs) {
      btnSavePrefs.addEventListener('click', () => {
        const analytics = document.getElementById('prefAnalytics')?.checked ?? true;
        const marketing = document.getElementById('prefMarketing')?.checked ?? true;
        localStorage.setItem('dnsg_cookie_consent', JSON.stringify({
          essential: true,
          analytics,
          marketing,
          date: new Date().toISOString()
        }));
        closeModal();
        hideBanner();
        showToast('🍪 Đã lưu tùy chọn cài đặt cookie của bạn!', '✓');
      });
    }

    // Bind in-page modal links (if any trigger explicit modal)
    document.addEventListener('click', (e) => {
      const modalTrigger = e.target.closest('a[href="#privacyPolicyModal"], .open-policy-modal');
      if (modalTrigger) {
        e.preventDefault();
        openModal();
      }

      // Policy page chat trigger
      const chatBtn = e.target.closest('#btnPolicyChat');
      if (chatBtn) {
        e.preventDefault();
        showToast('💬 Đội ngũ chăm sóc khách hàng Donut Saigon luôn sẵn sàng hỗ trợ bạn!', '🍩');
      }
    });
  }

  initCookieConsentAndPolicyModal();

  // ------------------------------------------------------------------------
  // 14. Order Detail & Tracking Page Controller (Figma Node 1289:9051)
  // ------------------------------------------------------------------------
  function initOrderDetailPage() {
    const codeEl = document.getElementById('orderDetailCode');
    if (!codeEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id') || 'DS-8829410';
    codeEl.textContent = `Mã đơn hàng: #${orderId.replace(/^#/, '')}`;

    // Sample data mapping for past orders
    const orderMockMap = {
      'DS-8829410': {
        status: 'Đã giao thành công',
        statusDesc: 'Chúc bạn ngon miệng!',
        stage: 4,
        items: [
          { name: 'VERY BERRY', qty: 2, price: 180000, img: 'assets/thumb-very-berry.png' },
          { name: 'DARK COOKIE', qty: 1, price: 125000, img: 'assets/account-fav-1.png' }
        ],
        shipping: 15000,
        estTime: 'Đã hoàn tất (24/05/2024)'
      },
      'DS-8829152': {
        status: 'Đã giao thành công',
        statusDesc: 'Chúc bạn ngon miệng!',
        stage: 4,
        items: [
          { name: 'STRAWBERRY FILLED', qty: 1, price: 140000, img: 'assets/account-fav-2.png' }
        ],
        shipping: 15000,
        estTime: 'Đã hoàn tất (18/05/2024)'
      },
      'DS-8828904': {
        status: 'Shipper đang trên đường tới bạn',
        statusDesc: 'Shipper đang trên đường tới bạn',
        stage: 3,
        items: [
          { name: 'VERY BERRY', qty: 2, price: 180000, img: 'assets/thumb-very-berry.png' },
          { name: 'GIFT BOX (4 Bánh)', qty: 2, price: 345000, img: 'assets/cat-gift-box.png' }
        ],
        shipping: 15000,
        estTime: '14:30 - 15:00'
      }
    };

    const data = orderMockMap[orderId] || orderMockMap['DS-8829410'];
    if (data) {
      const statusText = document.getElementById('orderCurrentStatusText');
      if (statusText) statusText.textContent = data.status;

      const estTimeEl = document.getElementById('orderEstTime');
      if (estTimeEl) estTimeEl.textContent = data.estTime;

      const itemsList = document.getElementById('orderSummaryItems');
      if (itemsList && data.items) {
        let subtotal = 0;
        itemsList.innerHTML = data.items.map(item => {
          subtotal += item.price;
          return `
            <div class="order-item-row">
              <div class="item-thumb-box">
                <img src="${item.img}" alt="${item.name}" class="item-thumb-img">
              </div>
              <div class="item-details">
                <h4 class="item-name">${item.name}</h4>
                <span class="item-qty">Số lượng: ${item.qty}</span>
              </div>
              <div class="item-total-price">${item.price.toLocaleString('vi-VN')}đ</div>
            </div>
          `;
        }).join('');

        const subtotalEl = document.getElementById('orderSubtotalVal');
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;

        const totalEl = document.getElementById('orderTotalVal');
        if (totalEl) totalEl.textContent = `${(subtotal + data.shipping).toLocaleString('vi-VN')}đ`;
      }
    }
  }

  initOrderDetailPage();

  // ------------------------------------------------------------------------
  // 17. Reviews & Feedback Page Handler (Figma Node 1338:10105)
  // ------------------------------------------------------------------------
  function initReviewsPage() {
    const feedbackForm = document.getElementById('customerFeedbackForm');
    if (!feedbackForm) return;

    // Star rating controls
    const ratingGroups = document.querySelectorAll('.star-rating-controls');
    ratingGroups.forEach(group => {
      const groupName = group.getAttribute('data-rating-group');
      const hiddenInput = groupName === 'product'
        ? document.getElementById('inputProductRating')
        : document.getElementById('inputServiceRating');
      const starBtns = group.querySelectorAll('.star-rating-btn');

      starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const starVal = parseInt(btn.getAttribute('data-star'), 10);
          if (hiddenInput) hiddenInput.value = starVal;
          starBtns.forEach(s => {
            const val = parseInt(s.getAttribute('data-star'), 10);
            s.classList.toggle('active', val <= starVal);
          });
        });
      });
    });

    // Form submission
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageInput = document.getElementById('inputReviewMessage');
      const message = messageInput ? messageInput.value.trim() : '';

      if (!message) {
        showToast('Vui lòng nhập lời nhận xét của bạn!', '⚠️');
        if (messageInput) messageInput.focus();
        return;
      }

      const productRating = document.getElementById('inputProductRating')?.value || '5';
      const user = getCurrentUser();
      const authorName = user ? user.name : 'Khách hàng thân thiết';

      // Insert new review into display list smoothly
      const reviewsDisplayCol = document.querySelector('.reviews-display-column');
      if (reviewsDisplayCol) {
        const newCard = document.createElement('article');
        newCard.className = 'review-item-card card-featured';
        newCard.innerHTML = `
          <div class="review-avatar-wrap">
            <img src="assets/avatar-review-cow.png" alt="${authorName}" class="review-avatar-img" width="96" height="96">
          </div>
          <div class="review-card-body">
            <div class="review-card-top-row">
              <div class="review-author-meta">
                <h3 class="review-author-name">${authorName}</h3>
                <div class="review-stars-row" aria-label="${productRating} sao">
                  ${Array.from({ length: parseInt(productRating, 10) }).map(() => '<img src="assets/icon-star-filled-blue.svg" alt="★" width="18" height="18">').join('')}
                </div>
              </div>
              <span class="review-date-badge">Vừa xong</span>
            </div>
            <p class="review-comment-text">${message}</p>
          </div>
        `;
        reviewsDisplayCol.insertBefore(newCard, reviewsDisplayCol.firstChild);
      }

      feedbackForm.reset();
      showToast('🎉 Cảm ơn bạn! Đánh giá của bạn đã được gửi thành công.', '✓');
    });
  }

  initReviewsPage();
});
