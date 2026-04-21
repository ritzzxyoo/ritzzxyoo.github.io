/* =========================================================
   Ritika's Portfolio — interactivity
   - sticky nav with glowing active link (scroll-spy)
   - smooth scroll + mobile menu toggle
   - reveal-on-scroll animations
   - animated number counters
   - particle/star canvas background
   - cursor glow follow
   ========================================================= */

(function () {
  "use strict";

  // ---------- Year in footer ----------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Navbar scroll background ----------
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav toggle ----------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  // ---------- Scroll-spy for active nav link ----------
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const linkMap = new Map();
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) linkMap.set(href.slice(1), link);
  });

  const spy = () => {
    const offset = 120;
    let currentId = sections[0]?.id;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top;
      if (top - offset <= 0) currentId = sec.id;
    }
    linkMap.forEach((link, id) => {
      if (id === currentId) link.classList.add("active");
      else link.classList.remove("active");
    });
  };
  document.addEventListener("scroll", spy, { passive: true });
  spy();

  // ---------- Reveal on scroll ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll(".counter-number");
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || "0", 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCounter(e.target);
            cIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cIo.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  // ---------- Cursor glow ----------
  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let gx = mx;
    let gy = my;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const renderCursor = () => {
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover state on interactive elements
    const hoverables = "a, button, .chip, .project-card, .counter-card, .skill-category, .cert-card, .lead-card, .social-btn, .timeline-card";
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener("mouseenter", () => glow.classList.add("hover"));
      el.addEventListener("mouseleave", () => glow.classList.remove("hover"));
    });
  } else if (glow) {
    glow.style.display = "none";
  }

  // ---------- Particle background ----------
  const canvas = document.getElementById("particles");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const setSize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const colors = ["#4cc9ff", "#b66bff", "#ff8fd1", "#62f2ff"];
    const isMobile = w < 720;
    const COUNT = isMobile ? 50 : 110;

    const rand = (a, b) => a + Math.random() * (b - a);

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6, 2.2),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      color: colors[(Math.random() * colors.length) | 0],
      tw: Math.random() * Math.PI * 2, // twinkle phase
    }));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // links between close particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(120, 160, 255, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.04 + p.tw);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.55 * twinkle;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    };
    draw();
  }
})();
