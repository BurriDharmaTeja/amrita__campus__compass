/* ----------------------------------------------------
   CAMPUS COMPASS 2026 - LOGIC & TRANSITIONS
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- DOM Elements ---
  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('dots-container');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileClose = document.getElementById('mobile-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-item');
  const navItems = document.querySelectorAll('.nav-item');

  let currentSlide = 0;
  const slideCount = slides.length;
  const slideIntervalTime = 5000; // 5 seconds display
  let slideTimer;

  // --- Loader Screen ---
  window.addEventListener('load', () => {
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }
  });

  // Fallback loader removal if load event takes too long (e.g. slow image fetch)
  setTimeout(() => {
    if (loader && !loader.classList.contains('fade-out')) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 600);
    }
  }, 3000);

  // --- Slider Logic ---
  
  function updateSlider(index) {
    // Range sanity check
    if (index >= slideCount) index = 0;
    if (index < 0) index = slideCount - 1;
    
    currentSlide = index;

    // Update active slide
    slides.forEach((slide, i) => {
      if (i === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update active dot
    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function startSlideTimer() {
    stopSlideTimer(); // clear any existing timers first
    slideTimer = setInterval(() => {
      updateSlider(currentSlide + 1);
    }, slideIntervalTime);
  }

  function stopSlideTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
    }
  }

  // --- Slide Navigation Event Listeners ---
  
  nextBtn.addEventListener('click', () => {
    updateSlider(currentSlide + 1);
    startSlideTimer(); // Reset auto timer on interaction
  });

  prevBtn.addEventListener('click', () => {
    updateSlider(currentSlide - 1);
    startSlideTimer(); // Reset auto timer on interaction
  });

  // Dots navigation
  dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      updateSlider(index);
      startSlideTimer(); // Reset auto timer on interaction
    }
  });

  // Start the slider automatic transition
  startSlideTimer();

  // --- Touch Gestures for Mobile Swipe ---
  let touchStartX = 0;
  let touchEndX = 0;

  const sliderSection = document.getElementById('hero');
  
  sliderSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50; // minimum distance in pixels
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped Left -> Show next slide
      updateSlider(currentSlide + 1);
      startSlideTimer();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped Right -> Show previous slide
      updateSlider(currentSlide - 1);
      startSlideTimer();
    }
  }

  // --- Navbar Scroll Effect ---
  function checkScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check on load

  // --- Mobile Drawer Menu Logic ---
  function openDrawer() {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scrolling
  }

  mobileToggle.addEventListener('click', openDrawer);
  mobileClose.addEventListener('click', closeDrawer);

  // Close drawer when link clicked
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --- Navigation Active States on Scroll ---
  const sections = document.querySelectorAll('main section, main div[id]');
  
  function highlightNavigation() {
    let scrollPos = window.scrollY + 200; // Offset for top header

    // Check if user is in Hero section
    if (window.scrollY < window.innerHeight - 200) {
      navItems.forEach(item => item.classList.remove('active'));
      document.getElementById('nav-home').classList.add('active');
      return;
    }

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavigation);

  // --- Deep Dive Tabs Switching Logic ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      // Remove active class from all contents
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button and target tab content
      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });

  // --- Back to Top Scroll Actions ---
  const backToTopBtn = document.getElementById('back-to-top');

  function checkBackToTopScroll() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', checkBackToTopScroll);
  checkBackToTopScroll(); // run once on load

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

});
