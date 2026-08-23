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

    // Account Page: Order details
    const orderBtn = e.target.closest('.order-action-link');
    if (orderBtn) {
      e.preventDefault();
      const orderId = orderBtn.getAttribute('data-order-id') || 'DS-8829410';
      showToast(`Đang mở chi tiết đơn hàng #${orderId}`);
      return;
    }

    // Account Page: Edit Profile
    const editBtn = e.target.closest('#editProfileBtn');
    if (editBtn) {
      e.preventDefault();
      showToast('Tính năng chỉnh sửa hồ sơ đang được cập nhật!');
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
  // 10. Cart & Checkout Dynamic Render Logic (Figma 1348:10296 & 1343:10552)
  // ------------------------------------------------------------------------
  function renderCartPage() {
    const emptyView = document.getElementById('cartEmptyView');
    const filledView = document.getElementById('cartFilledView');
    const itemsListContainer = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');

    if (!emptyView || !filledView) return;

    const items = getCartItems();

    if (items.length === 0) {
      emptyView.style.display = 'block';
      filledView.style.display = 'none';
      return;
    }

    emptyView.style.display = 'none';
    filledView.style.display = 'block';

    if (itemsListContainer) {
      itemsListContainer.innerHTML = items.map((item) => {
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
    const total = subtotal + shipping;

    if (subtotalEl) {
      subtotalEl.textContent = `${subtotal.toLocaleString('vi-VN')}đ`;
    }
    if (totalEl) {
      totalEl.textContent = `${total.toLocaleString('vi-VN')}đ`;
    }
  }

  // Initial cart page render
  renderCartPage();

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

      showToast('🎉 Đặt hàng thành công! Đơn hàng đang được chuẩn bị giao đến bạn.', '✓');
      saveCartItems([]);
      setTimeout(() => {
        renderCartPage();
      }, 800);
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
  // 12. Product Detail Page Interactions (Figma 1990:55171)
  // ------------------------------------------------------------------------
  const showcaseImg = document.getElementById('mainShowcaseImg');
  const thumbnailBtns = document.querySelectorAll('.thumbnail-item');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  let currentThumbIndex = 0;

  function updateGalleryImage(index) {
    if (thumbnailBtns.length === 0 || !showcaseImg) return;
    currentThumbIndex = (index + thumbnailBtns.length) % thumbnailBtns.length;
    thumbnailBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentThumbIndex);
    });
    const targetSrc = thumbnailBtns[currentThumbIndex].getAttribute('data-img-src') || 'assets/detail-glaze-main.png';
    showcaseImg.style.opacity = '0.5';
    showcaseImg.src = targetSrc;
    setTimeout(() => {
      showcaseImg.style.opacity = '1';
    }, 150);
  }

  thumbnailBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      updateGalleryImage(idx);
    });
  });

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

  // Detail Add to Cart & Buy Now
  const btnDetailAddCart = document.getElementById('btnDetailAddCart');
  const btnDetailBuyNow = document.getElementById('btnDetailBuyNow');

  if (btnDetailAddCart) {
    btnDetailAddCart.addEventListener('click', () => {
      addToCart({
        id: 'gift-box',
        name: 'GIFT BOX (Hộp 4 Bánh)',
        price: 170000,
        img: 'assets/cat-gift-box.png',
        qty: detailQty
      });
    });
  }

  if (btnDetailBuyNow) {
    btnDetailBuyNow.addEventListener('click', () => {
      addToCart({
        id: 'gift-box',
        name: 'GIFT BOX (Hộp 4 Bánh)',
        price: 170000,
        img: 'assets/cat-gift-box.png',
        qty: detailQty
      });
      window.location.href = 'cart.html';
    });
  }
});
