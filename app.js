/**
 * Donut Saigon - Main Interactive Application Script
 * Features:
 * - Hero Banner Carousel (Auto-slide, Prev/Next, Dots)
 * - Testimonials Review Slider (Smooth scroll, Swipe, Prev/Next)
 * - Mobile Navigation Drawer
 * - Cart Management & Toast Notification Feedback
 * - Active Navigation Scroll Spy
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. Hero Slider Component
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
    slideInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
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

  // Initialize Hero AutoPlay
  startAutoPlay();

  // ------------------------------------------------------------------------
  // 2. Testimonial Reviews Slider Component
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
    const gap = 24; // matches styles.css gap
    const offset = reviewCurrentIndex * (cardWidth + gap);

    reviewsTrack.style.transform = `translateX(-${offset}px)`;

    // Update navigation button states
    if (reviewPrevBtn) {
      reviewPrevBtn.style.opacity = reviewCurrentIndex === 0 ? '0.5' : '1';
      reviewPrevBtn.style.pointerEvents = reviewCurrentIndex === 0 ? 'none' : 'auto';
    }
    if (reviewNextBtn) {
      reviewNextBtn.style.opacity = reviewCurrentIndex >= maxIndex ? '0.5' : '1';
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

  // Touch Swipe for Reviews on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (trackContainer) {
    trackContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const visibleCount = getVisibleCardsCount();
    const maxIndex = Math.max(0, reviewCards.length - visibleCount);

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next
      if (reviewCurrentIndex < maxIndex) {
        reviewCurrentIndex++;
        updateReviewSlider();
      }
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Prev
      if (reviewCurrentIndex > 0) {
        reviewCurrentIndex--;
        updateReviewSlider();
      }
    }
  }

  window.addEventListener('resize', updateReviewSlider);
  updateReviewSlider();

  // ------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (mobileDrawer && drawerBackdrop && mobileMenuBtn) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      mobileMenuBtn.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (mobileDrawer && drawerBackdrop && mobileMenuBtn) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      mobileMenuBtn.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // ------------------------------------------------------------------------
  // 4. Cart State & Toast Notifications
  // ------------------------------------------------------------------------
  let cartCount = 0;
  const cartBadge = document.getElementById('cartBadge');
  const mobileCartBadge = document.getElementById('mobileCartBadge');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, icon = '✓') {
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

  const ctaButtons = document.querySelectorAll('.card-cta-btn, .product-card');
  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const productName = btn.getAttribute('data-product-name') || 
                          (card ? card.querySelector('.card-title')?.textContent : 'Bánh Donut');
      cartCount += 1;
      updateCartUI();
      showToast(`Đã thêm ${productName} vào giỏ hàng!`);
    });
  });

  const navCartBtn = document.getElementById('navCartBtn');
  const mobileCartLink = document.getElementById('mobileCartLink');

  [navCartBtn, mobileCartLink].forEach((cartBtn) => {
    if (cartBtn) {
      cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast(`Giỏ hàng của bạn đang có ${cartCount} sản phẩm.`);
      });
    }
  });

  // ------------------------------------------------------------------------
  // 5. ScrollSpy & Header Shadow on Scroll
  // ------------------------------------------------------------------------
  const mainHeader = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background & shadow adjustment
    if (scrollY > 50) {
      mainHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
      mainHeader.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    // ScrollSpy active indicator
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === currentSectionId);
      });
    }
  }, { passive: true });
});
