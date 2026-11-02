/* ==========================================================================
   Simple Personal Website - Script
   ========================================================================== */

(function () {
  "use strict";

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggle
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Navbar scroll effect: add a slight shadow when scrolled
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 40) {
          navbar.style.boxShadow = "0 4px 20px -6px rgba(0, 0, 0, 0.1)";
        } else {
          navbar.style.boxShadow = "none";
        }
      },
      { passive: true }
    );
  }

  // Contact form: prevent default submission and show a friendly message
  document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", function (event) {

      event.preventDefault();

      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      const email = "sorvli@gmail.com";

      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

      window.location.href = mailtoLink;

    });

  });

  // Highlight the current section in the navigation while scrolling
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  function highlightNav() {
    const scrollY = window.pageYOffset;
    const headerHeight = document.getElementById("navbar").offsetHeight;

    let current = null;
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight - 80;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", highlightNav, { passive: true });
  highlightNav();
})();

