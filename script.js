const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer:fine)").matches;

/* ============ LOADER ============ */
const bar = document.getElementById("loaderBar");
const loader = document.getElementById("loader");

function finishLoader() {
  if (!loader) return;
  loader.classList.add("hidden");
  document.body.classList.add("is-loaded");
}

if (bar && loader) {
  let prog = 0;

  if (reduceMotion) {
    bar.style.width = "100%";
    finishLoader();
  } else {
    const fill = setInterval(() => {
      prog += prog < 72 ? 8 : prog < 92 ? 3.5 : 1.2;

      if (prog >= 100) {
        prog = 100;
        clearInterval(fill);
      }

      bar.style.width = `${prog}%`;

      if (prog >= 100) {
        setTimeout(finishLoader, 260);
      }
    }, 55);

    window.addEventListener("load", () => {
      prog = Math.max(prog, 92);
      bar.style.width = `${prog}%`;

      setTimeout(() => {
        bar.style.width = "100%";
        finishLoader();
      }, 300);
    }, { once: true });

    setTimeout(() => {
      finishLoader();
    }, 4000);
  }
} else {
  document.body.classList.add("is-loaded");
}

/* ============ CURSOR ============ */
const dot = document.getElementById("cur-dot");
const ring = document.getElementById("cur-ring");
const label = document.getElementById("cur-label");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;
let rx = mx;
let ry = my;

if (isFinePointer && !reduceMotion && dot && ring && label) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener("mouseleave", () => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    label.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  });

  (function tickCursor() {
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;

    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;

    label.style.left = `${mx}px`;
    label.style.top = `${my}px`;

    requestAnimationFrame(tickCursor);
  })();

  document.querySelectorAll("[data-work]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering-work");
      label.textContent = "View";
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering-work");
      if (!document.body.classList.contains("hovering-hero-text")) {
        label.textContent = "View";
      }
    });
  });

  document.querySelectorAll("a,button").forEach((el) => {
    if (
      !el.hasAttribute("data-work") &&
      !el.classList.contains("top-text") &&
      !el.classList.contains("bottom-text")
    ) {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering-link");
      });

      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering-link");
      });
    }
  });

  document.querySelectorAll(".top-text, .bottom-text").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering-hero-text");
      document.body.classList.remove("hovering-link");
      label.textContent = "↗";
    });

    item.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering-hero-text");
      label.textContent = "View";
    });
  });
}

/* ============ HEADER SCROLL ============ */
const header = document.getElementById("header");

if (header) {
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

/* ============ HAMBURGER / MENU ============ */
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("menuOverlay");

function closeMenu() {
  if (overlay) overlay.classList.remove("open");
  if (hamburger) hamburger.classList.remove("open");
  document.body.classList.remove("menu-open");
}

window.closeMenu = closeMenu;

if (hamburger && overlay) {
  hamburger.addEventListener("click", () => {
    const open = overlay.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  });
}

/* ============ SMOOTH SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const target = document.getElementById(id);

    if (target) {
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ============ HERO PHOTO PARALLAX ============ */
const heroPhoto = document.querySelector(".hero-center-photo");

function updateHeroParallax() {
  if (reduceMotion || !heroPhoto) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    const offset = y * 0.08;
    heroPhoto.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
  }
}

if (heroPhoto) {
  window.addEventListener("scroll", updateHeroParallax, { passive: true });
  updateHeroParallax();
}

/* ============ MAGNETIC BUTTONS ============ */
if (isFinePointer && !reduceMotion) {
  document.querySelectorAll(".btn,.btn-dark,.btn-outline,.btn-ghost,.btn-black").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.14}px, ${dy * 0.18}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ============ SCROLL REVEAL ============ */
const revealEls = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");

if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("up");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach((el) => io.observe(el));
}

/* ============ WORK ITEMS REVEAL ============ */
const workItems = document.querySelectorAll(".work-item");

if (workItems.length) {
  const wio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("up");
        wio.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  workItems.forEach((el) => wio.observe(el));
}

/* ============ SPLIT TEXT ============ */
function splitNodeContent(node, delayState) {
  if (node.nodeType === Node.TEXT_NODE) {
    const words = node.textContent.split(/(\s+)/).filter((part) => part.length);
    return words.map((part) => {
      if (/^\s+$/.test(part)) return part;
      const delay = delayState.value * 0.045;
      delayState.value += 1;
      return `<span class="split-word" style="transition-delay:${delay}s">${part}</span>`;
    }).join("");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  if (node.tagName === "BR") return "</span><span class=\"split-line\">";

  const inner = Array.from(node.childNodes)
    .map((child) => splitNodeContent(child, delayState))
    .join("");

  return `<${node.tagName.toLowerCase()}>${inner}</${node.tagName.toLowerCase()}>`;
}

document.querySelectorAll(".section-h2, .about-h2, .contact-h2").forEach((h) => {
  if (h.classList.contains("split-done")) return;
  const delayState = { value: 0 };
  const inner = Array.from(h.childNodes).map((node) => splitNodeContent(node, delayState)).join("");
  h.innerHTML = `<span class="split-line">${inner}</span>`;
  h.classList.add("split-done");
});

/* ============ MARQUEE ============ */
const mt = document.getElementById("marqueeTrack");
if (mt) {
  mt.addEventListener("mouseenter", () => {
    mt.style.animationPlayState = "paused";
  });

  mt.addEventListener("mouseleave", () => {
    mt.style.animationPlayState = "running";
  });
}

/* ============ SCROLL PROGRESS ============ */
const progressLine = document.createElement("div");
progressLine.style.cssText =
  "position:fixed;top:0;left:0;height:2px;background:var(--yellow);z-index:9998;width:0;pointer-events:none;transition:width 0.1s";
document.body.appendChild(progressLine);

window.addEventListener("scroll", () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressLine.style.width = `${pct}%`;
}, { passive: true });
