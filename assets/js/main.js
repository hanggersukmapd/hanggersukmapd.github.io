/* =========================================================================
   Hangger Sukma Prima Darsono — Portfolio
   assets/js/main.js

   Modul interaktif (tanpa dependency, ES2020):
     1. Theme        — dark/light toggle + persistensi localStorage
     2. Progress     — scroll progress bar + status header
     3. Nav          — mobile menu, scroll spy, tutup menu
     4. Typing       — efek ketik pada sub-judul Hero
     5. Reveal       — animasi muncul saat di-scroll + counter angka
     6. Spotlight    — glow kartu mengikuti kursor
     7. Filters      — filter Skills & Projects (tabs)
     8. Modal        — studi kasus proyek (fokus, Esc, scroll lock)
     9. Copy email   — clipboard + toast
    10. Form         — validasi frontend form kontak
   ========================================================================= */

(function () {
  "use strict";

  /* ------------------------------ Utilitas ------------------------------ */
  var doc = document;

  function $(selector, root) {
    return (root || doc).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function prefersReducedMotion() {
    return motionQuery.matches;
  }

  function onMediaChange(callback) {
    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", callback);
    } else if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(callback);
    }
  }

  /* -------------------------- 1. Theme toggle --------------------------- */
  var Theme = (function () {
    var KEY = "hsp-theme";
    var root = doc.documentElement;

    function current() {
      return root.classList.contains("light") ? "light" : "dark";
    }

    function paint(theme) {
      var isLight = theme === "light";
      root.classList.toggle("light", isLight);
      root.style.colorScheme = isLight ? "light" : "dark";

      var meta = $('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isLight ? "#f5f7fb" : "#030616");

      $$("[data-theme-icon]").forEach(function (icon) {
        icon.hidden = icon.getAttribute("data-theme-icon") === (isLight ? "moon" : "sun") ? false : true;
      });

      var toggle = $("#theme-toggle");
      if (toggle) {
        toggle.setAttribute(
          "aria-label",
          isLight ? "Aktifkan mode gelap" : "Aktifkan mode terang"
        );
      }
    }

    function set(theme, persist) {
      paint(theme);
      if (persist !== false) {
        try {
          localStorage.setItem(KEY, theme);
        } catch (err) {
          /* localStorage bisa diblokir (mode privat). Abaikan. */
        }
      }
    }

    function init() {
      var stored = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch (err) {
        stored = null;
      }
      paint(stored === "light" ? "light" : "dark");

      var toggle = $("#theme-toggle");
      if (toggle) {
        toggle.addEventListener("click", toggleTheme);
      }
    }

    function toggleTheme() {
      set(current() === "light" ? "dark" : "light");
    }

    return { init: init, current: current, set: set, toggle: toggleTheme };
  })();

  /* --------------------- 2. Scroll progress + header -------------------- */
  var Progress = (function () {
    var bar = $("#scroll-progress");
    var header = $("#site-header");
    var ticking = false;

    function render() {
      var el = doc.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;

      if (bar) bar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      if (header) header.setAttribute("data-scrolled", el.scrollTop > 12 ? "true" : "false");

      ticking = false;
    }

    function request() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(render);
    }

    function init() {
      window.addEventListener("scroll", request, { passive: true });
      window.addEventListener("resize", request);
      render();
    }

    return { init: init };
  })();

  /* --------------------------- 3. Navigasi ------------------------------ */
  var Nav = (function () {
    var toggle = $("#nav-toggle");
    var menu = $("#mobile-menu");

    function setMenu(open) {
      if (!menu || !toggle) return;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function initMenu() {
      if (!toggle || !menu) return;

      toggle.addEventListener("click", function () {
        setMenu(menu.hidden);
      });

      $$("a", menu).forEach(function (link) {
        link.addEventListener("click", function () {
          setMenu(false);
        });
      });

      doc.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !menu.hidden) {
          setMenu(false);
          toggle.focus();
        }
      });

      // Tutup menu bila layar melebar ke desktop
      window.addEventListener("resize", function () {
        if (window.innerWidth >= 1024) setMenu(false);
      });
    }

    function initScrollSpy() {
      var links = $$("[data-nav]");
      var sections = links
        .map(function (link) {
          var id = link.getAttribute("href");
          return id && id.charAt(0) === "#" ? doc.getElementById(id.slice(1)) : null;
        })
        .filter(Boolean);

      if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + entry.target.id;
              if (match) {
                link.setAttribute("aria-current", "true");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    function init() {
      initMenu();
      initScrollSpy();
    }

    return { init: init };
  })();

  /* ---------------------------- 4. Typing ------------------------------- */
  var Typing = (function () {
    function init() {
      var target = $("#typed");
      var phrases = window.TYPING_PHRASES || [];
      if (!target || !phrases.length) return;

      if (prefersReducedMotion()) {
        target.textContent = phrases[0];
        return;
      }

      var phraseIndex = 0;
      var charIndex = 0;
      var deleting = false;

      function tick() {
        var phrase = phrases[phraseIndex];
        charIndex += deleting ? -1 : 1;
        target.textContent = phrase.slice(0, charIndex);

        var delay = deleting ? 30 : 58;

        if (!deleting && charIndex >= phrase.length) {
          deleting = true;
          delay = 1900;
        } else if (deleting && charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          delay = 380;
        }

        window.setTimeout(tick, delay);
      }

      window.setTimeout(tick, 420);
    }

    return { init: init };
  })();

  /* ------------------------ 5. Reveal + counter ------------------------- */
  var Reveal = (function () {
    function animateCounter(el) {
      var raw = el.getAttribute("data-count");
      if (raw == null) return;
      var target = parseFloat(raw);
      if (isNaN(target)) return;

      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var duration = 1200;
      var start = null;

      if (prefersReducedMotion()) {
        el.textContent = target.toFixed(decimals);
        return;
      }

      function frame(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min(1, (timestamp - start) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) window.requestAnimationFrame(frame);
      }

      window.requestAnimationFrame(frame);
    }

    function init() {
      var items = $$(".reveal");
      if (!items.length) return;

      if (!("IntersectionObserver" in window)) {
        items.forEach(function (el) {
          el.classList.add("is-visible");
        });
        $$("[data-count]").forEach(animateCounter);
        return;
      }

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var delay = parseInt(el.getAttribute("data-reveal-delay") || "0", 10);
            window.setTimeout(function () {
              el.classList.add("is-visible");
            }, prefersReducedMotion() ? 0 : delay);
            observer.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );

      items.forEach(function (el) {
        observer.observe(el);
      });

      var counters = $$("[data-count]");
      if (!counters.length) return;

      if (prefersReducedMotion()) {
        counters.forEach(animateCounter);
        return;
      }

      var counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.6 }
      );

      counters.forEach(function (el) {
        counterObserver.observe(el);
      });
    }

    return { init: init };
  })();

  /* --------------------------- 6. Spotlight ----------------------------- */
  var Spotlight = (function () {
    function init() {
      var cards = $$(".spotlight");
      if (!cards.length || prefersReducedMotion() || !window.PointerEvent) return;

      cards.forEach(function (card) {
        card.addEventListener("pointermove", function (event) {
          var rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", event.clientX - rect.left + "px");
          card.style.setProperty("--my", event.clientY - rect.top + "px");
        });
      });
    }

    return { init: init };
  })();

  /* ---------------------------- 7. Filters ------------------------------ */
  var Filters = (function () {
    function setup(config) {
      var group = $(config.group);
      var items = $$(config.items);
      if (!group || !items.length) return;

      var buttons = $$("button[data-filter]", group);
      if (!buttons.length) return;

      function apply(value, animate) {
        buttons.forEach(function (btn) {
          btn.setAttribute("aria-pressed", btn.getAttribute("data-filter") === value ? "true" : "false");
        });

        items.forEach(function (item) {
          var tags = (item.getAttribute(config.attr) || "").split(/\s+/);
          var visible = value === "all" || tags.indexOf(value) !== -1;
          item.hidden = !visible;

          if (visible && animate !== false && !prefersReducedMotion()) {
            item.classList.remove("pop-in");
            // Reflow agar animasi bisa diputar ulang.
            void item.offsetWidth;
            item.classList.add("pop-in");
          }
        });
      }

      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          apply(btn.getAttribute("data-filter"));
        });
      });

      // Penerapan awal tanpa animasi, agar animasi reveal tetap berjalan.
      apply("all", false);
    }

    function init() {
      setup({
        group: "#skills-filter",
        items: "[data-skill-item]",
        attr: "data-skill-tag",
      });

      setup({
        group: "#projects-filter",
        items: "[data-project-item]",
        attr: "data-project-tag",
      });
    }

    return { init: init };
  })();

  /* ----------------------------- 8. Modal ------------------------------- */
  var Modal = (function () {
    var overlay = $("#project-modal");
    var panel = $("#modal-panel");
    var body = $("#modal-body");
    var lastFocused = null;
    var open = false;
    var currentId = null;

    function renderSection(section) {
      var html = '<section class="mt-7 first:mt-0">';
      html +=
        '<h3 class="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">' +
        escapeHtml(section.heading) +
        "</h3>";

      if (section.body) {
        html += '<p class="mt-2.5 text-sm leading-relaxed muted">' + escapeHtml(section.body) + "</p>";
      }

      if (section.bullets && section.bullets.length) {
        html += '<ul class="mt-3 space-y-2">';
        section.bullets.forEach(function (point) {
          html +=
            '<li class="flex gap-2.5 text-sm leading-relaxed muted">' +
            '<span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"></span>' +
            "<span>" +
            escapeHtml(point) +
            "</span></li>";
        });
        html += "</ul>";
      }

      html += "</section>";
      return html;
    }

    function render(project) {
      if (!body) return;

      var html = "";

      // Header: kategori + tahun
      html +=
        '<div class="flex flex-wrap items-center gap-2">' +
        '<span class="chip chip-accent">' + escapeHtml(project.category) + "</span>" +
        '<span class="chip">' + escapeHtml(project.year) + "</span>" +
        "</div>";

      // Judul & tagline
      html +=
        '<h2 id="modal-title" class="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">' +
        escapeHtml(project.title) +
        "</h2>" +
        '<p class="mt-2 text-sm leading-relaxed muted">' + escapeHtml(project.tagline) + "</p>";

      // Fakta ringkas
      if (project.facts) {
        html += '<dl class="mt-6 grid gap-3 sm:grid-cols-3">';
        Object.keys(project.facts).forEach(function (key) {
          html +=
            '<div class="rounded-xl border border-[var(--border)] bg-[var(--field-bg)] p-3">' +
            '<dt class="text-[0.68rem] uppercase tracking-[0.14em] dim">' +
            escapeHtml(key) +
            "</dt>" +
            '<dd class="mt-1 text-sm font-semibold">' +
            escapeHtml(project.facts[key]) +
            "</dd></div>";
        });
        html += "</dl>";
      }

      // Teknologi
      if (project.tech && project.tech.length) {
        html += '<div class="mt-6"><p class="text-[0.7rem] uppercase tracking-[0.16em] dim">Tech Stack</p>';
        html += '<ul class="mt-2 flex flex-wrap gap-2">';
        project.tech.forEach(function (tool) {
          html += '<li class="chip">' + escapeHtml(tool) + "</li>";
        });
        html += "</ul></div>";
      }

      // Isi studi kasus
      html += '<div class="mt-8 space-y-1">';
      (project.sections || []).forEach(function (section) {
        html += renderSection(section);
      });
      html += "</div>";

      // Tautan
      if (project.links && project.links.length) {
        html += '<div class="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-6">';
        project.links.forEach(function (link) {
          html +=
            '<a class="btn btn-ghost" href="' +
            escapeHtml(link.href) +
            '" target="_blank" rel="noopener noreferrer">' +
            escapeHtml(link.label) +
            '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H9m8 0v8"/></svg>' +
            "</a>";
        });
        html += "</div>";
      }

      body.innerHTML = html;
    }

    function focusables() {
      if (!panel) return [];
      return $$(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        panel
      ).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function order() {
      return Object.keys(window.PROJECTS || {});
    }

    function hashId() {
      var hash = window.location.hash || "";
      if (hash.indexOf("#project/") !== 0) return null;
      return decodeURIComponent(hash.slice("#project/".length));
    }

    function paintNav() {
      var ids = order();
      var index = ids.indexOf(currentId);
      var prev = $("#modal-prev");
      var next = $("#modal-next");
      var label = $("#modal-index");

      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index < 0 || index >= ids.length - 1;
      if (label) label.textContent = index + 1 + " / " + ids.length;
    }

    function writeUrl(hash, replace) {
      try {
        window.history[replace ? "replaceState" : "pushState"]({ project: currentId }, "", hash);
      } catch (err) {
        /* History API bisa dibatasi (file:// atau sandbox). */
      }
    }

    function show(id, options) {
      var project = window.PROJECTS && window.PROJECTS[id];
      if (!project || !overlay) return;

      options = options || {};

      // Hindari render ulang saat popstate/hashchange memanggil id yang sama.
      if (open && currentId === id) {
        if (options.url !== false) writeUrl("#project/" + encodeURIComponent(id), options.replace);
        return;
      }

      var wasOpen = open;
      if (!wasOpen) lastFocused = doc.activeElement;

      currentId = id;
      render(project);
      paintNav();

      if (!wasOpen) {
        overlay.hidden = false;
        open = true;
        doc.body.classList.add("modal-open");

        var closeBtn = $("[data-modal-close]", overlay);
        if (closeBtn) closeBtn.focus();
      }

      if (panel) panel.scrollTop = 0;

      if (options.url !== false) {
        writeUrl("#project/" + encodeURIComponent(id), options.replace);
      }
    }

    function close(options) {
      options = options || {};
      if (!overlay || !open) return;

      overlay.hidden = true;
      open = false;
      currentId = null;
      doc.body.classList.remove("modal-open");

      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      lastFocused = null;

      if (options.url !== false) {
        try {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch (err) {
          /* abaikan */
        }
      }
    }

    function step(delta) {
      var ids = order();
      var index = ids.indexOf(currentId);
      var target = ids[index + delta];
      if (target) show(target, { replace: true });
    }

    function copyLink() {
      if (!currentId) return;

      var base = window.location.href.split("#")[0];
      var link = base + "#project/" + encodeURIComponent(currentId);

      CopyEmail.write(link).then(function (ok) {
        Toast.show(ok ? "Tautan studi kasus disalin." : "Gagal menyalin tautan.");
      });
    }

    function init() {
      if (!overlay) return;

      $$("[data-project]").forEach(function (card) {
        var id = card.getAttribute("data-project");

        card.addEventListener("click", function () {
          show(id);
        });

        card.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            show(id);
          }
        });
      });

      $$("[data-modal-close]", overlay).forEach(function (el) {
        el.addEventListener("click", function () {
          close();
        });
      });

      var prev = $("#modal-prev");
      var next = $("#modal-next");
      var copy = $("#modal-copy-link");

      if (prev) prev.addEventListener("click", function () { step(-1); });
      if (next) next.addEventListener("click", function () { step(1); });
      if (copy) copy.addEventListener("click", copyLink);

      doc.addEventListener("keydown", function (event) {
        if (!open) return;

        if (event.key === "Escape") {
          event.preventDefault();
          close();
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
          return;
        }

        if (event.key === "Tab") {
          var items = focusables();
          if (!items.length) return;
          var first = items[0];
          var last = items[items.length - 1];

          if (event.shiftKey && doc.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && doc.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      });

      function syncFromUrl() {
        var id = (window.history.state && window.history.state.project) || hashId();
        if (id && window.PROJECTS && window.PROJECTS[id]) {
          show(id, { url: false });
        } else {
          close({ url: false });
        }
      }

      window.addEventListener("popstate", syncFromUrl);
      window.addEventListener("hashchange", syncFromUrl);

      // Deep link saat halaman dibuka: .../#project/factcheck
      var initial = hashId();
      if (initial && window.PROJECTS && window.PROJECTS[initial]) {
        show(initial, { url: false });
      }
    }

    return {
      init: init,
      show: show,
      close: close,
      openId: function () { return currentId; },
    };
  })();

  /* --------------------------- 9. Toast + copy -------------------------- */
  var Toast = (function () {
    var region = $("#toast-region");

    function show(message) {
      if (!region) return;

      var el = doc.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.innerHTML =
        '<svg class="toast-icon h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' +
        "<span>" +
        escapeHtml(message) +
        "</span>";

      region.appendChild(el);

      window.setTimeout(function () {
        el.classList.add("is-leaving");
        window.setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 260);
      }, 2800);
    }

    return { show: show };
  })();

  var CopyEmail = (function () {
    var email = (window.SITE && window.SITE.email) || "hanggersukmapd@gmail.com";

    function fallbackCopy(text) {
      var area = doc.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      area.style.opacity = "0";
      doc.body.appendChild(area);
      area.select();

      var ok = false;
      try {
        ok = doc.execCommand("copy");
      } catch (err) {
        ok = false;
      }
      doc.body.removeChild(area);
      return ok;
    }

    function write(text) {
      return new Promise(function (resolve) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () {
              resolve(true);
            },
            function () {
              resolve(fallbackCopy(text));
            }
          );
          return;
        }

        resolve(fallbackCopy(text));
      });
    }

    function copy() {
      return write(email);
    }

    function init() {
      $$("[data-copy-email]").forEach(function (button) {
        button.addEventListener("click", function () {
          copy().then(function (ok) {
            if (!ok) {
              Toast.show("Gagal menyalin. Email: " + email);
              return;
            }

            Toast.show("Email disalin: " + email);
            button.setAttribute("data-copied", "true");
            window.setTimeout(function () {
              button.removeAttribute("data-copied");
            }, 1600);
          });
        });
      });
    }

    return { init: init, copy: copy, write: write, email: email };
  })();

  /* ------------------------ 9b. Command palette ------------------------- */
  var Palette = (function () {
    var overlay = $("#palette");
    var input = $("#palette-input");
    var list = $("#palette-list");
    var empty = $("#palette-empty");
    var lastFocused = null;
    var items = [];
    var filtered = [];
    var activeIndex = 0;
    var isOpen = false;

    function actions() {
      var entries = [
        { label: "About", hint: "Bagian", keywords: "tentang profil bio siapa", target: "#about" },
        { label: "Skills", hint: "Bagian", keywords: "keahlian tech stack tools", target: "#skills" },
        { label: "Experience", hint: "Bagian", keywords: "pengalaman kerja riset koordinator", target: "#experience" },
        { label: "Projects", hint: "Bagian", keywords: "proyek portofolio studi kasus", target: "#projects" },
        { label: "Education & Certifications", hint: "Bagian", keywords: "pendidikan sertifikasi ipk kampus", target: "#education" },
        { label: "Leadership & Awards", hint: "Bagian", keywords: "organisasi penghargaan medali psm", target: "#leadership" },
        { label: "Contact", hint: "Bagian", keywords: "kontak hubungi email form", target: "#contact" },
        {
          label: "Salin alamat email",
          hint: "Aksi",
          keywords: "copy clipboard surel",
          run: function () {
            CopyEmail.copy().then(function (ok) {
              Toast.show(ok ? "Email disalin: " + CopyEmail.email : "Gagal menyalin. Email: " + CopyEmail.email);
            });
          },
        },
        {
          label: "Unduh CV",
          hint: "Aksi",
          keywords: "resume curriculum vitae docx download",
          run: function () {
            var cv = (window.SITE && window.SITE.cv) || "CV_Hangger_Sukma_Prima_Darsono.docx";
            var anchor = doc.createElement("a");
            anchor.href = cv;
            anchor.setAttribute("download", "");
            doc.body.appendChild(anchor);
            anchor.click();
            doc.body.removeChild(anchor);
            Toast.show("Menyiapkan unduhan CV.");
          },
        },
        {
          label: "Ganti tema gelap / terang",
          hint: "Aksi",
          keywords: "dark light mode tema",
          run: function () {
            Theme.toggle();
          },
        },
        { label: "GitHub", hint: "Eksternal", keywords: "kode repo repository", href: "https://github.com/hanggersukmapd" },
        { label: "Kaggle", hint: "Eksternal", keywords: "dataset notebook machine learning", href: "https://www.kaggle.com/hanggersukmapd" },
        { label: "LinkedIn", hint: "Eksternal", keywords: "profesional koneksi", href: "https://www.linkedin.com/in/hanggersukmapd" },
      ];

      Object.keys(window.PROJECTS || {}).forEach(function (id) {
        var project = window.PROJECTS[id];
        entries.push({
          label: project.title,
          hint: "Studi kasus",
          keywords: project.category + " " + (project.tech || []).join(" "),
          run: function () {
            Modal.show(id);
          },
        });
      });

      return entries;
    }

    function goTo(hash) {
      var target = doc.querySelector(hash);
      if (!target) return;

      target.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });

      try {
        window.history.replaceState(null, "", hash);
      } catch (err) {
        /* abaikan */
      }
    }

    function run(item) {
      close();
      if (!item) return;

      if (item.target) {
        goTo(item.target);
        return;
      }

      if (item.href) {
        window.open(item.href, "_blank", "noopener");
        return;
      }

      if (item.run) item.run();
    }

    function paintSelection() {
      $$("[role='option']", list).forEach(function (el, index) {
        el.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
      });

      var active = doc.getElementById("palette-option-" + activeIndex);
      if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
      if (input) input.setAttribute("aria-activedescendant", "palette-option-" + activeIndex);
    }

    function render() {
      if (!list) return;
      list.innerHTML = "";

      if (!filtered.length) {
        if (empty) empty.classList.remove("hidden");
        if (input) input.removeAttribute("aria-activedescendant");
        return;
      }

      if (empty) empty.classList.add("hidden");

      filtered.forEach(function (item, index) {
        var option = doc.createElement("li");
        option.id = "palette-option-" + index;
        option.className = "palette-item";
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
        option.innerHTML =
          "<span>" + escapeHtml(item.label) + "</span>" +
          '<span class="hint">' + escapeHtml(item.hint) + "</span>";

        option.addEventListener("mousemove", function () {
          if (activeIndex === index) return;
          activeIndex = index;
          paintSelection();
        });

        option.addEventListener("click", function () {
          run(filtered[index]);
        });

        list.appendChild(option);
      });

      paintSelection();
    }

    function filter(query) {
      var q = (query || "").trim().toLowerCase();

      filtered = !q
        ? items.slice()
        : items.filter(function (item) {
            var haystack = (item.label + " " + item.hint + " " + (item.keywords || "")).toLowerCase();
            return haystack.indexOf(q) !== -1;
          });

      activeIndex = 0;
      render();
    }

    function open() {
      if (!overlay) return;

      // Jangan menumpuk dua dialog sekaligus.
      if (Modal.openId()) Modal.close();

      lastFocused = doc.activeElement;
      items = actions();
      filter("");

      overlay.hidden = false;
      isOpen = true;
      doc.body.classList.add("modal-open");

      if (input) {
        input.value = "";
        input.setAttribute("aria-expanded", "true");
        input.focus();
      }
    }

    function close() {
      if (!overlay || !isOpen) return;

      overlay.hidden = true;
      isOpen = false;
      doc.body.classList.remove("modal-open");

      if (input) input.setAttribute("aria-expanded", "false");

      if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      lastFocused = null;
    }

    function init() {
      if (!overlay) return;

      $$("#palette-open").forEach(function (button) {
        button.addEventListener("click", open);
      });

      $$("[data-palette-close]", overlay).forEach(function (el) {
        el.addEventListener("click", close);
      });

      if (input) {
        input.addEventListener("input", function () {
          filter(input.value);
        });

        input.addEventListener("keydown", function (event) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!filtered.length) return;
            activeIndex = (activeIndex + 1) % filtered.length;
            paintSelection();
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (!filtered.length) return;
            activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
            paintSelection();
          } else if (event.key === "Enter") {
            event.preventDefault();
            run(filtered[activeIndex]);
          }
        });
      }

      doc.addEventListener("keydown", function (event) {
        var isShortcut = (event.metaKey || event.ctrlKey) && (event.key === "k" || event.key === "K");

        if (isShortcut) {
          event.preventDefault();
          if (isOpen) close();
          else open();
          return;
        }

        if (isOpen && event.key === "Escape") {
          event.preventDefault();
          close();
        }
      });
    }

    return { init: init, open: open, close: close };
  })();

  /* ---------------------- 10. Service worker (PWA) ---------------------- */
  var PWA = (function () {
    function init() {
      if (!("serviceWorker" in navigator)) return;

      var isLocal =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (window.location.protocol !== "https:" && !isLocal) return;

      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").catch(function () {
          /* Registrasi gagal (mode privat / file://) — halaman tetap berjalan. */
        });
      });
    }

    return { init: init };
  })();

  /* ---------------------------- 11. Form -------------------------------- */
  var ContactForm = (function () {
    var email = (window.SITE && window.SITE.email) || "hanggersukmapd@gmail.com";

    var rules = {
      name: function (value) {
        return value.trim().length >= 2 ? "" : "Nama minimal 2 karakter.";
      },
      email: function (value) {
        return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim())
          ? ""
          : "Masukkan alamat email yang valid, misalnya nama@email.com.";
      },
      message: function (value) {
        return value.trim().length >= 10 ? "" : "Pesan minimal 10 karakter agar konteksnya jelas.";
      },
    };

    function fieldError(name) {
      return doc.getElementById("error-" + name);
    }

    function setError(name, message) {
      var field = doc.getElementById(name);
      var slot = fieldError(name);
      if (!field || !slot) return;

      if (message) {
        field.setAttribute("aria-invalid", "true");
        slot.textContent = message;
        slot.classList.add("is-visible");
      } else {
        field.removeAttribute("aria-invalid");
        slot.textContent = "";
        slot.classList.remove("is-visible");
      }
    }

    function validateField(name) {
      var field = doc.getElementById(name);
      if (!field || !rules[name]) return true;
      var message = rules[name](field.value);
      setError(name, message);
      return !message;
    }

    function init() {
      var form = $("#contact-form");
      if (!form) return;

      var status = $("#form-status");
      var attempted = false;

      Object.keys(rules).forEach(function (name) {
        var field = doc.getElementById(name);
        if (!field) return;

        field.addEventListener("blur", function () {
          if (attempted) validateField(name);
        });

        field.addEventListener("input", function () {
          if (attempted) validateField(name);
        });
      });

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        attempted = true;

        var names = Object.keys(rules);
        var firstInvalid = null;

        names.forEach(function (name) {
          if (!validateField(name) && !firstInvalid) firstInvalid = name;
        });

        if (firstInvalid) {
          var node = doc.getElementById(firstInvalid);
          if (node) node.focus();
          if (status) status.textContent = "Mohon periksa kembali kolom yang ditandai.";
          Toast.show("Form belum lengkap — periksa kolom yang ditandai.");
          return;
        }

        var name = doc.getElementById("name").value.trim();
        var sender = doc.getElementById("email").value.trim();
        var message = doc.getElementById("message").value.trim();

        var subject = encodeURIComponent("Pesan dari portofolio — " + name);
        var content = encodeURIComponent(message + "\n\n— " + name + " (" + sender + ")");
        var mailto = "mailto:" + email + "?subject=" + subject + "&body=" + content;

        if (status) {
          status.textContent =
            "Membuka aplikasi email Anda. Jika tidak terbuka, hubungi " + email + " secara langsung.";
        }
        Toast.show("Pesan siap dikirim melalui aplikasi email.");

        window.location.href = mailto;
        form.reset();
        attempted = false;
        names.forEach(function (key) {
          setError(key, "");
        });
      });
    }

    return { init: init };
  })();

  /* ----------------------------- Bootstrap ------------------------------ */
  function start() {
    Theme.init();
    Progress.init();
    Nav.init();
    Typing.init();
    Reveal.init();
    Spotlight.init();
    Filters.init();
    Modal.init();
    Palette.init();
    CopyEmail.init();
    ContactForm.init();
    PWA.init();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // Tahun footer otomatis (jika elemen tersedia)
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
