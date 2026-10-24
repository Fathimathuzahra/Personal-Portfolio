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
