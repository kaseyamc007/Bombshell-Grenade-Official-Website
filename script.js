/**
 * BOMBSHELL GRENADE — OFFICIAL CELEBRITY PORTFOLIO
 * Shared JavaScript: Navigation, Floating Embers, Audio Player, Lightbox,
 * VIP Pass Generator, Form Validation & Image Fallbacks
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initEmberCanvas();
  initNavigation();
  initAudioPlayer();
  initGalleryLightbox();
  initVipPassGenerator();
  initContactForm();
  initInteractiveToasts();
});

/* ==========================================================================
   1. Image Fallbacks & Self-Healing Placeholders
   ========================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // If a .jpg or .png is missing, fallback to the pre-rendered luxury .svg
      const currentSrc = this.getAttribute('src');
      if (currentSrc && (currentSrc.endsWith('.jpg') || currentSrc.endsWith('.png'))) {
        const svgFallback = currentSrc.replace(/\.(jpg|png)$/i, '.svg');
        if (this.src !== svgFallback) {
          this.src = svgFallback;
        }
      }
    });
  });
}

/* ==========================================================================
   2. Floating Ember Particle Canvas (Theme: "Bomb Fire")
   ========================================================================== */
function initEmberCanvas() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const emberCount = window.innerWidth < 768 ? 28 : 55;
  const embers = [];

  const colors = [
    'rgba(234, 88, 12, ',   // burnt orange
    'rgba(220, 38, 38, ',   // crimson red
    'rgba(245, 158, 11, ',  // molten gold
    'rgba(251, 191, 36, ',  // ember yellow
  ];

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.6 + 0.8;
      this.speedY = Math.random() * 1.2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.7 + 0.2;
      this.flickerSpeed = Math.random() * 0.03 + 0.01;
      this.life = Math.random() * 100;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.life += this.flickerSpeed;
      this.currentAlpha = Math.sin(this.life) * 0.35 + this.alpha;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.colorBase + Math.max(0, Math.min(1, this.currentAlpha)) + ')';
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = '#ea580c';
      ctx.fill();
    }
  }

  for (let i = 0; i < emberCount; i++) {
    embers.push(new Ember());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Responsive Header & Navigation
   ========================================================================== */
function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');

  if (toggleBtn && drawer && backdrop) {
    function toggleDrawer() {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        drawer.classList.add('open');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    toggleBtn.addEventListener('click', toggleDrawer);
    backdrop.addEventListener('click', toggleDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        toggleDrawer();
      }
    });
  }

  // Active navigation link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   4. Interactive Audio Player Simulation
   ========================================================================== */
function initAudioPlayer() {
  const playerBar = document.querySelector('.audio-player-bar');
  if (!playerBar) return;

  const playBtns = document.querySelectorAll('.btn-audio-play, .play-circle-btn');
  const trackTitle = playerBar.querySelector('.player-track-text h4');
  const trackArtist = playerBar.querySelector('.player-track-text p');
  const trackCover = playerBar.querySelector('.player-track-cover');
  const progressFill = playerBar.querySelector('.progress-fill');
  const timeCurrent = playerBar.querySelector('.player-time-current');
  const timeTotal = playerBar.querySelector('.player-time-total');
  const progressBar = playerBar.querySelector('.progress-bar-container');

  let isPlaying = false;
  let progress = 35;
  let timer = null;

  function updatePlayState(playing) {
    isPlaying = playing;
    const playIcons = document.querySelectorAll('.btn-audio-play svg, .play-circle-btn svg');
    
    if (isPlaying) {
      playerBar.style.borderColor = 'var(--fire-orange)';
      playerBar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(234, 88, 12, 0.4)';
      if (!timer) {
        timer = setInterval(() => {
          progress = (progress + 0.6) % 100;
          if (progressFill) progressFill.style.width = `${progress}%`;
          if (timeCurrent) {
            const sec = Math.floor((progress / 100) * 218);
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            timeCurrent.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
          }
        }, 300);
      }
    } else {
      playerBar.style.borderColor = 'var(--border-fire)';
      clearInterval(timer);
      timer = null;
    }
  }

  playBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const card = btn.closest('.music-card');
      if (card) {
        const titleEl = card.querySelector('.music-title');
        const featEl = card.querySelector('.music-features');
        const imgEl = card.querySelector('.music-cover-wrapper img');
        
        if (titleEl && trackTitle) trackTitle.textContent = titleEl.textContent;
        if (featEl && trackArtist) trackArtist.textContent = featEl.textContent;
        if (imgEl && trackCover) trackCover.src = imgEl.src;
        
        progress = 0;
        updatePlayState(true);
        showToast(`Now Playing: ${titleEl ? titleEl.textContent : 'Bombshell Grenade'}`);
      } else {
        updatePlayState(!isPlaying);
      }
    });
  });

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      progress = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
      if (progressFill) progressFill.style.width = `${progress}%`;
    });
  }
}

