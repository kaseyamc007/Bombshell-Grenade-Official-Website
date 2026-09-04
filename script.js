/**
 * BOMBSHELL GRENADE — OFFICIAL CELEBRITY PORTFOLIO
 * Shared JavaScript: Navigation, Flames in Motion, Audio Player, Lightbox,
 * VIP Pass Generator, Facebook Feed & Upload Studio, Form Validation & Image Fallbacks
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
  initInstagramFeed();
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
   2. Dynamic Creative "Flames in Motion" Simulation (Theme: "Bomb Fire")
      - Gentle, slow, hypnotic baseline motion when idle.
      - Reacts instantly to mouse clicks (shockwave ignition burst & fire acceleration).
      - Reacts directly to scroll velocity (fanning the fire into a roaring updraft).
      - Naturally relaxes back to slow, serene movement.
   ========================================================================== */
function initEmberCanvas() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Speed & Energy State Engine
  const BASE_SPEED = 0.38; // Slow, majestic, hypnotic motion at rest
  let currentSpeed = BASE_SPEED;
  let targetSpeed = BASE_SPEED;

  let mouseX = width / 2;
  let mouseY = height;
  let mouseVelX = 0;
  let lastMouseX = mouseX;
  let mouseTimer = null;

  // Track scroll velocity for kinetic fire updraft
  let lastScrollY = window.scrollY || 0;
  let scrollDeltaTracker = 0;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouseVelX = (e.clientX - lastMouseX) * 0.12;
    lastMouseX = e.clientX;
    mouseX = e.clientX;
    mouseY = e.clientY;
    clearTimeout(mouseTimer);
    mouseTimer = setTimeout(() => { mouseVelX = 0; }, 140);
  });

  // Scroll Event: Accelerate flames proportional to scroll speed
  window.addEventListener('scroll', () => {
    const nowY = window.scrollY || 0;
    const delta = Math.abs(nowY - lastScrollY);
    lastScrollY = nowY;

    if (delta > 1) {
      scrollDeltaTracker = delta;
      // Surge target speed smoothly up to 3.2x
      targetSpeed = Math.min(3.4, targetSpeed + delta * 0.05 + 0.35);

      // Spawn extra upward ember sparks on vigorous scrolling
      if (sparks.length < 140 && Math.random() < 0.6) {
        sparks.push(new Spark(false, Math.random() * width, height - Math.random() * 60, true));
      }
    }
  }, { passive: true });

  // Click / Tap Event: Explosive Ignition Burst & Immediate Flame Acceleration
  window.addEventListener('pointerdown', (e) => {
    // Avoid interfering with inputs, textareas, or buttons inside modals
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;

    // Instant acceleration to roaring fire speed
    targetSpeed = 3.6;

    // Trigger explosive radial ignition burst at click coordinates
    spawnClickIgnition(e.clientX, e.clientY);
  });

  // Base flame spouts and climbing flame tongues
  const isMobile = window.innerWidth < 768;
  const flameCount = isMobile ? 65 : 125;
  const sparkCount = isMobile ? 35 : 75;

  const flames = [];
  const sparks = [];
  const clickBursts = [];

  class Flame {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.baseX = Math.random() * width;
      this.x = this.baseX;
      // Stagger initial Y for immediate full canvas immersion
      this.y = initial ? height - Math.random() * (height * 0.65) : height + Math.random() * 25;
      
      this.baseSize = Math.random() * 26 + 18; // 18px to 44px
      this.currentSize = this.baseSize;
      
      // Upward convective thermal draft
      this.baseSpeedY = Math.random() * 2.8 + 2.0;
      this.speedX = (Math.random() - 0.5) * 1.2;
      
      this.life = initial ? Math.random() * 0.8 : 0;
      this.maxLife = 1.0;
      this.decay = Math.random() * 0.010 + 0.007; // smooth natural lifetime
      
      this.swayFreq = Math.random() * 0.04 + 0.025;
      this.swayAmp = Math.random() * 28 + 14;
      this.swayOffset = Math.random() * Math.PI * 2;
      
      // Vertical elongation for authentic flame tongue contour
      this.scaleY = Math.random() * 0.6 + 1.6; // 1.6 to 2.2x vertical stretch
      this.scaleX = Math.random() * 0.2 + 0.65;
    }

    update(time, speedFactor) {
      // Decay accelerates with higher speed factor
      this.life += this.decay * (0.65 + speedFactor * 0.65);
      if (this.life >= this.maxLife || this.y < -70) {
        this.reset();
        return;
      }

      // Convective thermal acceleration upward, scaled smoothly by speedFactor
      const currentSpeedY = (this.baseSpeedY * speedFactor) + (1 - this.life) * (1.5 * speedFactor);
      this.y -= currentSpeedY;
      
      // Sinusoidal flame flutter and draft wind
      const sway = Math.sin(time * 0.003 * this.swayFreq * 60 + this.y * 0.015 + this.swayOffset) * (this.swayAmp * (1 - this.life * 0.5));
      this.x += (sway * 0.035 * speedFactor) + (mouseVelX * (1 - this.life) * 0.4);

      // Thermal expansion at ignition, then sharp taper to pointed flame tip
      if (this.life < 0.25) {
        this.currentSize = this.baseSize * (1 + this.life * 0.8);
      } else {
        this.currentSize = this.baseSize * 1.2 * (1 - (this.life - 0.25) / 0.75);
      }
      // When surging with high energy, flames flare wider and more intensely
      if (speedFactor > 1.2) {
        this.currentSize *= (1 + (speedFactor - 1.2) * 0.12);
      }
      this.currentSize = Math.max(0.1, this.currentSize);
    }

    draw(speedFactor) {
      if (this.currentSize <= 0.5) return;

      const progress = this.life; // 0 (ignition at bottom) to 1 (cool tip)
      // When accelerating, alpha glows hotter and brighter
      const intensity = Math.min(1.0, 0.85 + (speedFactor - BASE_SPEED) * 0.08);
      const alpha = Math.max(0, Math.sin(progress * Math.PI)) * intensity;

      ctx.save();
      ctx.translate(this.x, this.y);
      // Flame stretches taller when moving fast
      const stretchY = this.scaleY * (1 + Math.max(0, speedFactor - 1) * 0.2);
      ctx.scale(this.scaleX, stretchY);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentSize);

      if (progress < 0.3) {
        // Incandescent white-yellow hot base
        grad.addColorStop(0, `rgba(255, 255, 240, ${alpha * 0.98})`);
        grad.addColorStop(0.35, `rgba(254, 215, 170, ${alpha * 0.88})`);
        grad.addColorStop(0.75, `rgba(245, 158, 11, ${alpha * 0.55})`);
        grad.addColorStop(1, 'rgba(234, 88, 12, 0)');
      } else if (progress < 0.7) {
        // Vibrant molten gold into burning orange
        grad.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.92})`);
        grad.addColorStop(0.4, `rgba(234, 88, 12, ${alpha * 0.78})`);
        grad.addColorStop(0.8, `rgba(220, 38, 38, ${alpha * 0.42})`);
        grad.addColorStop(1, 'rgba(185, 28, 28, 0)');
      } else {
        // Deep crimson flame tip & dissipating smoke wisp
        grad.addColorStop(0, `rgba(234, 88, 12, ${alpha * 0.72})`);
        grad.addColorStop(0.5, `rgba(220, 38, 38, ${alpha * 0.45})`);
        grad.addColorStop(0.85, `rgba(153, 27, 27, ${alpha * 0.2})`);
        grad.addColorStop(1, 'rgba(30, 20, 30, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.currentSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Spark {
    constructor(initial = false, startX = null, startY = null, isTrail = false) {
      this.reset(initial, startX, startY, isTrail);
    }

    reset(initial = false, startX = null, startY = null, isTrail = false) {
      this.x = startX !== null ? startX : Math.random() * width;
      this.y = startY !== null ? startY : (initial ? Math.random() * height : height + Math.random() * 40);
      this.size = Math.random() * 2.6 + 1.2;
      this.baseSpeedY = Math.random() * 3.5 + 2.0;
      this.speedX = (Math.random() - 0.5) * 2.0;
      this.alpha = Math.random() * 0.8 + 0.25;
      this.decay = Math.random() * 0.012 + 0.006;
      this.life = initial ? Math.random() : 0;
      this.color = Math.random() > 0.35 ? '#fbbf24' : '#ea580c';
      this.isTrail = isTrail;
    }

    update(speedFactor) {
      this.life += this.decay * (0.65 + speedFactor * 0.7);
      if (this.life >= 1 || this.y < -25) {
        if (this.isTrail) {
          this.dead = true;
          return;
        }
        this.reset();
        return;
      }
      this.y -= this.baseSpeedY * speedFactor;
      this.x += this.speedX + (Math.sin(this.y * 0.03) * 0.8 * speedFactor);
      this.speedX += (Math.random() - 0.5) * 0.25;
    }

    draw() {
      const a = (1 - this.life) * this.alpha;
      if (a <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color === '#fbbf24' 
        ? `rgba(251, 191, 36, ${a})` 
        : `rgba(234, 88, 12, ${a})`;
      ctx.shadowBlur = this.size * 4;
      ctx.shadowColor = '#f59e0b';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Click Ignition Shockwave & Burst Sparks
  class ClickBurst {
    constructor(cx, cy) {
      this.x = cx;
      this.y = cy;
      this.radius = 8;
      this.maxRadius = 85;
      this.alpha = 1.0;
      this.dead = false;

      // Spawn burst particles
      this.particles = [];
      const count = isMobile ? 14 : 22;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 6.5 + 2.5;
        this.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 1.5, // slight upward bias
          size: Math.random() * 3.5 + 1.5,
          life: 0,
          decay: Math.random() * 0.03 + 0.015,
          color: Math.random() > 0.3 ? '#fef08a' : (Math.random() > 0.5 ? '#fbbf24' : '#ea580c')
        });
      }
    }

    update() {
      // Expand shockwave
      this.radius += 3.8;
      this.alpha = Math.max(0, 1 - (this.radius / this.maxRadius));

      let allDead = this.radius >= this.maxRadius;

      // Update explosion particles
      for (let p of this.particles) {
        p.life += p.decay;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // air friction
        p.vy = (p.vy * 0.94) - 0.4; // upward draft acceleration
        if (p.life < 1) allDead = false;
      }

      if (allDead) {
        this.dead = true;
      }
    }

    draw() {
      // Draw expanding fire shockwave ring
      if (this.alpha > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.lineWidth = 3 * this.alpha;
        ctx.strokeStyle = `rgba(251, 191, 36, ${this.alpha * 0.8})`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ea580c';
        ctx.stroke();
        ctx.restore();
      }

      // Draw burst particles
      for (let p of this.particles) {
        if (p.life >= 1) continue;
        const a = (1 - p.life) * 0.95;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - p.life * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#f59e0b';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function spawnClickIgnition(x, y) {
    if (clickBursts.length < 10) {
      clickBursts.push(new ClickBurst(x, y));
    }
  }

  // Populate initial particles
  for (let i = 0; i < flameCount; i++) {
    flames.push(new Flame());
  }
  for (let i = 0; i < sparkCount; i++) {
    sparks.push(new Spark(true));
  }

  let time = 0;

  function animate() {
    time++;

    // Smooth physics lerp: currentSpeed follows targetSpeed smoothly
    currentSpeed += (targetSpeed - currentSpeed) * 0.08;
    // Relaxation: targetSpeed slowly and naturally eases back to BASE_SPEED
    targetSpeed += (BASE_SPEED - targetSpeed) * 0.024;

    ctx.clearRect(0, 0, width, height);

    // Use lighter (additive) blending so overlapping flame puffs create fiery radiance!
    ctx.globalCompositeOperation = 'lighter';

    // 1. Draw procedural roaring base flame wave contour at bottom
    // Wave height and frequency scale dynamically with currentSpeed!
    const baseWaveHeight = 45 + Math.min(40, (currentSpeed - BASE_SPEED) * 16);
    const waveY = height - baseWaveHeight;
    const waveFreq = 0.018 + (currentSpeed - BASE_SPEED) * 0.004;
    const waveSpeed = 0.025 * currentSpeed;

    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 15) {
      const y = waveY - Math.sin(x * waveFreq + time * waveSpeed * 2) * (14 * (currentSpeed * 0.7))
                      - Math.sin(x * 0.04 - time * waveSpeed * 3) * (9 * (currentSpeed * 0.7))
                      - Math.cos(x * 0.08 + time * waveSpeed * 1.5) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const baseGrad = ctx.createLinearGradient(0, height - (baseWaveHeight + 35), 0, height);
    baseGrad.addColorStop(0, 'rgba(234, 88, 12, 0)');
    baseGrad.addColorStop(0.3, `rgba(245, 158, 11, ${Math.min(0.5, 0.22 + (currentSpeed - BASE_SPEED) * 0.08)})`);
    baseGrad.addColorStop(0.7, `rgba(234, 88, 12, ${Math.min(0.65, 0.35 + (currentSpeed - BASE_SPEED) * 0.1)})`);
    baseGrad.addColorStop(1, `rgba(220, 38, 38, ${Math.min(0.85, 0.55 + (currentSpeed - BASE_SPEED) * 0.12)})`);
    ctx.fillStyle = baseGrad;
    ctx.fill();

    // 2. Update and draw ascending flames in motion
    for (let i = 0; i < flames.length; i++) {
      flames[i].update(time, currentSpeed);
      flames[i].draw(currentSpeed);
    }

    // 3. Update and draw energetic sparks & embers
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update(currentSpeed);
      if (sparks[i].dead) {
        sparks.splice(i, 1);
      } else {
        sparks[i].draw();
      }
    }

    // 4. Update and draw interactive click bursts & shockwaves
    for (let i = clickBursts.length - 1; i >= 0; i--) {
      clickBursts[i].update();
      clickBursts[i].draw();
      if (clickBursts[i].dead) {
        clickBursts.splice(i, 1);
      }
    }

    // Restore normal composition
    ctx.globalCompositeOperation = 'source-over';

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

/* ==========================================================================
   9. Official Instagram Feed & Creative Post Upload Studio
   Page: https://www.instagram.com/bombshellgrenade
   ========================================================================== */
const DEFAULT_IG_POSTS = [
  {
    id: 'ig-post-1',
    time: '2 hours ago',
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Lusaka! The energy is unmatched. We are officially preparing the next chapter for BOMB NATION. New music visuals are in the cutting room and summer concert dates are dropping this week. Stay locked, stay royal. 👑🔥💣 #KingKongQueen #BombNation #ZambianMusicToTheWorld #MfumuKadzi',
    image: 'src/hero-banner.jpg',
    likes: 14820,
    comments: 842,
    shares: 390,
    url: 'https://www.instagram.com/bombshellgrenade'
  },
  {
    id: 'ig-post-2',
    time: 'Yesterday',
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Reflecting on our landmark LP "Mfumu Kadzi" (The Queen). Over 19 tracks of unapologetic Zambian hip-hop and soul. Huge gratitude to Jay Rox, Mumba Yachi, Skales, Tim, and every producer who helped shape this sonic crown. Streaming now across all digital platforms! 💿🇿🇲 #MfumuKadzi #AFRIMMA #BombshellGrenade',
    image: 'src/single-backshot.jpg',
    likes: 22450,
    comments: 1120,
    shares: 650,
    url: 'https://www.instagram.com/bombshellgrenade'
  },
  {
    id: 'ig-post-3',
    time: '3 days ago',
    author: 'bombshellgrenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Dignity is a right, not a privilege. Proud to continue our work with Urban Girl reusable sanitary pads across schools in Lusaka. Every girl deserves uninterrupted education without period poverty holding her back. Empower a girl, empower a nation. 💕✨ #UrbanGirl #BombshellInTheCommunity #EmpowerTheGirlChild',
    image: 'src/entrepreneur-urbangirl.jpg',
    likes: 18930,
    comments: 940,
    shares: 512,
    url: 'https://www.instagram.com/bombshellgrenade'
  }
];

// Backwards compatibility alias
const DEFAULT_FB_POSTS = DEFAULT_IG_POSTS;

function getStoredInstagramPosts() {
  try {
    const raw = localStorage.getItem('bombshell_ig_posts') || localStorage.getItem('bombshell_fb_posts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read stored Instagram posts:', err);
  }
  return [...DEFAULT_IG_POSTS];
}

function saveStoredInstagramPosts(posts) {
  try {
    localStorage.setItem('bombshell_ig_posts', JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save Instagram posts to localStorage:', err);
  }
}

// Backwards compatibility functions
const getStoredFacebookPosts = getStoredInstagramPosts;
const saveStoredFacebookPosts = saveStoredInstagramPosts;

// Cross-tab real-time sync channel
let liveSyncBroadcastChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    liveSyncBroadcastChannel = new BroadcastChannel('bombshell_ig_realtime_sync');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

function initInstagramFeed() {
  const container = document.getElementById('ig-feed-grid') || document.getElementById('fb-feed-grid');
  if (!container) return; // Only runs if the feed element exists (e.g. on homepage)

  let posts = getStoredInstagramPosts();
  let lastSyncTimestamp = Date.now();
  let nextCheckSeconds = 25;
  let eventSource = null;
  let isSyncing = false;

  // Highlight hashtags with links/amber styling
  function formatCaption(text) {
    return text.replace(/(#[a-zA-Z0-9_]+)/g, '<span class="ig-post-tag fb-post-tag">$1</span>');
  }

  // Format large counts
  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return (num || 0).toString();
  }

  // Format elapsed time string
  function formatElapsedTime(ms) {
    const sec = Math.floor(ms / 1000);
    if (sec < 4) return 'Just now';
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    return `${hours}h ago`;
  }

  // Update telemetry countdown & elapsed time display every second
  function updateTelemetryUI() {
    const elapsedEl = document.getElementById('ig-live-elapsed-time');
    const countdownEl = document.getElementById('ig-live-countdown');
    
    if (elapsedEl) {
      elapsedEl.textContent = formatElapsedTime(Date.now() - lastSyncTimestamp);
    }
    
    if (countdownEl) {
      countdownEl.textContent = `${Math.max(0, nextCheckSeconds)}s`;
    }
  }

  // Render the latest 3 Instagram posts
  function renderFeed(flashCards = false) {
    container.innerHTML = '';
    const displayPosts = posts.slice(0, 3); // always latest 3 posts

    displayPosts.forEach((post, index) => {
      const card = document.createElement('article');
      card.className = `ig-post-card fb-post-card ${flashCards ? 'live-synced-flash' : ''}`;
      card.id = `ig-card-${post.id || index}`;

      card.innerHTML = `
        <header class="ig-card-header fb-card-header">
          <div class="ig-author-row fb-author-row">
            <div class="ig-avatar-ring fb-avatar-ring">
              <img 
                src="${post.avatar || 'src/about-portrait.jpg'}" 
                alt="bombshellgrenade Avatar" 
                class="ig-avatar-img fb-avatar-img"
                onerror="this.onerror=null; this.src='src/about-portrait.svg';"
              />
            </div>
            <div class="ig-author-details fb-author-details">
              <span class="ig-author-name fb-author-name">
                @bombshellgrenade
                <svg class="ig-verified-badge" viewBox="0 0 24 24" fill="#3897f0" style="width: 15px; height: 15px; flex-shrink: 0;">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </span>
              <span class="ig-post-time fb-post-time">
                Lusaka, Zambia &bull; ${post.time || 'Recently posted'}
              </span>
            </div>
          </div>
          <a 
            href="${post.url || 'https://www.instagram.com/bombshellgrenade'}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="ig-network-icon fb-network-icon"
            title="View on Instagram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
        </header>

        <div class="ig-card-body fb-card-body">
          <p class="ig-post-text fb-post-text">${formatCaption(post.text || '')}</p>
        </div>

        ${post.image ? `
          <div class="ig-media-container fb-media-container" data-index="${index}" data-full-image="${post.image}" title="Double tap or click to like ❤️">
            <img 
              src="${post.image}" 
              alt="Instagram Post Media by @bombshellgrenade" 
              class="ig-media-img fb-media-img"
              onerror="this.onerror=null; this.src='src/about-portrait.svg';"
            />
            <div class="ig-media-overlay-badge fb-media-overlay-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span>View &bull; Double click to like</span>
            </div>
            <div class="ig-heart-pulse-anim" id="heart-pulse-${index}">
              <svg width="68" height="68" fill="#e1306c" viewBox="0 0 24 24" style="filter: drop-shadow(0 4px 12px rgba(225,48,108,0.7));"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
          </div>
        ` : ''}

        <div class="ig-engagement-bar fb-engagement-bar">
          <div class="ig-reactions-group fb-reactions-group">
            <span class="ig-emojis-cluster fb-emojis-cluster">
              <span class="ig-emoji-bubble fb-emoji-bubble fb-emoji-fire">🔥</span>
              <span class="ig-emoji-bubble fb-emoji-bubble fb-emoji-love">❤️</span>
              <span class="ig-emoji-bubble fb-emoji-bubble" style="background: linear-gradient(45deg, #f09433, #e1306c); color: #fff;">👑</span>
            </span>
            <span class="ig-likes-count fb-likes-count" id="likes-count-${index}">
              ${formatNumber(post.likes || 1200)} likes
            </span>
          </div>
          <div>
            <span>${formatNumber(post.comments || 180)} comments</span> &bull; 
            <span>${formatNumber(post.shares || 65)} shares</span>
          </div>
        </div>

        <div class="ig-actions-bar fb-actions-bar">
          <button type="button" class="ig-action-btn fb-action-btn ig-btn-like fb-btn-like" data-index="${index}">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            <span>Like</span>
          </button>

          <button type="button" class="ig-action-btn fb-action-btn ig-btn-comment fb-btn-comment" data-index="${index}">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>Comment</span>
          </button>

          <button type="button" class="ig-action-btn fb-action-btn ig-btn-share fb-btn-share" data-url="${post.url || 'https://www.instagram.com/bombshellgrenade'}">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span>Share</span>
          </button>

          <div class="ig-action-external fb-action-external">
            <a href="${post.url || 'https://www.instagram.com/bombshellgrenade'}" target="_blank" rel="noopener noreferrer" class="ig-direct-link-btn fb-direct-link-btn">
              <span>View Post on Instagram</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </div>

        <!-- Inline Comment Form -->
        <div class="ig-comment-box fb-comment-box" id="comment-box-${index}">
          <div class="ig-comment-input-row fb-comment-input-row">
            <input 
              type="text" 
              class="ig-comment-input fb-comment-input" 
              placeholder="Add a comment to @bombshellgrenade..." 
              id="comment-input-${index}"
            />
            <button type="button" class="ig-comment-submit-btn fb-comment-submit-btn" data-index="${index}">Post</button>
          </div>
          <div class="ig-card-comments-list fb-card-comments-list" id="comments-list-${index}">
            <div class="ig-comment-bubble fb-comment-bubble">
              <strong>bombnation_official &bull; Lusaka</strong>
              <span>Salute the Queen of African hip-hop! Mfumu Kadzi forever! 👑🔥</span>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Attach card event listeners
    attachFeedCardListeners();
  }

  // Double-tap or trigger heart animation
  function triggerHeartAnimation(idx) {
    const heartAnim = document.getElementById(`heart-pulse-${idx}`);
    if (heartAnim) {
      heartAnim.style.transform = 'translate(-50%, -50%) scale(1.3)';
      heartAnim.style.opacity = '1';
      setTimeout(() => {
        heartAnim.style.transform = 'translate(-50%, -50%) scale(0)';
        heartAnim.style.opacity = '0';
      }, 550);
    }
  }

  function attachFeedCardListeners() {
    // Like button reaction
    container.querySelectorAll('.ig-btn-like, .fb-btn-like').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'), 10);
        const post = posts[idx];
        if (!post) return;

        const isLiked = this.classList.contains('liked');
        if (isLiked) {
          this.classList.remove('liked');
          post.likes = Math.max(0, (post.likes || 0) - 1);
        } else {
          this.classList.add('liked');
          post.likes = (post.likes || 0) + 1;
          triggerHeartAnimation(idx);
          showToast('Liked post on @bombshellgrenade feed! ❤️🔥');
        }

        const countEl = document.getElementById(`likes-count-${idx}`);
        if (countEl) countEl.textContent = `${formatNumber(post.likes)} likes`;
        saveStoredInstagramPosts(posts);

        // Notify server of reaction for real-time broadcast
        fetch('/api/instagram/react', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId: post.id,
            action: isLiked ? 'unlike' : 'like'
          })
        }).catch(() => {});

        // Broadcast cross-tab
        if (liveSyncBroadcastChannel) {
          liveSyncBroadcastChannel.postMessage({
            type: 'reaction',
            postId: post.id,
            likes: post.likes
          });
        }
      });
    });

    // Double-click image to like
    container.querySelectorAll('.ig-media-container, .fb-media-container').forEach(media => {
      let lastTap = 0;
      media.addEventListener('click', function(e) {
        const now = Date.now();
        const idx = parseInt(this.getAttribute('data-index'), 10);
        // Detect double click / double tap
        if (now - lastTap < 350) {
          e.preventDefault();
          e.stopPropagation();
          const likeBtn = container.querySelector(`.ig-btn-like[data-index="${idx}"]`);
          if (likeBtn && !likeBtn.classList.contains('liked')) {
            likeBtn.click();
          } else {
            triggerHeartAnimation(idx);
          }
        } else {
          lastTap = now;
          // Normal single click opens lightbox
          const fullImgSrc = this.getAttribute('data-full-image');
          const lightbox = document.getElementById('gallery-lightbox');
          const lightboxImg = document.getElementById('lightbox-image') || document.getElementById('lightbox-img');
          const lightboxTitle = document.getElementById('lightbox-caption-text') || document.getElementById('lightbox-title');
          const lightboxCat = document.getElementById('lightbox-category');

          if (lightbox && lightboxImg && fullImgSrc) {
            lightboxImg.src = fullImgSrc;
            if (lightboxTitle) lightboxTitle.textContent = 'Instagram Post Media — @bombshellgrenade';
            if (lightboxCat) lightboxCat.textContent = 'Official Instagram Feed';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }
      });
    });

    // Comment toggle
    container.querySelectorAll('.ig-btn-comment, .fb-btn-comment').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        const box = document.getElementById(`comment-box-${idx}`);
        if (box) {
          box.classList.toggle('open');
          if (box.classList.contains('open')) {
            const input = document.getElementById(`comment-input-${idx}`);
            if (input) input.focus();
          }
        }
      });
    });

    // Submit inline comment
    container.querySelectorAll('.ig-comment-submit-btn, .fb-comment-submit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        const input = document.getElementById(`comment-input-${idx}`);
        const list = document.getElementById(`comments-list-${idx}`);
        if (!input || !list) return;

        const val = input.value.trim();
        if (!val) return;

        const bubble = document.createElement('div');
        bubble.className = 'ig-comment-bubble fb-comment-bubble';
        bubble.innerHTML = `<strong>bomb_nation_fan &bull; Verified</strong><span>${val}</span>`;
        list.prepend(bubble);

        const post = posts[idx];
        if (post) {
          post.comments = (post.comments || 0) + 1;
          saveStoredInstagramPosts(posts);

          fetch('/api/instagram/react', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              postId: post.id,
              action: 'comment',
              commentText: val
            })
          }).catch(() => {});
        }

        input.value = '';
        showToast('Comment posted in real-time to Instagram feed!');
      });
    });

    // Share link
    container.querySelectorAll('.ig-btn-share, .fb-btn-share').forEach(btn => {
      btn.addEventListener('click', function() {
        const url = this.getAttribute('data-url') || 'https://www.instagram.com/bombshellgrenade';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          showToast('Instagram link copied to clipboard!');
        } else {
          showToast('Official Instagram: instagram.com/bombshellgrenade');
        }
      });
    });
  }

  // Trigger Real-Time Live Synchronization with Server / Instagram
  async function triggerLiveSync(isManual = false) {
    if (isSyncing) return;
    isSyncing = true;

    // Visual loading state
    const syncIcons = document.querySelectorAll('.sync-icon-spin');
    syncIcons.forEach(i => i.classList.add('spinning'));

    const statusPillText = document.getElementById('ig-sync-status-text');
    if (statusPillText) statusPillText.textContent = 'Synchronizing...';

    try {
      const response = await fetch('/api/instagram/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.posts) && data.posts.length > 0) {
          posts = data.posts;
          saveStoredInstagramPosts(posts);
          lastSyncTimestamp = data.lastSyncTimestamp || Date.now();
          renderFeed(true);
        }
      } else {
        // Local simulation if server endpoint is busy
        if (posts[0]) posts[0].time = 'Just synced with Instagram';
        lastSyncTimestamp = Date.now();
        saveStoredInstagramPosts(posts);
        renderFeed(true);
      }
    } catch (err) {
      // Offline / fallback sync
      if (posts[0]) posts[0].time = 'Just synced with Instagram';
      lastSyncTimestamp = Date.now();
      saveStoredInstagramPosts(posts);
      renderFeed(true);
    } finally {
      isSyncing = false;
      nextCheckSeconds = 25;
      syncIcons.forEach(i => i.classList.remove('spinning'));
      
      if (statusPillText) statusPillText.textContent = 'Real-Time Live Sync';
      updateTelemetryUI();

      if (isManual) {
        showToast('⚡ Real-time synchronized with @bombshellgrenade Instagram!');
      }

      // Broadcast to other tabs
      if (liveSyncBroadcastChannel) {
        liveSyncBroadcastChannel.postMessage({
          type: 'feed_sync',
          posts,
          lastSyncTimestamp
        });
      }
    }
  }

  // Connect to Real-time Server-Sent Events (SSE) Stream
  function connectRealTimeStream() {
    if (typeof EventSource === 'undefined') return;

    try {
      if (eventSource) eventSource.close();
      eventSource = new EventSource('/api/instagram/stream');

      eventSource.addEventListener('init', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.posts) && payload.posts.length > 0) {
            posts = payload.posts;
            saveStoredInstagramPosts(posts);
            lastSyncTimestamp = payload.lastSyncTimestamp || Date.now();
            renderFeed(false);
            updateTelemetryUI();
          }
          const badge = document.getElementById('ig-stream-status-badge');
          if (badge) badge.textContent = 'SSE Stream Connected';
        } catch (err) {
          console.error('Error parsing init stream:', err);
        }
      });

      eventSource.addEventListener('feed_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.posts)) {
            posts = payload.posts;
            saveStoredInstagramPosts(posts);
            lastSyncTimestamp = payload.lastSyncTimestamp || Date.now();
            nextCheckSeconds = 25;
            renderFeed(true);
            updateTelemetryUI();
            showToast('⚡ Live Synced with @bombshellgrenade');
          }
        } catch (err) {
          console.error('Error parsing stream update:', err);
        }
      });

      eventSource.addEventListener('post_added', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.posts)) {
            posts = payload.posts;
            saveStoredInstagramPosts(posts);
            lastSyncTimestamp = payload.lastSyncTimestamp || Date.now();
            nextCheckSeconds = 25;
            renderFeed(true);
            updateTelemetryUI();
            showToast('⚡ New post from @bombshellgrenade received in real-time!');
          }
        } catch (err) {
          console.error('Error parsing stream post added:', err);
        }
      });

      eventSource.addEventListener('reaction_update', (e) => {
        try {
          const payload = JSON.parse(e.data);
          const idx = posts.findIndex(p => p.id === payload.postId);
          if (idx !== -1) {
            if (typeof payload.likes === 'number') posts[idx].likes = payload.likes;
            if (typeof payload.comments === 'number') posts[idx].comments = payload.comments;
            const countEl = document.getElementById(`likes-count-${idx}`);
            if (countEl) countEl.textContent = `${formatNumber(posts[idx].likes)} likes`;
          }
        } catch (err) {
          console.error('Error handling reaction stream:', err);
        }
      });

      eventSource.addEventListener('feed_reset', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (Array.isArray(payload.posts)) {
            posts = payload.posts;
            saveStoredInstagramPosts(posts);
            renderFeed(false);
          }
        } catch (err) {}
      });

      eventSource.addEventListener('ping', () => {
        const badge = document.getElementById('ig-stream-status-badge');
        if (badge) badge.textContent = 'SSE Stream Connected &bull; Real-Time';
      });

      eventSource.onerror = () => {
        const badge = document.getElementById('ig-stream-status-badge');
        if (badge) badge.textContent = 'Auto Polling Fallback';
      };
    } catch (err) {
      console.warn('Could not establish SSE connection:', err);
    }
  }

  // Cross-tab broadcast listener
  if (liveSyncBroadcastChannel) {
    liveSyncBroadcastChannel.onmessage = (event) => {
      const { type, posts: newPosts, lastSyncTimestamp: ts } = event.data || {};
      if ((type === 'feed_sync' || type === 'post_added') && Array.isArray(newPosts)) {
        posts = newPosts;
        if (ts) lastSyncTimestamp = ts;
        renderFeed(true);
        updateTelemetryUI();
      }
    };
  }

  // Storage event listener for cross-window sync
  window.addEventListener('storage', (e) => {
    if (e.key === 'bombshell_ig_posts' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          posts = parsed;
          renderFeed(true);
        }
      } catch {}
    }
  });

  // Background Heartbeat Interval (Ticks every 1 second)
  setInterval(() => {
    nextCheckSeconds--;
    updateTelemetryUI();

    // Trigger auto live synchronization check
    if (nextCheckSeconds <= 0) {
      nextCheckSeconds = 25;
      triggerLiveSync(false);
    }
  }, 1000);

  // Quick live sync button in feed header
  const quickSyncBtn = document.getElementById('btn-quick-ig-sync');
  if (quickSyncBtn) {
    quickSyncBtn.addEventListener('click', () => {
      triggerLiveSync(true);
    });
  }

  // Initial render & SSE start
  renderFeed(false);
  updateTelemetryUI();
  connectRealTimeStream();

  // Setup the Upload & Sync Studio Modal
  initInstagramUploadModal(posts, (updatedPosts) => {
    posts = updatedPosts;
    lastSyncTimestamp = Date.now();
    renderFeed(true);
    updateTelemetryUI();
  }, triggerLiveSync);
}

