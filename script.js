(function () {
  'use strict';

  const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let mouseX = 0, mouseY = 0;

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  const cursorLabel = document.getElementById('cursorLabel');

  if (isFine && cursor && follower) {
    document.body.classList.add('has-cursor');
    let fx = 0, fy = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function tickCursor() {
      fx += (mouseX - fx) * 0.12;
      fy += (mouseY - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(tickCursor);
    }
    tickCursor();

    // Hover state for links/buttons
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('is-hover'));
    });

    // Label state for project cards and footer
    document.querySelectorAll('[data-cursor-label]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        follower.classList.add('is-label');
        cursorLabel.textContent = el.dataset.cursorLabel;
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('is-label');
        cursorLabel.textContent = '';
      });
    });
  }

  // ==========================================
  // GSAP + SCROLLTRIGGER
  // ==========================================
  window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ---------- HERO ----------
    // Title reveal
    gsap.to('.hero-title .title-word', {
      y: '0%', duration: 1.4, delay: 0.3, ease: 'power4.out'
    });

    // Subtitle reveal
    gsap.to('.hero-subtitle .subtitle-word', {
      y: '0%', duration: 1, delay: 0.8, ease: 'power3.out'
    });

    // Meta fade
    gsap.from('.hero-meta', { opacity: 0, y: 20, duration: 0.8, delay: 1.2, ease: 'power2.out' });

    // Ken Burns — hero image slowly scales down as you scroll
    gsap.to('.hero-img', {
      scale: 1.0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Hero parallax — content moves up faster
    gsap.to('.hero-content', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // ---------- PHILOSOPHY ----------
    // Text reveals
    document.querySelectorAll('.philosophy .word').forEach((w) => {
      gsap.to(w, {
        y: '0%', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: w.closest('.line'), start: 'top 88%' }
      });
    });

    gsap.utils.toArray('.philosophy-body').forEach((p) => {
      gsap.from(p, {
        opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: p, start: 'top 88%' }
      });
    });

    gsap.from('.section-label', {
      opacity: 0, y: 15, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.philosophy', start: 'top 80%' }
    });

    // Parallax images at different speeds
    document.querySelectorAll('.phi-img').forEach((img) => {
      const speed = parseFloat(img.dataset.speed) || 1;
      gsap.to(img, {
        y: (1 - speed) * -120,
        ease: 'none',
        scrollTrigger: {
          trigger: '.philosophy',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });

      // Ken Burns on philosophy images
      gsap.to(img.querySelector('img'), {
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        }
      });
    });

    // Stats
    gsap.from('.stat', {
      opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '.philosophy-stats', start: 'top 85%' }
    });

    // Count-up
    document.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseInt(el.dataset.count);
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const dur = 1400, st = performance.now();
          function tick(now) {
            const p = Math.min((now - st) / dur, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    });

    // ---------- HORIZONTAL GALLERY (the signature move) ----------
    const track = document.getElementById('galleryTrack');
    if (track) {
      const cards = track.querySelectorAll('.project-card');
      const totalScrollWidth = track.scrollWidth - window.innerWidth;

      // Gallery heading reveal
      document.querySelectorAll('.gallery-heading .word').forEach((w) => {
        gsap.to(w, {
          y: '0%', duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: '.gallery-header', start: 'top 85%' }
        });
      });

      // The pin + horizontal scroll
      gsap.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery-pin-wrapper',
          start: 'top top',
          end: () => '+=' + totalScrollWidth,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // Ken Burns on each project image
      cards.forEach((card) => {
        gsap.to(card.querySelector('.project-img-wrap img'), {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.gallery-pin-wrapper',
            start: 'top top',
            end: () => '+=' + totalScrollWidth,
            scrub: 2
          }
        });
      });
    }

    // ---------- SERVICES ----------
    gsap.from('.service-item', {
      opacity: 0, y: 40, duration: 0.6, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: '.services-grid', start: 'top 85%' }
    });

    // ---------- GENERIC FADE-UP (works on all pages) ----------
    document.querySelectorAll('.fade-up').forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // ---------- GENERIC WORD REVEALS (all pages) ----------
    document.querySelectorAll('.line .word').forEach((w) => {
      // Skip hero words (handled separately with delays)
      if (w.closest('.hero-title') || w.closest('.hero-subtitle') || w.closest('.about-hero-title')) return;
      if (w.closest('.philosophy-heading') && document.querySelector('.philosophy')) return; // handled above
      gsap.to(w, {
        y: '0%', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: w.closest('.line'), start: 'top 88%' }
      });
    });

    // ---------- ABOUT PAGE HERO ----------
    if (document.querySelector('.about-hero-title')) {
      document.querySelectorAll('.about-hero-title .word').forEach((w, i) => {
        gsap.to(w, { y: '0%', duration: 1.4, delay: 0.3 + i * 0.15, ease: 'power4.out' });
      });

      gsap.from('.about-hero-meta', { opacity: 0, y: 15, duration: 0.8, delay: 0.9, ease: 'power2.out' });

      // Portraits entrance
      gsap.from('.portrait--a', { opacity: 0, y: 60, duration: 1, delay: 0.6, ease: 'power3.out' });
      gsap.from('.portrait--b', { opacity: 0, y: 40, duration: 1, delay: 0.8, ease: 'power3.out' });

      // Ken Burns on about hero
      gsap.to('.about-hero-img-wrap img', {
        scale: 1.0, ease: 'none',
        scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
      });
    }

    // ---------- ABOUT REASONS IMAGE ----------
    if (document.querySelector('.reasons-image img')) {
      gsap.to('.reasons-image img', {
        scale: 1.0, ease: 'none',
        scrollTrigger: { trigger: '.reasons-image', start: 'top bottom', end: 'bottom top', scrub: 2 }
      });
    }

    // ---------- TEAM CARDS ----------
    if (document.querySelector('.team-grid')) {
      gsap.from('.team-card', {
        opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.team-grid', start: 'top 85%' }
      });
    }

    // ---------- AWARD ITEMS ----------
    if (document.querySelector('.awards-list')) {
      gsap.from('.award-item', {
        opacity: 0, y: 30, duration: 0.5, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: '.awards-list', start: 'top 85%' }
      });
    }

    // ---------- FOOTER ----------
    document.querySelectorAll('.footer-title .word').forEach((w) => {
      gsap.to(w, {
        y: '0%', duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.footer-cta', start: 'top 85%' }
      });
    });

    gsap.from('.footer-email', {
      opacity: 0, y: 20, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.footer-email', start: 'top 90%' }
    });

  }); // end load

  // ==========================================
  // MAGNETIC FOOTER TITLE
  // ==========================================
  const footerTitle = document.getElementById('footerTitle');
  if (isFine && footerTitle) {
    footerTitle.addEventListener('mousemove', (e) => {
      const rect = footerTitle.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.06;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.06;
      footerTitle.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    footerTitle.addEventListener('mouseleave', () => {
      footerTitle.style.transform = 'translate(0, 0)';
      footerTitle.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { footerTitle.style.transition = ''; }, 500);
    });
  }

})();
