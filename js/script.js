/* ============================================================
   script.js — Birthday Website for Silvia Zahrotul Jannah
   Author  : Dibuat dengan ❤️
   Optimized for Mobile, Autoplay, and GitHub Pages
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. AUDIO & AUTOPLAY CONTROLLER
     - Mencoba autoplay langsung saat halaman dimuat
     - Jika browser memblokir (aturan autoplay mobile),
       tombol splash screen / interaksi pertama akan langsung memutar lagu!
  ============================================================ */
  const audio = document.getElementById('bg-audio');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = musicBtn ? musicBtn.querySelector('.music-icon') : null;
  const splash = document.getElementById('splash');
  const splashBtn = document.getElementById('splash-btn');

  function updateMusicUI(isPlaying) {
    if (!musicBtn) return;
    if (isPlaying) {
      musicBtn.classList.add('playing');
      if (musicIcon) musicIcon.textContent = '⏸';
      musicBtn.setAttribute('aria-label', 'Jeda Musik');
    } else {
      musicBtn.classList.remove('playing');
      if (musicIcon) musicIcon.textContent = '🎵';
      musicBtn.setAttribute('aria-label', 'Putar Musik');
    }
  }

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      updateMusicUI(true);
    }).catch((err) => {
      console.log('Autoplay ditahan oleh browser sampai ada interaksi:', err);
    });
  }

  function pauseAudio() {
    if (!audio) return;
    audio.pause();
    updateMusicUI(false);
  }

  // 1A. Coba autoplay langsung saat website pertama kali dibuka
  playAudio();

  // 1B. Splash Screen Handler: Sentuh tombol buka kado -> lagu langsung jalan
  if (splash) {
    const handleSplashOpen = (e) => {
      if (e) e.stopPropagation();
      playAudio();
      launchConfetti();
      launchBalloons();

      splash.classList.add('hidden');
      setTimeout(() => {
        splash.style.display = 'none';
      }, 600);
    };

    if (splashBtn) {
      splashBtn.addEventListener('click', handleSplashOpen);
    }
    // Jika user mengklik area splash selain tombol, tetap buka
    splash.addEventListener('click', (e) => {
      if (e.target === splash || e.target.classList.contains('splash-card')) {
        handleSplashOpen(e);
      }
    });
  }

  // 1C. Fallback Autoplay: Interaksi pertama apapun di layar langsung memutar lagu
  const unlockAudioOnTouch = () => {
    if (audio && audio.paused) {
      playAudio();
    }
    window.removeEventListener('click', unlockAudioOnTouch);
    window.removeEventListener('touchstart', unlockAudioOnTouch);
  };
  window.addEventListener('click', unlockAudioOnTouch, { passive: true });
  window.addEventListener('touchstart', unlockAudioOnTouch, { passive: true });

  // 1D. Floating Music Button Toggle
  if (musicBtn && audio) {
    musicBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (audio.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    });
  }

  /* ============================================================
     2. FADE-IN PADA SCROLL (IntersectionObserver)
  ============================================================ */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ============================================================
     3. SCROLL PROGRESS BAR
  ============================================================ */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }, { passive: true });
  }

  /* ============================================================
     4. FLOATING PETALS DI HERO (Warna Pink Vibrant)
  ============================================================ */
  const hero = document.getElementById('hero');
  const petalColors = ['#ff2a70', '#ff5e97', '#ff85b3', '#ffd4e3', '#ffc6dc', '#ffd700'];

  if (hero) {
    for (let i = 0; i < 20; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';

      const size = Math.random() * 12 + 8;
      petal.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size * 1.3}px;
        background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
        animation-duration: ${5 + Math.random() * 7}s;
        animation-delay: ${Math.random() * 5}s;
      `;
      hero.appendChild(petal);
    }
  }

  /* ============================================================
     5. CONFETTI ENGINE (Vibrant Pink & Gold)
  ============================================================ */
  const canvas = document.getElementById('confetti-canvas');
  let ctx = canvas ? canvas.getContext('2d') : null;
  let pieces = [];
  let animId = null;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  function Confetto() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.w = Math.random() * 12 + 6;
    this.h = Math.random() * 7 + 4;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.vy = Math.random() * 3.5 + 2.5;
    this.vx = (Math.random() - 0.5) * 3;
    this.angle = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 8;
  }

  Confetto.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  };

  window.launchConfetti = function () {
    if (!canvas || !ctx) return;
    canvas.style.display = 'block';

    for (let i = 0; i < 180; i++) {
      setTimeout(() => pieces.push(new Confetto()), i * 12);
    }

    if (animId) cancelAnimationFrame(animId);
    animateConfetti();

    setTimeout(() => {
      cancelAnimationFrame(animId);
      canvas.style.display = 'none';
      pieces = [];
    }, 5500);
  };

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.vy *= 1.002;
      p.draw();
    });

    pieces = pieces.filter(p => p.y < canvas.height + 30);
    animId = requestAnimationFrame(animateConfetti);
  }

  /* ============================================================
     6. BALLOON LAUNCH
  ============================================================ */
  const balloonEmojis = ['🎈', '🎀', '🌸', '💖', '💕', '🌷', '✨', '💐'];

  window.launchBalloons = function () {
    for (let i = 0; i < 14; i++) {
      setTimeout(() => {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
        balloon.style.left = Math.random() * 90 + 'vw';
        balloon.style.fontSize = (34 + Math.random() * 26) + 'px';

        const duration = 3.5 + Math.random() * 2.5;
        balloon.style.animationDuration = duration + 's';

        document.body.appendChild(balloon);
        setTimeout(() => balloon.remove(), duration * 1000 + 200);
      }, i * 180);
    }
  };

  /* ============================================================
     7. HERO GIFT BOX CLICK
  ============================================================ */
  const giftWrap = document.getElementById('gift-wrap');
  if (giftWrap) {
    function triggerSurprise() {
      giftWrap.style.pointerEvents = 'none';

      // Pastikan audio berputar
      playAudio();

      const giftIcon = giftWrap.querySelector('.gift-icon');
      if (giftIcon) giftIcon.textContent = '🎊';

      launchConfetti();
      launchBalloons();

      // Halus scroll ke ucapan
      setTimeout(() => {
        const greetingEl = document.getElementById('greeting');
        if (greetingEl) {
          greetingEl.scrollIntoView({ behavior: 'smooth' });
        }
        giftWrap.style.pointerEvents = '';
      }, 1500);
    }

    giftWrap.addEventListener('click', triggerSurprise);
    giftWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSurprise();
      }
    });
  }

  /* ============================================================
     8. SURAT KHUSUS (TYPEWRITER EFFECT)
  ============================================================ */
  const letterText = `Hai, Silvia Zahrotul Jannah... 🌸

Selamat ulang tahun ya! 🎂✨

Hari ini adalah hari yang sangat istimewa, hari di mana seseorang yang begitu berharga dan luar biasa hadir ke dunia.

Terima kasih sudah menjadi sosok yang selalu membawa kehangatan, tawa, dan kebahagiaan. Caramu tersenyum dan kebaikan hatimu selalu punya cara tersendiri untuk membuat hari-hari terasa jauh lebih bermakna.

Di usiamu yang baru ini, aku berdoa setulus hati:
Semoga langkahmu selalu dimudahkan, setiap impian dan cita-citamu dikabulkan, selalu diberikan kesehatan, dan dikelilingi oleh orang-orang yang tulus menyayangimu.

Kamu pantas mendapatkan semua kebahagiaan dan hal-hal terindah di dunia ini. Jangan pernah lelah ya sayanggg! 💕

Selamat ulang tahun, Sayang!🌸✨`;

  const typedEl = document.getElementById('typed-text');
  const cursorEl = document.createElement('span');
  cursorEl.className = 'cursor';

  let charIndex = 0;
  let typingStarted = false;

  function typeChar() {
    if (!typedEl) return;
    if (charIndex < letterText.length) {
      typedEl.textContent = letterText.slice(0, charIndex + 1);
      typedEl.appendChild(cursorEl);
      charIndex++;

      const ch = letterText[charIndex - 1];
      const delay = ch === '\n'
        ? 320
        : (ch === ',' || ch === '.' || ch === '!' || ch === ':')
          ? 160
          : 38 + Math.random() * 24;

      setTimeout(typeChar, delay);
    } else {
      typedEl.appendChild(cursorEl);
    }
  }

  // Mulai mengetik hanya saat section surat masuk ke layar
  const letterSection = document.getElementById('letter');
  if (letterSection) {
    const letterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !typingStarted) {
        typingStarted = true;
        typeChar();
        letterObserver.unobserve(letterSection);
      }
    }, { threshold: 0.15 });

    letterObserver.observe(letterSection);
  }

});