// Backwards compatibility alias
const initFacebookFeed = initInstagramFeed;
window.initFacebookFeed = initInstagramFeed;
window.initInstagramFeed = initInstagramFeed;

/* ==========================================================================
   10. Instagram Upload & Sync Studio Modal Controller
   ========================================================================== */
function initInstagramUploadModal(posts, onFeedUpdated, onTriggerLiveSync) {
  const modal = document.getElementById('ig-upload-modal') || document.getElementById('fb-upload-modal');
  const openBtn = document.getElementById('btn-open-ig-sync-modal') || document.getElementById('btn-open-fb-sync-modal');
  const closeBtn = document.getElementById('ig-modal-close-btn') || document.getElementById('fb-modal-close-btn');
  if (!modal || !openBtn) return;

  // Modal Open / Close
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const jsonTextarea = document.getElementById('ig-json-editor') || document.getElementById('fb-json-editor');
    if (jsonTextarea) {
      jsonTextarea.value = JSON.stringify(posts, null, 2);
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Modal Tab Switching
  const tabBtns = modal.querySelectorAll('.ig-modal-tab-btn, .fb-modal-tab-btn');
  const tabPanes = modal.querySelectorAll('.ig-modal-tab-pane, .fb-modal-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.style.display = 'none');

      this.classList.add('active');
      const targetId = this.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // Drag-and-drop Image Upload Zone
  const dropzone = document.getElementById('ig-image-dropzone') || document.getElementById('fb-image-dropzone');
  const fileInput = document.getElementById('ig-post-file-input') || document.getElementById('fb-post-file-input');
  const previewImg = document.getElementById('ig-dropzone-preview') || document.getElementById('fb-dropzone-preview');
  let uploadedImageData = '';

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const files = e.dataTransfer?.files;
      if (files && files[0]) {
        processImageFile(files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        processImageFile(file);
      }
    });

    function processImageFile(file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadedImageData = event.target?.result || '';
        if (previewImg) {
          previewImg.src = uploadedImageData;
          previewImg.classList.add('has-image');
        }
        showToast('Image uploaded and ready for publication!');
      };
      reader.readAsDataURL(file);
    }
  }

  // Upload Form Submission (Tab 1)
  const form = document.getElementById('ig-upload-form') || document.getElementById('fb-upload-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const caption = (document.getElementById('ig-upload-caption') || document.getElementById('fb-upload-caption'))?.value.trim();
      const timeText = (document.getElementById('ig-upload-time') || document.getElementById('fb-upload-time'))?.value.trim() || 'Just now';
      const urlText = (document.getElementById('ig-upload-url') || document.getElementById('fb-upload-url'))?.value.trim() || 'https://www.instagram.com/bombshellgrenade';
      const imageURL = (document.getElementById('ig-upload-image-url') || document.getElementById('fb-upload-image-url'))?.value.trim();
      const likesCount = parseInt((document.getElementById('ig-upload-likes') || document.getElementById('fb-upload-likes'))?.value, 10) || 12500;

      if (!caption) {
        showToast('Please enter the Instagram caption text.', 'error');
        return;
      }

      const finalImage = uploadedImageData || imageURL || 'src/hero-banner.jpg';

      const newPost = {
        id: 'ig-' + Date.now(),
        time: timeText,
        author: 'bombshellgrenade',
        avatar: 'src/about-portrait.jpg',
        text: caption,
        image: finalImage,
        likes: likesCount,
        comments: Math.floor(likesCount * 0.08),
        shares: Math.floor(likesCount * 0.03),
        url: urlText,
        isLiveSynced: true
      };

      // Push to backend server for real-time live distribution
      try {
        const res = await fetch('/api/instagram/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caption,
            image: finalImage,
            url: urlText,
            time: timeText,
            likes: likesCount
          })
        });
        if (res.ok) {
          const result = await res.json();
          if (Array.isArray(result.posts)) {
            posts = result.posts;
          } else {
            posts.unshift(newPost);
          }
        } else {
          posts.unshift(newPost);
        }
      } catch (err) {
        posts.unshift(newPost);
      }

      saveStoredInstagramPosts(posts);
      onFeedUpdated(posts);

      // Broadcast cross-tab
      if (liveSyncBroadcastChannel) {
        liveSyncBroadcastChannel.postMessage({
          type: 'post_added',
          posts,
          lastSyncTimestamp: Date.now()
        });
      }

      // Reset form
      form.reset();
      uploadedImageData = '';
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.remove('has-image');
      }

      closeModal();
      showToast('New Instagram post published & synchronized in real-time! 🔥');
    });
  }

  // Live Sync & Batch Manager Actions (Tab 2)
  const syncBtn = document.getElementById('btn-sync-ig-live') || document.getElementById('btn-sync-fb-live');
  const resetBtn = document.getElementById('btn-reset-ig-defaults') || document.getElementById('btn-reset-fb-defaults');
  const jsonTextarea = document.getElementById('ig-json-editor') || document.getElementById('fb-json-editor');
  const importJsonBtn = document.getElementById('btn-import-ig-json') || document.getElementById('btn-import-fb-json');

  if (jsonTextarea) {
    jsonTextarea.value = JSON.stringify(posts, null, 2);
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      const originalHtml = syncBtn.innerHTML;
      syncBtn.innerHTML = '<span>Synchronizing in real-time...</span>';

      if (onTriggerLiveSync) {
        await onTriggerLiveSync(true);
      }

      setTimeout(() => {
        syncBtn.disabled = false;
        syncBtn.innerHTML = originalHtml;
        if (jsonTextarea) jsonTextarea.value = JSON.stringify(posts, null, 2);
      }, 500);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/instagram/reset', { method: 'POST' });
      } catch {}
      posts.length = 0;
      DEFAULT_IG_POSTS.forEach(p => posts.push(p));
      saveStoredInstagramPosts(posts);
      onFeedUpdated(posts);
      if (jsonTextarea) jsonTextarea.value = JSON.stringify(posts, null, 2);
      showToast('Instagram feed reset to curated official page posts.');
    });
  }

  if (importJsonBtn && jsonTextarea) {
    importJsonBtn.addEventListener('click', () => {
      try {
        const imported = JSON.parse(jsonTextarea.value);
        if (Array.isArray(imported) && imported.length > 0) {
          posts.length = 0;
          imported.forEach(p => posts.push(p));
          saveStoredInstagramPosts(posts);
          onFeedUpdated(posts);
          closeModal();
          showToast('Instagram posts successfully updated from JSON feed in real-time!');
        } else {
          showToast('JSON must be an array of post objects.', 'error');
        }
      } catch (err) {
        showToast('Invalid JSON format. Please verify syntax.', 'error');
      }
    });
  }
}

// Backwards compatibility alias
const initFacebookUploadModal = initInstagramUploadModal;


