/* =========================================================
   Crystal Qualet — interactions
   ========================================================= */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;

  /* ---------- Mark decorative SVGs as hidden from assistive tech ---------- */
  doc.querySelectorAll("svg:not([role])").forEach((svg) => {
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
  });

  /* ---------- Header shadow on scroll ---------- */
  const header = doc.querySelector(".site-header");
  const toTop = doc.querySelector(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 12);
    if (toTop) toTop.classList.toggle("show", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* ---------- Mobile menu ---------- */
  const navToggle = doc.querySelector(".nav-toggle");
  const mobileMenu = doc.querySelector(".mobile-menu");
  const setMenu = (open) => {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("open", open);
    doc.body.style.overflow = open ? "hidden" : "";
  };
  if (navToggle) {
    navToggle.addEventListener("click", () =>
      setMenu(navToggle.getAttribute("aria-expanded") !== "true")
    );
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => setMenu(false))
    );
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* ---------- Language toggle (TH / EN) ---------- */
  const langButtons = doc.querySelectorAll("[data-set-lang]");
  // <option> can't use show/hide spans, so swap their text via data-th / data-en.
  const localizedOptions = doc.querySelectorAll("option[data-th][data-en]");
  const applyLang = (lang) => {
    root.setAttribute("lang", lang);
    try { localStorage.setItem("cq-lang", lang); } catch (e) {}
    langButtons.forEach((b) => {
      const isActive = b.getAttribute("data-set-lang") === lang;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });
    localizedOptions.forEach((o) => {
      o.textContent = o.getAttribute(lang === "en" ? "data-en" : "data-th");
    });
    doc.title = lang === "en"
      ? "Crystal Qualet Co., Ltd. — Premium Skincare & E-commerce Distribution"
      : "บริษัท คริสตัล ควาเลท จำกัด — ผลิตภัณฑ์ดูแลผิวพรีเมียม & จัดจำหน่ายออนไลน์";
  };
  let saved = "th";
  try { saved = localStorage.getItem("cq-lang") || "th"; } catch (e) {}
  applyLang(saved === "en" ? "en" : "th");
  langButtons.forEach((b) =>
    b.addEventListener("click", () => applyLang(b.getAttribute("data-set-lang")))
  );

  /* ---------- Smooth anchor scrolling with header offset ---------- */
  doc.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = doc.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = doc.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const dec = (el.getAttribute("data-count").split(".")[1] || "").length;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = val.toLocaleString("en-US", {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      }) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---------- Contact form validation (front-end demo) ---------- */
  const form = doc.querySelector("#contact-form");
  if (form) {
    const success = form.querySelector(".form-success");
    const setError = (input, on) => {
      input.closest(".field").classList.toggle("invalid", on);
      input.setAttribute("aria-invalid", String(on));
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      const name = form.querySelector("#cf-name");
      const email = form.querySelector("#cf-email");
      const message = form.querySelector("#cf-message");

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

      [name, message].forEach((f) => {
        const bad = !f.value.trim();
        setError(f, bad);
        if (bad) ok = false;
      });
      const emailBad = !email.value.trim() || !emailOk;
      setError(email, emailBad);
      if (emailBad) ok = false;

      if (!ok) {
        const firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
      form.reset();
      setTimeout(() => {
        if (success) success.classList.remove("show");
      }, 6000);
    });

    form.querySelectorAll("input, textarea").forEach((f) => {
      f.addEventListener("input", () => {
        f.closest(".field").classList.remove("invalid");
        f.removeAttribute("aria-invalid");
      });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = doc.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
