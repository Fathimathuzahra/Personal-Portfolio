const root = document.documentElement;
const header = document.getElementById("siteHeader");
const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const pageLoader = document.getElementById("pageLoader");
const backToTop = document.getElementById("backToTop");
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function setTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.innerHTML = isDark
    ? '<i class="fa-regular fa-sun"></i>'
    : '<i class="fa-regular fa-moon"></i>';
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  try {
    localStorage.setItem("fz-portfolio-theme", theme);
  } catch (error) {
    return;
  }
}

let preferredTheme = "light";
try {
  preferredTheme = localStorage.getItem("fz-portfolio-theme") || "light";
} catch (error) {
  preferredTheme = "light";
}
setTheme(preferredTheme);

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) {
    closeMenu();
  }
});

function updateScrollUI() {
  const scrolled = window.scrollY > 18;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("show", window.scrollY > 500);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("load", () => {
  window.setTimeout(() => pageLoader.classList.add("hidden"), 250);
});

window.setTimeout(() => {
  pageLoader.classList.add("hidden");
}, 1800);

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isActive);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

  sections.forEach((section) => activeSectionObserver.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", targetId);
    }
  });
});
/* ==========================================
   PROFESSIONAL SCROLL ANIMATIONS
   ========================================== */

(() => {
  // Enable animation styles only when JavaScript works.
  document.documentElement.classList.add("js-motion");

  const loader = document.getElementById("pageLoader");

  // Hide the page loader after the page finishes loading.
  const hideLoader = () => {
    if (loader) {
      loader.classList.add("is-hidden");
    }
  };

  if (document.readyState === "complete") {
    hideLoader();
  } else {
    window.addEventListener("load", hideLoader, { once: true });
  }

  // Respect accessibility preferences.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  }

  // Animate cards in sequence within each grid.
  const staggerGroups = [
    ".skills-grid",
    ".projects-grid",
    ".certificate-grid",
    ".education-list"
  ];

  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      const cards = group.querySelectorAll(
        ".skill-card, .project-card, .certificate-card, .education-card"
      );

      cards.forEach((card, index) => {
        card.style.transitionDelay = `${(index % 3) * 90}ms`;
      });
    });
  });

  // Update the current navigation link while scrolling.
  const sections = document.querySelectorAll(
    "main section[id], section[id]"
  );

  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", isCurrent);

            if (isCurrent) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-25% 0px -65% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }
})();
/* ==========================================
   INTERACTIVE 3D TILT EFFECTS
   ========================================== */

(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reduceMotion || !supportsHover) {
    return;
  }

  const tiltSettings = [
    {
      selector: ".portrait-frame",
      maxRotate: 8,
      perspective: 1100
    },
    {
      selector: ".project-card",
      maxRotate: 5,
      perspective: 1200
    },
    {
      selector: ".skill-card",
      maxRotate: 4,
      perspective: 1100
    },
    {
      selector: ".certificate-card",
      maxRotate: 4,
      perspective: 1200
    },
    {
      selector: ".education-card",
      maxRotate: 3,
      perspective: 1000
    }
  ];

  tiltSettings.forEach((settings) => {
    document.querySelectorAll(settings.selector).forEach((element) => {
      let frameId = null;

      const resetTilt = () => {
        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }

        element.style.transform = "";
        element.style.removeProperty("--tilt-x");
        element.style.removeProperty("--tilt-y");
      };

      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * settings.maxRotate * 2;
        const rotateX = (0.5 - y) * settings.maxRotate * 2;

        if (frameId) {
          cancelAnimationFrame(frameId);
        }

        frameId = requestAnimationFrame(() => {
          element.style.transform = `
            perspective(${settings.perspective}px)
            rotateX(${rotateX.toFixed(2)}deg)
            rotateY(${rotateY.toFixed(2)}deg)
            translateY(-3px)
          `;

          element.style.setProperty(
            "--tilt-x",
            `${(x * 100).toFixed(1)}%`
          );

          element.style.setProperty(
            "--tilt-y",
            `${(y * 100).toFixed(1)}%`
          );

          frameId = null;
        });
      });

      element.addEventListener("pointerleave", resetTilt);

      element.addEventListener("pointercancel", resetTilt);
    });
  });
})();
