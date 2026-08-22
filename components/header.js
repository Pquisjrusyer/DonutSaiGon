/**
 * Donut Saigon - Reusable Header / Navbar Web Component (<donut-header>)
 * Figma Node ID: 2612:49012 (Navbar)
 * 
 * Usage in any HTML file:
 * 1. Include this script: <script src="components/header.js" defer></script>
 * 2. Place tag: <donut-header></donut-header>
 */

class DonutHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initEvents();
  }

  render() {
    this.innerHTML = `
      <header class="site-header" id="mainHeader" data-node-id="2612:49012" data-name="navbar">
        <div class="header-container">
          <a href="#hero" class="brand-logo" aria-label="Donut Saigon Trang Chủ" data-node-id="I2612:49012;1213:13330">
            <img src="assets/logo-donut-saigon.png" alt="Donut Saigon Logo" class="logo-img" width="122" height="54">
          </a>

          <!-- Desktop Navigation -->
          <nav class="main-nav" aria-label="Menu chính" data-node-id="I2612:49012;1213:13331">
            <ul class="nav-list" data-node-id="I2612:49012;1213:13332">
              <li class="nav-item" data-node-id="I2612:49012;1213:13333">
                <a href="index.html" class="nav-link" id="navHome">TRANG CHỦ</a>
              </li>
              <li class="nav-item" data-node-id="I2612:49012;1213:13335">
                <a href="about.html" class="nav-link" id="navAbout">GIỚI THIỆU</a>
              </li>
              <li class="nav-item" data-node-id="I2612:49012;1213:13337">
                <a href="menu.html" class="nav-link" id="navMenu">MENU</a>
              </li>
              <li class="nav-item" data-node-id="I2612:49012;1213:13339">
                <a href="account.html" class="nav-link nav-account" id="navAccount">
                  <span>TÀI KHOẢN</span>
                  <span class="nav-icon user-icon" aria-hidden="true" data-node-id="I2612:49012;1213:13341">
                    <img src="assets/icon-user-outer.svg" alt="" class="icon-user-base">
                    <img src="assets/icon-user-inner.svg" alt="" class="icon-user-head">
                  </span>
                </a>
              </li>
              <li class="nav-item" data-node-id="I2612:49012;1213:13344">
                <a href="cart.html" class="nav-link nav-cart" id="navCartBtn" aria-label="Giỏ hàng">
                  <span>GIỎ HÀNG</span>
                  <span class="nav-icon cart-icon" aria-hidden="true" data-node-id="I2612:49012;2213:36266">
                    <img src="assets/icon-cart-1.svg" alt="" class="icon-cart-part">
                    <img src="assets/icon-cart-2.svg" alt="" class="icon-cart-part">
                    <img src="assets/icon-cart-3.svg" alt="" class="icon-cart-part">
                    <img src="assets/icon-cart-4.svg" alt="" class="icon-cart-part">
                    <span class="cart-badge" id="cartBadge">0</span>
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          <!-- Mobile Hamburger Button -->
          <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Mở menu điều hướng" aria-expanded="false">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>

        <!-- Mobile Drawer Navigation -->
        <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">
          <div class="drawer-header">
            <img src="assets/logo-donut-saigon.png" alt="Donut Saigon Logo" class="drawer-logo" width="100">
            <button class="drawer-close-btn" id="drawerCloseBtn" aria-label="Đóng menu">&times;</button>
          </div>
          <ul class="drawer-list">
            <li><a href="index.html" class="drawer-link" id="mobNavHome">TRANG CHỦ</a></li>
            <li><a href="about.html" class="drawer-link" id="mobNavAbout">GIỚI THIỆU</a></li>
            <li><a href="menu.html" class="drawer-link" id="mobNavMenu">MENU</a></li>
            <li><a href="account.html" class="drawer-link" id="mobNavAccount">TÀI KHOẢN</a></li>
            <li><a href="cart.html" class="drawer-link" id="mobileCartLink">GIỎ HÀNG (<span id="mobileCartBadge">0</span>)</a></li>
          </ul>
          <div class="drawer-footer">
            <p class="drawer-tagline">Nạp vị ngọt, bật công suất cùng Donut Saigon!</p>
          </div>
        </div>
        <div class="drawer-backdrop" id="drawerBackdrop"></div>
      </header>
    `;
  }

  initEvents() {
    const mobileMenuBtn = this.querySelector('#mobileMenuBtn');
    const mobileDrawer = this.querySelector('#mobileDrawer');
    const drawerBackdrop = this.querySelector('#drawerBackdrop');
    const drawerCloseBtn = this.querySelector('#drawerCloseBtn');
    const drawerLinks = this.querySelectorAll('.drawer-link');

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

    // Automatically highlight active nav link based on current page URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = this.querySelectorAll('.nav-link, .drawer-link');
    allNavLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

if (!customElements.get('donut-header')) {
  customElements.define('donut-header', DonutHeader);
}
