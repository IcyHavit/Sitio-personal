const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const header = document.querySelector("[data-header]");

function closeMenu() {
  menu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menu?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

let lastScrollPosition = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const currentScrollPosition = window.scrollY;
    const scrollingDown = currentScrollPosition > lastScrollPosition;
    header?.classList.toggle(
      "is-hidden",
      scrollingDown && currentScrollPosition > 260 && !menu?.classList.contains("is-open"),
    );
    lastScrollPosition = currentScrollPosition;
  },
  { passive: true },
);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.hash === `#${visibleEntry.target.id}`);
    });
  },
  { rootMargin: "-30% 0px -55%", threshold: [0, 0.25, 0.5] },
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector("[data-year]").textContent = new Date().getFullYear();
