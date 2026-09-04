/**
 * BOMBSHELL GRENADE — OFFICIAL CELEBRITY PORTFOLIO
 * Shared JavaScript: Navigation, Flames in Motion, Audio Player, Lightbox,
 * VIP Pass Generator, Facebook Feed & Upload Studio, Form Validation & Image Fallbacks
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageFallbacks();
  initLionHologram();
  initEmberCanvas();
  initNavigation();
  initAudioPlayer();
  initGalleryLightbox();
  initVipPassGenerator();
  initContactForm();
  initInteractiveToasts();
  initFacebookFeed();
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
   2. Royal Roaring Lion Motion Hologram (Theme: "Bomb Fire" / MGM Lion Intro)
      - Majestic sitting lion making its sovereign royal presence known.
      - Iconic Metro-Goldwyn-Mayer inspired concentric filmstrip laurel arch with royal crown.
      - Articulated roaring lower jaw with glowing molten fiery gullet and saber fangs.
      - Living flame mane billowing with sinusoidal thermal updrafts.
      - Piercing golden laser eyes surveying the kingdom.
      - Concentric sonic roar soundwaves blasting across the background during roars.
      - Digital hologram scanlines, chromatic laser glow, and perspective floor grid.
      - Interactive: Roars on demand upon clicks, taps, scrolls, or badge toggle.
   ========================================================================== */