/* ==========================================================================
   5. Gallery Lightbox Modal
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // Category Filtering
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-filter');
        galleryItems.forEach(item => {
          if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox View
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img-wrapper img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxCat = lightbox.querySelector('.lightbox-category');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  let activeIndex = 0;
  const itemsArray = Array.from(galleryItems);

  function openLightbox(index) {
    activeIndex = index;
    const item = itemsArray[activeIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('h4');
    const cat = item.querySelector('p');

    if (lightboxImg && img) lightboxImg.src = img.src;
    if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
    if (lightboxCat && cat) lightboxCat.textContent = cat.textContent;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
      openLightbox((activeIndex + 1) % itemsArray.length);
    }
    if (e.key === 'ArrowLeft') {
      openLightbox((activeIndex - 1 + itemsArray.length) % itemsArray.length);
    }
  });
}

/* ==========================================================================
   6. Fan Zone — VIP Member Pass Generator
   ========================================================================== */
function initVipPassGenerator() {
  const form = document.getElementById('vip-pass-form');
  const cardPreview = document.getElementById('vip-card-display');
  if (!form || !cardPreview) return;

  const nameInput = document.getElementById('vip-fan-name');
  const cityInput = document.getElementById('vip-fan-city');
  const songSelect = document.getElementById('vip-fav-song');

  const displayName = document.getElementById('card-fan-name');
  const displayCity = document.getElementById('card-fan-city');
  const displaySong = document.getElementById('card-fav-song');
  const displayNumber = document.getElementById('card-fan-number');

  // Load saved pass if available
  const savedPass = localStorage.getItem('bombshell_vip_pass');
  if (savedPass) {
    try {
      const data = JSON.parse(savedPass);
      if (displayName) displayName.textContent = data.name;
      if (displayCity) displayCity.textContent = data.city;
      if (displaySong) displaySong.textContent = data.song;
      if (displayNumber) displayNumber.textContent = data.id;
    } catch (e) {
      console.warn('Could not parse saved VIP pass', e);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim() || 'Bomb Nation Warrior';
    const city = cityInput.value.trim() || 'Lusaka, Zambia';
    const song = songSelect.value || 'Backshot';
    const randomId = 'BN-' + Math.floor(10000 + Math.random() * 90000) + '-ZM';

    if (displayName) displayName.textContent = name;
    if (displayCity) displayCity.textContent = city;
    if (displaySong) displaySong.textContent = song;
    if (displayNumber) displayNumber.textContent = randomId;

    localStorage.setItem('bombshell_vip_pass', JSON.stringify({
      name, city, song, id: randomId
    }));

    showToast(`Welcome to Bomb Nation VIP, ${name}! Your Pass is Ready.`);
    
    // Smooth scroll to card preview
    cardPreview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    cardPreview.style.transform = 'scale(1.02)';
    setTimeout(() => { cardPreview.style.transform = 'scale(1)'; }, 400);
  });
}

/* ==========================================================================
   7. Booking & Management Contact Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('booking-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const inquiry = document.getElementById('contact-inquiry-type')?.value;

    if (!name || !email) {
      showToast('Please fill in your name and email address.', 'error');
      return;
    }

    // Interactive confirmation feedback
    showToast(`Thank you, ${name}! Booking request (${inquiry}) submitted to Vigorish Media.`);
    form.reset();
  });
}

/* ==========================================================================
   8. Global Toast Notification System
   ========================================================================== */
let toastTimeout = null;
function showToast(message, type = 'success') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  const icon = type === 'error' ? 'âš ï¸' : 'ðŸ”¥';
  toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

function initInteractiveToasts() {
  // Add quick copy or feedback to email/phone clicks
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      navigator.clipboard?.writeText(text);
      showToast(`Copied to clipboard: ${text}`);
    });
  });
}