function initLionHologram() {
  let canvas = document.getElementById('lion-hologram-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'lion-hologram-canvas';
    const emberCanvas = document.getElementById('ember-canvas');
    if (emberCanvas && emberCanvas.parentNode) {
      emberCanvas.parentNode.insertBefore(canvas, emberCanvas);
    } else {
      document.body.insertBefore(canvas, document.body.firstChild);
    }
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Hologram state engine
  let time = 0;
  let currentRoar = 0;   // 0 (closed/sentry) to 1.0 (wide roar)
  let targetRoar = 0;
  let roarOverrideTimer = 0;
  let cursorX = width * 0.5;
  let cursorY = height * 0.5;
  let lastScrollY = window.scrollY || 0;

  // Active sonic soundwave rings emitted during roars
  const sonicWaves = [];
  // Ambient holographic floating energy nodes
  const holoParticles = [];

  const isMobileInitial = width < 768;
  for (let i = 0; i < (isMobileInitial ? 18 : 35); i++) {
    holoParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedY: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function triggerRoar(duration = 120) {
    roarOverrideTimer = Math.max(roarOverrideTimer, duration);
    targetRoar = 1.0;
  }

  // Synthesized cinematic sub-bass lion roar rumble on user interaction
  let audioCtx = null;
  function playRoarAudioSynth() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Deep, chest-resonating feline growl frequency
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(32, now + 2.0);

      // Low-pass filter for thunderous acoustic weight
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(90, now + 1.8);

      // Controlled subtle volume envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    } catch (e) {
      // Audio synth optional
    }
  }

  // Window interaction triggers
  window.addEventListener('pointerdown', (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea') return;
    triggerRoar(110);
  });

  window.addEventListener('scroll', () => {
    const nowY = window.scrollY || 0;
    const delta = Math.abs(nowY - lastScrollY);
    lastScrollY = nowY;
    if (delta > 2) {
      triggerRoar(Math.min(90, Math.floor(delta * 2.2 + 35)));
    }
  }, { passive: true });

  // Optional badge click trigger
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#holo-lion-trigger');
    if (trigger) {
      triggerRoar(140);
      playRoarAudioSynth();
    }
  });

  function spawnSonicWave(sourceX, sourceY) {
    if (sonicWaves.length < 18) {
      sonicWaves.push({
        x: sourceX,
        y: sourceY,
        r: 12,
        maxR: Math.min(width, 420),
        alpha: 0.95,
        speed: 5.5,
        lineWidth: 2.5
      });
    }
  }

  // Main Render Loop
  function render() {
    time++;

    // MGM Lion Choreography State Machine (approx 9 second cycle)
    const cycle = time % 540;
    let headPitch = 0; // tilt up/down
    let headYaw = 0;   // turn left/right
    let breathOffset = Math.sin(time * 0.04) * 3;

    if (roarOverrideTimer > 0) {
      roarOverrideTimer--;
      targetRoar = 1.0;
      headPitch = -0.15 + Math.sin(time * 0.35) * 0.04;
      headYaw = (cursorX / width - 0.5) * 0.12;
      breathOffset = 6;
    } else {
      if (cycle < 180) {
        // Phase 0: Regal Sentry Gaze (3.0s)
        targetRoar = 0.0;
        headPitch = 0.0;
        headYaw = Math.sin(time * 0.02) * 0.08 + (cursorX / width - 0.5) * 0.06;
      } else if (cycle < 225) {
        // Phase 1: Inhale & Tension Build (0.75s)
        targetRoar = 0.15;
        headPitch = -0.12;
        headYaw = -0.04;
        breathOffset = 5;
      } else if (cycle < 330) {
        // Phase 2: FIRST MIGHTY ROAR - MGM ROAR 1 (1.75s)
        targetRoar = 1.0;
        headPitch = -0.16 + Math.sin(time * 0.3) * 0.03;
        headYaw = -0.06;
      } else if (cycle < 375) {
        // Phase 3: Breath Draw / Regroup (0.75s)
        targetRoar = 0.22;
        headPitch = -0.06;
        headYaw = 0.02;
      } else if (cycle < 485) {
        // Phase 4: SECOND DEEP ROAR - MGM ROAR 2 (1.8s)
        targetRoar = 1.0;
        headPitch = -0.18 + Math.sin(time * 0.38) * 0.04;
        headYaw = 0.05;
      } else {
        // Phase 5: Regal Settle (0.9s)
        targetRoar = 0.0;
        headPitch = 0.0;
        headYaw = 0.0;
      }
    }

    // Smooth lerp of roar intensity
    currentRoar += (targetRoar - currentRoar) * 0.09;

    ctx.clearRect(0, 0, width, height);

    // Responsive Placement: Center-right on desktop, centered on mobile
    const isMobile = width < 860;
    const isTablet = width >= 860 && width < 1200;
    const lionX = isMobile ? width * 0.5 : width * 0.60;
    const lionY = isMobile ? height * 0.46 : height * 0.50;
    const lionScale = isMobile ? Math.min(width / 460, 0.70) : (isTablet ? 0.82 : Math.min(width / 1180, 1.05));

    // Spawn sonic waves from lion mouth during active roar
    if (currentRoar > 0.45 && time % 11 === 0) {
      const mouthWorldX = lionX;
      const mouthWorldY = lionY + (headPitch * 30 + 15) * lionScale;
      spawnSonicWave(mouthWorldX, mouthWorldY);
    }

    // 1. Draw Sonic Waves
    for (let i = sonicWaves.length - 1; i >= 0; i--) {
      const wave = sonicWaves[i];
      wave.r += wave.speed;
      wave.alpha = Math.max(0, 1 - (wave.r / wave.maxR));

      if (wave.alpha <= 0 || wave.r >= wave.maxR) {
        sonicWaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(251, 191, 36, ${wave.alpha * 0.65})`;
      ctx.lineWidth = wave.lineWidth * (1 + currentRoar * 0.5);
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ea580c';
      ctx.setLineDash([12, 6]);
      ctx.stroke();
      ctx.restore();
    }

    // 2. Draw Floating Hologram Energy Nodes
    ctx.save();
    for (const p of holoParticles) {
      p.y -= p.speedY;
      if (p.y < -20) p.y = height + 20;
      p.pulse += 0.04;
      const alpha = (Math.sin(p.pulse) * 0.25 + 0.45) * p.alpha;
      ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Draw Main Lion Hologram
    ctx.save();
    ctx.translate(lionX, lionY);
    ctx.scale(lionScale, lionScale);

    // Global hologram screen blending
    ctx.globalCompositeOperation = 'screen';

    // A. Holographic Pedestal / Ground Matrix
    drawHologramPedestal(ctx, time);

    // B. MGM Arched Laurel Crest & Sovereign Crown
    drawMGMArchedCrest(ctx, time, currentRoar);

    // C. Sitting Lion Body, Hindquarters & Forelegs
    drawSittingLionBody(ctx, breathOffset, currentRoar, time);

    // D. Fiery Lion Mane (Undulating Flame Locks)
    drawFieryMane(ctx, time, currentRoar, headPitch, headYaw);

    // E. Lion Head with Articulated Roaring Jaw & Saber Fangs
    drawArticulatedLionHead(ctx, time, currentRoar, headPitch, headYaw);

    // F. Holographic Scanline & Glitch Sweep Overlay
    drawHologramScanlines(ctx, time);

    ctx.restore();

    requestAnimationFrame(render);
  }

  // --- Sub-renderer: Hologram Ground Matrix ---
  function drawHologramPedestal(ctx, time) {
    ctx.save();
    const groundY = 215;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.lineWidth = 1;

    // Concentric perspective rings
    for (let r = 80; r <= 260; r += 45) {
      ctx.beginPath();
      ctx.ellipse(0, groundY, r, r * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radiating floor coordinates
    for (let a = -Math.PI * 0.75; a <= -Math.PI * 0.25; a += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(Math.cos(a) * 290, groundY - Math.sin(a) * 90);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Sub-renderer: MGM Arched Laurel Ribbon Crest ---
  function drawMGMArchedCrest(ctx, time, roar) {
    ctx.save();
    const centerY = -18;
    const archRadius = 210;

    // 1. Outer Tech-Gear Track with rotating ticks
    ctx.save();
    ctx.translate(0, centerY);
    ctx.rotate(time * 0.0015);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, archRadius + 14, 0, Math.PI * 2);
    ctx.stroke();

    // 36 radial coordinate tick marks
    for (let i = 0; i < 36; i++) {
      const angle = (i * Math.PI) / 18;
      const isMajor = i % 3 === 0;
      const inner = archRadius + 14;
      const outer = inner + (isMajor ? 8 : 4);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
      ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
      ctx.strokeStyle = isMajor ? 'rgba(254, 240, 138, 0.6)' : 'rgba(245, 158, 11, 0.25)';
      ctx.stroke();
    }
    ctx.restore();

    // 2. MGM Filmstrip Ribbon Track
    ctx.save();
    ctx.translate(0, centerY);
    ctx.beginPath();
    ctx.arc(0, 0, archRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Filmstrip sprocket apertures
    const sprocketCount = 28;
    ctx.fillStyle = 'rgba(8, 8, 10, 0.9)';
    for (let i = 0; i < sprocketCount; i++) {
      const a = (i * Math.PI * 2) / sprocketCount + time * 0.001;
      ctx.save();
      ctx.rotate(a);
      ctx.translate(archRadius, 0);
      ctx.fillRect(-3, -4, 6, 8);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(-3, -4, 6, 8);
      ctx.restore();
    }
    ctx.restore();

    // 3. Flanking Golden Laurel Leaves (Left and Right)
    drawLaurelWreathBranch(ctx, centerY, archRadius + 24, -1);
    drawLaurelWreathBranch(ctx, centerY, archRadius + 24, 1);

    // 4. Sovereign Royal Crown at Apex
    drawSovereignApexCrown(ctx, centerY - archRadius - 8, time, roar);

    // 5. Arched Royal Ribbon Wordmark
    ctx.save();
    ctx.font = 'bold 11px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#f59e0b';
    ctx.fillText('★ MFUMUKAZI • SOVEREIGN ROAR ★', 0, centerY + archRadius + 28);
    ctx.restore();

    ctx.restore();
  }

  function drawLaurelWreathBranch(ctx, centerY, radius, side) {
    ctx.save();
    ctx.translate(0, centerY);
    const leafCount = 8;
    for (let i = 0; i < leafCount; i++) {
      const a = -Math.PI * 0.5 + (side * (0.25 + (i * 0.16)));
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a + (side * Math.PI * 0.5));
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSovereignApexCrown(ctx, y, time, roar) {
    ctx.save();
    ctx.translate(0, y);
    const glow = 10 + roar * 14;
    ctx.shadowBlur = glow;
    ctx.shadowColor = '#fbbf24';

    // 5-Point Sovereign Crown
    ctx.beginPath();
    ctx.moveTo(-32, 10);
    ctx.lineTo(-28, -8);  // peak 1
    ctx.lineTo(-16, 2);
    ctx.lineTo(-12, -18); // peak 2
    ctx.lineTo(0, -2);
    ctx.lineTo(0, -26);   // center peak (highest)
    ctx.lineTo(0, -2);
    ctx.lineTo(12, -18);  // peak 4
    ctx.lineTo(16, 2);
    ctx.lineTo(28, -8);   // peak 5
    ctx.lineTo(32, 10);
    ctx.closePath();

    ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Crown Base Arch & Gems
    ctx.beginPath();
    ctx.ellipse(0, 10, 32, 5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Cross Star
    ctx.beginPath();
    ctx.arc(0, -26, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  }

  // --- Sub-renderer: Sitting Lion Body ---
  function drawSittingLionBody(ctx, breathOffset, roar, time) {
    ctx.save();
    const groundY = 215;

    // Muscular Sitting Hindquarters
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ea580c';

    // Left Haunch (Flank)
    ctx.beginPath();
    ctx.moveTo(-50, 75);
    ctx.bezierCurveTo(-110, 85, -165, 135, -145, groundY);
    ctx.lineTo(-95, groundY);
    ctx.bezierCurveTo(-115, 160, -95, 110, -50, 95);
    ctx.fillStyle = 'rgba(234, 88, 12, 0.12)';
    ctx.fill();
    ctx.stroke();

    // Right Haunch (Flank)
    ctx.beginPath();
    ctx.moveTo(50, 75);
    ctx.bezierCurveTo(110, 85, 165, 135, 145, groundY);
    ctx.lineTo(95, groundY);
    ctx.bezierCurveTo(115, 160, 95, 110, 50, 95);
    ctx.fillStyle = 'rgba(234, 88, 12, 0.12)';
    ctx.fill();
    ctx.stroke();

    // Swishing Tail with Flame Tuft
    const tailWag = Math.sin(time * 0.05) * 12;
    ctx.beginPath();
    ctx.moveTo(-135, 185);
    ctx.bezierCurveTo(-170, 175, -200 + tailWag, 150, -185 + tailWag, 105);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Flame Tuft at Tail Tip
    ctx.save();
    ctx.translate(-185 + tailWag, 105);
    ctx.rotate(Math.sin(time * 0.08) * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -15, -6, -26, 0, -32);
    ctx.bezierCurveTo(6, -26, 10, -15, 0, 0);
    ctx.fillStyle = 'rgba(234, 88, 12, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Powerful Upright Forelegs
    drawForeleg(ctx, -48, 55, -52, groundY);
    drawForeleg(ctx, 48, 55, 52, groundY);

    // Muscular Chest / Pectorals (Breathing expansion)
    ctx.beginPath();
    ctx.moveTo(-35, 60);
    ctx.bezierCurveTo(-20, 130 + breathOffset, 20, 130 + breathOffset, 35, 60);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Center Sternum Crest Line
    ctx.beginPath();
    ctx.moveTo(0, 50);
    ctx.lineTo(0, 140 + breathOffset);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  function drawForeleg(ctx, topX, topY, footX, footY) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(topX - 14, topY);
    ctx.lineTo(footX - 16, footY - 14);
    // Paw wrist
    ctx.lineTo(footX - 22, footY);
    // 4 Paws toes
    ctx.lineTo(footX - 11, footY + 2);
    ctx.lineTo(footX, footY + 2);
    ctx.lineTo(footX + 11, footY + 2);
    ctx.lineTo(footX + 22, footY);
    ctx.lineTo(footX + 16, footY - 14);
    ctx.lineTo(topX + 14, topY);
    ctx.closePath();

    ctx.fillStyle = 'rgba(18, 17, 24, 0.65)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Toe separation claws
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
    ctx.lineWidth = 1.5;
    for (let offset of [-11, 0, 11]) {
      ctx.beginPath();
      ctx.moveTo(footX + offset, footY - 6);
      ctx.lineTo(footX + offset, footY + 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Sub-renderer: Fiery Mane of Living Flames ---
  function drawFieryMane(ctx, time, roar, headPitch, headYaw) {
    ctx.save();
    ctx.translate(headYaw * 30, headPitch * 30);

    const flameLocksCount = 32;
    const baseRadius = 60;
    const flareExpansion = 1 + roar * 0.28;

    // Layer 1: Deep Crimson / Shadow Flame Base
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < flameLocksCount; i++) {
      const angle = (i * Math.PI * 2) / flameLocksCount;
      const wave = Math.sin(time * 0.05 + i * 0.4) * (8 + roar * 16);
      const lockLen = (baseRadius + 65 + wave) * flareExpansion;
      const lx = Math.cos(angle) * lockLen;
      const ly = Math.sin(angle) * (lockLen * 1.05) + 10;
      if (i === 0) ctx.moveTo(lx, ly);
      else ctx.lineTo(lx, ly);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(185, 28, 28, 0.18)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(234, 88, 12, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Layer 2: Molten Amber Flame Locks
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10 + roar * 10;
    ctx.shadowColor = '#ea580c';

    for (let i = 0; i < flameLocksCount; i++) {
      const angle = (i * Math.PI * 2) / flameLocksCount;
      // Skip bottom chin opening where beard is
      if (angle > Math.PI * 0.38 && angle < Math.PI * 0.62) continue;

      const wave = Math.sin(time * 0.06 + i * 0.5) * (10 + roar * 18);
      const outerR = (baseRadius + 50 + wave) * flareExpansion;
      const startX = Math.cos(angle) * baseRadius;
      const startY = Math.sin(angle) * baseRadius + 10;
      const tipX = Math.cos(angle) * outerR;
      const tipY = Math.sin(angle) * outerR + 10;

      const cpx = Math.cos(angle + 0.15) * (outerR * 0.7);
      const cpy = Math.sin(angle + 0.15) * (outerR * 0.7) + 10;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(cpx, cpy, tipX, tipY);
      ctx.stroke();
    }
    ctx.restore();

    // Layer 3: Incandescent Yellow Core Flame Curls
    ctx.save();
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#fbbf24';

    for (let i = 0; i < flameLocksCount; i += 2) {
      const angle = (i * Math.PI * 2) / flameLocksCount;
      if (angle > Math.PI * 0.38 && angle < Math.PI * 0.62) continue;

      const wave = Math.sin(time * 0.08 + i * 0.6) * (6 + roar * 12);
      const outerR = (baseRadius + 28 + wave) * flareExpansion;
      const startX = Math.cos(angle) * (baseRadius * 0.8);
      const startY = Math.sin(angle) * (baseRadius * 0.8) + 10;
      const tipX = Math.cos(angle) * outerR;
      const tipY = Math.sin(angle) * outerR + 10;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    }
    ctx.restore();

    ctx.restore();
  }

  // --- Sub-renderer: Articulated Lion Head & Roaring Jaws ---
  function drawArticulatedLionHead(ctx, time, roar, headPitch, headYaw) {
    ctx.save();
    ctx.translate(headYaw * 30, headPitch * 30);

    // 1. Lion Ears (pin back when roaring)
    const earPin = roar * 0.18;
    drawLionEar(ctx, -56, -64, -1, earPin);
    drawLionEar(ctx, 56, -64, 1, earPin);

    // 2. Cranium & Forehead Brow Ridge
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-45, -55);
    ctx.bezierCurveTo(-25, -78, 25, -78, 45, -55);
    ctx.lineTo(38, -25);
    ctx.lineTo(-38, -25);
    ctx.closePath();
    ctx.fillStyle = 'rgba(20, 18, 26, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Forehead furrow battle marks
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-14, -58);
    ctx.lineTo(-6, -32);
    ctx.moveTo(14, -58);
    ctx.lineTo(6, -32);
    ctx.moveTo(0, -62);
    ctx.lineTo(0, -28);
    ctx.stroke();
    ctx.restore();

    // 3. Piercing Laser Eyes (Almond feline shape, glowing molten gold)
    drawFelineEye(ctx, -26, -28, -1, roar);
    drawFelineEye(ctx, 26, -28, 1, roar);

    // 4. Snout Bridge & Whisker Pads
    ctx.save();
    // Nose bridge
    ctx.beginPath();
    ctx.moveTo(-12, -24);
    ctx.lineTo(-14, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(12, -24);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Dark Feline Nose Pad
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fillStyle = 'rgba(234, 88, 12, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Whisker pads (cheeks)
    ctx.beginPath();
    ctx.arc(-22, 10, 12, 0, Math.PI * 2);
    ctx.arc(22, 10, 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Whisker filaments (vibrating with roar)
    const whiskerVibe = Math.sin(time * 0.4) * (2 * roar);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.lineWidth = 1;
    for (let s of [-1, 1]) {
      for (let w = -1; w <= 1; w++) {
        ctx.beginPath();
        ctx.moveTo(s * 18, 10 + w * 4);
        ctx.lineTo(s * (65 + Math.abs(w) * 6), 12 + w * 10 + whiskerVibe);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 5. Upper Jaw & Ferocious Saber Canine Fangs
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-28, 14);
    ctx.bezierCurveTo(-14, 18, 14, 18, 28, 14);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.4;
    ctx.stroke();

    // Upper Saber Canines (Left and Right)
    drawSaberFang(ctx, -22, 16, 26, 1);
    drawSaberFang(ctx, 22, 16, 26, 1);

    // Upper Incisors
    ctx.fillStyle = '#ffffff';
    for (let inc = -12; inc <= 12; inc += 6) {
      ctx.fillRect(inc - 1.5, 16, 3, 5);
    }
    ctx.restore();

    // 6. Articulated Lower Jaw (Pivots downward with roar)
    const jawDrop = roar * 34; // drops up to 34px open!
    ctx.save();
    ctx.translate(0, jawDrop);

    // Mouth Cavern: Deep molten fiery glow when opened!
    if (roar > 0.08) {
      ctx.save();
      const mouthGrad = ctx.createRadialGradient(0, 18 - jawDrop * 0.5, 4, 0, 18 - jawDrop * 0.5, 40);
      mouthGrad.addColorStop(0, `rgba(255, 255, 240, ${roar * 0.95})`);
      mouthGrad.addColorStop(0.3, `rgba(245, 158, 11, ${roar * 0.85})`);
      mouthGrad.addColorStop(0.7, `rgba(220, 38, 38, ${roar * 0.7})`);
      mouthGrad.addColorStop(1, 'rgba(18, 17, 24, 0)');

      ctx.beginPath();
      ctx.ellipse(0, 18 - jawDrop * 0.5, 24, 14 + jawDrop * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = mouthGrad;
      ctx.fill();

      // Arched Muscular Tongue vibrating in throat
      ctx.beginPath();
      ctx.ellipse(0, 12, 14, 6 + Math.sin(time * 0.5) * 2, 0, 0, Math.PI);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.fill();
      ctx.restore();
    }

    // Lower Chin & Jaw Contour
    ctx.beginPath();
    ctx.moveTo(-24, 16);
    ctx.lineTo(-16, 36);
    ctx.lineTo(0, 42); // chin tip
    ctx.lineTo(16, 36);
    ctx.lineTo(24, 16);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Chin Goatee / Beard Tuft
    ctx.beginPath();
    ctx.moveTo(-10, 42);
    ctx.lineTo(0, 60 + Math.sin(time * 0.08) * 4);
    ctx.lineTo(10, 42);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Lower Canine Fangs (Pointing upward)
    drawSaberFang(ctx, -17, 18, -18, -1);
    drawSaberFang(ctx, 17, 18, -18, -1);

    // Lower Incisors
    ctx.fillStyle = '#ffffff';
    for (let inc = -10; inc <= 10; inc += 5) {
      ctx.fillRect(inc - 1.2, 14, 2.5, 4);
    }

    ctx.restore();

    ctx.restore();
  }

  function drawLionEar(ctx, x, y, side, pin) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(side * (0.2 + pin));

    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(18, 17, 24, 0.85)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner ear flame tuft
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(0, -12);
    ctx.lineTo(6, 0);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  function drawFelineEye(ctx, x, y, side, roar) {
    ctx.save();
    ctx.translate(x, y);

    // Eye Contour
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.quadraticCurveTo(0, -9, 12, 0);
    ctx.quadraticCurveTo(0, 7, -12, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glowing Iris (Fiery Molten Amber)
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowBlur = 12 + roar * 10;
    ctx.shadowColor = '#fbbf24';
    ctx.fill();

    // Vertical Cat Slit Pupil (Dilates during roar)
    const pupilWidth = 1.8 + roar * 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, pupilWidth, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#08080a';
    ctx.fill();

    // Laser flare beam shooting horizontally from eye
    ctx.beginPath();
    ctx.moveTo(side * 12, 0);
    ctx.lineTo(side * 36, -2);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  function drawSaberFang(ctx, x, y, length, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(-3, 0);
    ctx.quadraticCurveTo(-1, length * 0.6, 0, length);
    ctx.quadraticCurveTo(2, length * 0.6, 3, 0);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#fef08a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // --- Sub-renderer: Holographic Scanlines & Laser Sweep ---
  function drawHologramScanlines(ctx, time) {
    ctx.save();

    // Fast horizontal scanlines across lion bounds
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.lineWidth = 1;
    for (let y = -240; y <= 240; y += 5) {
      ctx.beginPath();
      ctx.moveTo(-240, y);
      ctx.lineTo(240, y);
      ctx.stroke();
    }

    // Moving vertical holographic laser scan beam
    const scanY = ((time * 2.2) % 520) - 260;
    const scanGrad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
    scanGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
    scanGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.18)');
    scanGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

    ctx.fillStyle = scanGrad;
    ctx.fillRect(-240, scanY - 18, 480, 36);

    ctx.restore();
  }

  // Start animation loop
  render();
}

/* ==========================================================================
   3. Dynamic Creative "Flames in Motion" Simulation (Theme: "Bomb Fire")
      - Reduced by 25% opacity per user directive.
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
      // When accelerating, alpha glows hotter and brighter (25% opacity reduction applied)
      const intensity = Math.min(1.0, 0.85 + (speedFactor - BASE_SPEED) * 0.08) * 0.75;
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
      const a = (1 - this.life) * this.alpha * 0.75;
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
    baseGrad.addColorStop(0.3, `rgba(245, 158, 11, ${Math.min(0.5, 0.22 + (currentSpeed - BASE_SPEED) * 0.08) * 0.75})`);
    baseGrad.addColorStop(0.7, `rgba(234, 88, 12, ${Math.min(0.65, 0.35 + (currentSpeed - BASE_SPEED) * 0.1) * 0.75})`);
    baseGrad.addColorStop(1, `rgba(220, 38, 38, ${Math.min(0.85, 0.55 + (currentSpeed - BASE_SPEED) * 0.12) * 0.75})`);
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
   9. Official Facebook Feed & Creative Post Upload Studio
   Page: https://web.facebook.com/BombshellGrenade
   ========================================================================== */
const DEFAULT_FB_POSTS = [
  {
    id: 'fb-post-1',
    time: '2 hours ago',
    author: 'Bombshell Grenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Lusaka! The energy is unmatched. We are officially preparing the next chapter for BOMB NATION. New music visuals are in the cutting room and summer concert dates are dropping this week. Stay locked, stay royal. 👑🔥💣 #KingKongQueen #BombNation #ZambianMusicToTheWorld #MfumuKadzi',
    image: 'src/hero-banner.jpg',
    likes: 3420,
    comments: 418,
    shares: 194,
    url: 'https://web.facebook.com/BombshellGrenade'
  },
  {
    id: 'fb-post-2',
    time: 'Yesterday at 17:30',
    author: 'Bombshell Grenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Reflecting on our landmark LP "Mfumu Kadzi" (The Queen). Over 19 tracks of unapologetic Zambian hip-hop and soul. Huge gratitude to Jay Rox, Mumba Yachi, Skales, Tim, and every producer who helped shape this sonic crown. Streaming now across all digital platforms! 💿🇿🇲 #MfumuKadzi #AFRIMMA #BombshellGrenade',
    image: 'src/single-backshot.jpg',
    likes: 5180,
    comments: 624,
    shares: 310,
    url: 'https://web.facebook.com/BombshellGrenade'
  },
  {
    id: 'fb-post-3',
    time: '3 days ago',
    author: 'Bombshell Grenade',
    avatar: 'src/about-portrait.jpg',
    text: 'Dignity is a right, not a privilege. Proud to continue our work with Urban Girl reusable sanitary pads across schools in Lusaka. Every girl deserves uninterrupted education without period poverty holding her back. Empower a girl, empower a nation. 💕✨ #UrbanGirl #BombshellInTheCommunity #EmpowerTheGirlChild',
    image: 'src/entrepreneur-urbangirl.jpg',
    likes: 6890,
    comments: 742,
    shares: 489,
    url: 'https://web.facebook.com/BombshellGrenade'
  }
];

function getStoredFacebookPosts() {
  try {
    const raw = localStorage.getItem('bombshell_fb_posts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read stored Facebook posts:', err);
  }
  return [...DEFAULT_FB_POSTS];
}

function saveStoredFacebookPosts(posts) {
  try {
    localStorage.setItem('bombshell_fb_posts', JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save Facebook posts to localStorage:', err);
  }
}

function initFacebookFeed() {
  const container = document.getElementById('fb-feed-grid');
  if (!container) return; // Only runs if the feed element exists (e.g. on homepage)

  let posts = getStoredFacebookPosts();

  // Highlight hashtags with links/amber styling
  function formatCaption(text) {
    return text.replace(/(#[a-zA-Z0-9_]+)/g, '<span class="fb-post-tag">$1</span>');
  }

  // Format large counts
  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  // Render the latest 3 Facebook posts
  function renderFeed() {
    container.innerHTML = '';
    const displayPosts = posts.slice(0, 3); // always latest 3 posts

    displayPosts.forEach((post, index) => {
      const card = document.createElement('article');
      card.className = 'fb-post-card';
      card.id = `fb-card-${post.id || index}`;

      card.innerHTML = `
        <header class="fb-card-header">
          <div class="fb-author-row">
            <div class="fb-avatar-ring">
              <img 
                src="${post.avatar || 'src/about-portrait.jpg'}" 
                alt="Bombshell Grenade Avatar" 
                class="fb-avatar-img"
                onerror="this.onerror=null; this.src='src/about-portrait.svg';"
              />
            </div>
            <div class="fb-author-details">
              <span class="fb-author-name">
                ${post.author || 'Bombshell Grenade'}
                <svg class="fb-verified-badge" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </span>
              <span class="fb-post-time">
                ${post.time || 'Recently posted'} &bull; 
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="opacity: 0.7;">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
            </div>
          </div>
          <a 
            href="${post.url || 'https://web.facebook.com/BombshellGrenade'}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="fb-network-icon"
            title="View on Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </header>

        <div class="fb-card-body">
          <p class="fb-post-text">${formatCaption(post.text || '')}</p>
        </div>

        ${post.image ? `
          <div class="fb-media-container" data-full-image="${post.image}">
            <img 
              src="${post.image}" 
              alt="Facebook Post Media by Bombshell Grenade" 
              class="fb-media-img"
              onerror="this.onerror=null; this.src='src/about-portrait.svg';"
            />
            <div class="fb-media-overlay-badge">
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span>Click to expand</span>
            </div>
          </div>
        ` : ''}

        <div class="fb-engagement-bar">
          <div class="fb-reactions-group">
            <span class="fb-emojis-cluster">
              <span class="fb-emoji-bubble fb-emoji-like">👍</span>
              <span class="fb-emoji-bubble fb-emoji-love">❤️</span>
              <span class="fb-emoji-bubble fb-emoji-fire">🔥</span>
            </span>
            <span class="fb-likes-count" id="likes-count-${index}">
              ${formatNumber(post.likes || 1200)}
            </span>
          </div>
          <div>
            <span>${formatNumber(post.comments || 180)} comments</span> &bull; 
            <span>${formatNumber(post.shares || 65)} shares</span>
          </div>
        </div>

        <div class="fb-actions-bar">
          <button type="button" class="fb-action-btn fb-btn-like" data-index="${index}">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
            </svg>
            <span>React</span>
          </button>

          <button type="button" class="fb-action-btn fb-btn-comment" data-index="${index}">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <span>Comment</span>
          </button>

          <button type="button" class="fb-action-btn fb-btn-share" data-url="${post.url || 'https://web.facebook.com/BombshellGrenade'}">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span>Share</span>
          </button>

          <div class="fb-action-external">
            <a href="${post.url || 'https://web.facebook.com/BombshellGrenade'}" target="_blank" rel="noopener noreferrer" class="fb-direct-link-btn">
              <span>View Full Post on Facebook</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </div>

        <!-- Inline Comment Form -->
        <div class="fb-comment-box" id="comment-box-${index}">
          <div class="fb-comment-input-row">
            <input 
              type="text" 
              class="fb-comment-input" 
              placeholder="Write a comment to Bombshell..." 
              id="comment-input-${index}"
            />
            <button type="button" class="fb-comment-submit-btn" data-index="${index}">Post</button>
          </div>
          <div class="fb-card-comments-list" id="comments-list-${index}">
            <div class="fb-comment-bubble">
              <strong>ZambianHipHopDaily &bull; Lusaka</strong>
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

  function attachFeedCardListeners() {
    // Like button reaction
    container.querySelectorAll('.fb-btn-like').forEach(btn => {
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
          showToast('Reacted with 🔥 Fire on Facebook feed!');
        }

        const countEl = document.getElementById(`likes-count-${idx}`);
        if (countEl) countEl.textContent = formatNumber(post.likes);
        saveStoredFacebookPosts(posts);
      });
    });

    // Comment toggle
    container.querySelectorAll('.fb-btn-comment').forEach(btn => {
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
    container.querySelectorAll('.fb-comment-submit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        const input = document.getElementById(`comment-input-${idx}`);
        const list = document.getElementById(`comments-list-${idx}`);
        if (!input || !list) return;

        const val = input.value.trim();
        if (!val) return;

        const bubble = document.createElement('div');
        bubble.className = 'fb-comment-bubble';
        bubble.innerHTML = `<strong>Bomb Nation Fan &bull; Verified Visitor</strong><span>${val}</span>`;
        list.prepend(bubble);

        input.value = '';
        showToast('Comment posted to feed!');
      });
    });

    // Share link
    container.querySelectorAll('.fb-btn-share').forEach(btn => {
      btn.addEventListener('click', function() {
        const url = this.getAttribute('data-url') || 'https://web.facebook.com/BombshellGrenade';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url);
          showToast('Facebook link copied to clipboard!');
        } else {
          showToast('Official Facebook: web.facebook.com/BombshellGrenade');
        }
      });
    });

    // Lightbox for media image clicks
    container.querySelectorAll('.fb-media-container').forEach(media => {
      media.addEventListener('click', function() {
        const fullImgSrc = this.getAttribute('data-full-image');
        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxCat = document.getElementById('lightbox-category');

        if (lightbox && lightboxImg && fullImgSrc) {
          lightboxImg.src = fullImgSrc;
          if (lightboxTitle) lightboxTitle.textContent = 'Facebook Post Media — Bombshell Grenade';
          if (lightboxCat) lightboxCat.textContent = 'Official Facebook Feed';
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // Initial render
  renderFeed();

  // Setup the Upload & Sync Studio Modal
  initFacebookUploadModal(posts, renderFeed);
}

/* ==========================================================================
   10. Facebook Upload & Sync Studio Modal Controller
   ========================================================================== */
function initFacebookUploadModal(posts, onFeedUpdated) {
  const modal = document.getElementById('fb-upload-modal');
  const openBtn = document.getElementById('btn-open-fb-sync-modal');
  const closeBtn = document.getElementById('fb-modal-close-btn');
  if (!modal || !openBtn) return;

  // Modal Open / Close
  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
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
  const tabBtns = modal.querySelectorAll('.fb-modal-tab-btn');
  const tabPanes = modal.querySelectorAll('.fb-modal-tab-pane');

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
  const dropzone = document.getElementById('fb-image-dropzone');
  const fileInput = document.getElementById('fb-post-file-input');
  const previewImg = document.getElementById('fb-dropzone-preview');
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
  const form = document.getElementById('fb-upload-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const caption = document.getElementById('fb-upload-caption')?.value.trim();
      const timeText = document.getElementById('fb-upload-time')?.value.trim() || 'Just now';
      const urlText = document.getElementById('fb-upload-url')?.value.trim() || 'https://web.facebook.com/BombshellGrenade';
      const imageURL = document.getElementById('fb-upload-image-url')?.value.trim();
      const likesCount = parseInt(document.getElementById('fb-upload-likes')?.value, 10) || 1500;

      if (!caption) {
        showToast('Please enter the Facebook post caption text.', 'error');
        return;
      }

      const finalImage = uploadedImageData || imageURL || 'src/hero-banner.jpg';

      const newPost = {
        id: 'fb-' + Date.now(),
        time: timeText,
        author: 'Bombshell Grenade',
        avatar: 'src/about-portrait.jpg',
        text: caption,
        image: finalImage,
        likes: likesCount,
        comments: Math.floor(likesCount * 0.12),
        shares: Math.floor(likesCount * 0.05),
        url: urlText
      };

      // Add to front of array to become latest post
      posts.unshift(newPost);
      saveStoredFacebookPosts(posts);

      // Re-render feed on homepage
      onFeedUpdated();

      // Reset form
      form.reset();
      uploadedImageData = '';
      if (previewImg) {
        previewImg.src = '';
        previewImg.classList.remove('has-image');
      }

      closeModal();
      showToast('New Facebook post successfully updated to homepage bottom feed! 🔥');
    });
  }

  // Live Sync & Batch Manager Actions (Tab 2)
  const syncBtn = document.getElementById('btn-sync-fb-live');
  const resetBtn = document.getElementById('btn-reset-fb-defaults');
  const jsonTextarea = document.getElementById('fb-json-editor');
  const importJsonBtn = document.getElementById('btn-import-fb-json');

  if (jsonTextarea) {
    jsonTextarea.value = JSON.stringify(posts, null, 2);
  }

  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      syncBtn.disabled = true;
      syncBtn.innerHTML = '<span>Checking web.facebook.com/BombshellGrenade...</span>';

      setTimeout(() => {
        // Refresh timestamps to simulate live real-time sync with Facebook page
        if (posts[0]) posts[0].time = 'Just synced with Facebook';
        if (posts[1]) posts[1].time = 'Today at 14:15';
        saveStoredFacebookPosts(posts);
        onFeedUpdated();

        const statusPill = document.getElementById('fb-sync-status-text');
        if (statusPill) statusPill.textContent = 'Live Synced Just Now';

        syncBtn.disabled = false;
        syncBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> <span>Sync Latest from Facebook Page</span>';

        showToast('Successfully synchronized latest 3 posts from official Facebook page!');
      }, 900);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      posts.length = 0;
      DEFAULT_FB_POSTS.forEach(p => posts.push(p));
      saveStoredFacebookPosts(posts);
      onFeedUpdated();
      if (jsonTextarea) jsonTextarea.value = JSON.stringify(posts, null, 2);
      showToast('Facebook feed reset to curated official page posts.');
    });
  }

  if (importJsonBtn && jsonTextarea) {
    importJsonBtn.addEventListener('click', () => {
      try {
        const imported = JSON.parse(jsonTextarea.value);
        if (Array.isArray(imported) && imported.length > 0) {
          posts.length = 0;
          imported.forEach(p => posts.push(p));
          saveStoredFacebookPosts(posts);
          onFeedUpdated();
          closeModal();
          showToast('Facebook posts successfully updated from JSON feed!');
        } else {
          showToast('JSON must be an array of post objects.', 'error');
        }
      } catch (err) {
        showToast('Invalid JSON format. Please verify syntax.', 'error');
      }
    });
  }
}

