/* =========================================================================
   Import Auto Specialist — script.js
   Lightweight vanilla JS, no dependencies. Every feature is guarded so the
   page degrades gracefully if an element is missing or JS is disabled.
   ========================================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile menu ---------------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    if (!hamburger || !mobileMenu) return;
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var open = hamburger.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Close menu');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close when a menu link is tapped
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------- Services dropdown (accessible disclosure) ---------------- */
  // The toggle is a real <button aria-expanded>; JS drives open/close for
  // keyboard, touch, and click. Pointer devices also get hover-to-open via CSS.
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.has-dropdown'));
  var closeDropdown = function (dd) {
    dd.classList.remove('open');
    var t = dd.querySelector('.nav-dropdown-toggle');
    if (t) t.setAttribute('aria-expanded', 'false');
  };
  dropdowns.forEach(function (dd) {
    var toggle = dd.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var open = !dd.classList.contains('open');
      dd.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close when focus leaves the menu entirely (keyboard tab-out)
    dd.addEventListener('focusout', function (e) {
      if (!dd.contains(e.relatedTarget)) closeDropdown(dd);
    });
  });
  if (dropdowns.length) {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dropdowns.forEach(closeDropdown);
    });
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dd) { if (!dd.contains(e.target)) closeDropdown(dd); });
    });
  }

  /* ---------------- Sticky header shadow ---------------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onHeaderScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    onHeaderScroll();
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
  }

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: show everything
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------------- Active nav highlight ---------------- */
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('href');
    if (id && id.charAt(0) === '#') {
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: link, section: sec });
    }
  });

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var match = sections.filter(function (s) { return s.section === entry.target; })[0];
          if (match) match.link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s.section); });
  }

  /* ---------------- FAQ accordion (single open, animated) ---------------- */
  var faqButtons = document.querySelectorAll('.faq-question');
  // Drop the no-JS `hidden` fallback so panels can animate open/closed via CSS
  // (styles.css collapses them with max-height; JS just toggles the .open class).
  faqButtons.forEach(function (btn) {
    var p = document.getElementById(btn.getAttribute('aria-controls'));
    if (p) { p.hidden = false; p.classList.remove('open'); }
  });
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));

      // Close others
      faqButtons.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var op = document.getElementById(other.getAttribute('aria-controls'));
          if (op) op.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.classList.toggle('open', !expanded);
    });
  });

  /* ---------------- Today's hours highlight ---------------- */
  // Uses the browser's local day. The shop is in America/Toronto; for a precise
  // timezone-locked highlight, compute the Toronto weekday instead.
  var hoursTable = document.getElementById('hours-table');
  if (hoursTable) {
    var todayIdx;
    try {
      var torontoDay = new Date().toLocaleDateString('en-US', { timeZone: 'America/Toronto', weekday: 'short' });
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      todayIdx = map[torontoDay];
    } catch (err) {
      todayIdx = new Date().getDay();
    }
    var row = hoursTable.querySelector('tr[data-day="' + todayIdx + '"]');
    if (row) row.classList.add('today');
  }

  /* ---------------- Live "Open now / Closed" status ---------------- */
  // Business hours: Monday–Friday, 09:00–17:00 (America/Toronto). Weekends closed.
  // The pill stays hidden until JS runs, so no stale/wrong status is ever shown without JS.
  var statusPills = document.querySelectorAll('[data-open-status]');
  if (statusPills.length) {
    var OPEN_MIN = 9 * 60;    // 09:00
    var CLOSE_MIN = 17 * 60;  // 17:00
    var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Toronto-local weekday + time (falls back to the visitor's local clock if Intl/timeZone is unavailable)
    var wd, minsNow;
    try {
      var parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Toronto', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var p = {};
      parts.forEach(function (part) { p[part.type] = part.value; });
      var wmap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      wd = wmap[p.weekday];
      minsNow = (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10);
    } catch (err) {
      var now = new Date();
      wd = now.getDay();
      minsNow = now.getHours() * 60 + now.getMinutes();
    }

    var fmtTime = function (mins) {
      var h = Math.floor(mins / 60), m = mins % 60;
      var ampm = h >= 12 ? 'PM' : 'AM';
      var h12 = h % 12; if (h12 === 0) h12 = 12;
      return h12 + (m ? ':' + (m < 10 ? '0' + m : m) : '') + ' ' + ampm;
    };

    var isWeekday = function (d) { return d >= 1 && d <= 5; };
    var isOpen = isWeekday(wd) && minsNow >= OPEN_MIN && minsNow < CLOSE_MIN;

    var label, cls;
    if (isOpen) {
      cls = 'is-open';
      label = 'Open now · until ' + fmtTime(CLOSE_MIN);
    } else {
      cls = 'is-closed';
      // Find the next day the shop opens
      var when;
      if (isWeekday(wd) && minsNow < OPEN_MIN) {
        when = 'today at ' + fmtTime(OPEN_MIN);
      } else {
        var offset = 1;
        while (!isWeekday((wd + offset) % 7)) { offset++; }
        when = (offset === 1 ? 'tomorrow' : dayNames[(wd + offset) % 7]) + ' at ' + fmtTime(OPEN_MIN);
      }
      label = 'Closed · opens ' + when;
    }

    statusPills.forEach(function (pill) {
      pill.classList.add(cls);
      pill.innerHTML = '<span class="status-dot" aria-hidden="true"></span><span class="status-text"></span>';
      pill.querySelector('.status-text').textContent = label;
      pill.hidden = false;
    });
  }

  /* ---------------- Reviews carousel dots (progressive enhancement) ---------------- */
  // Works without JS too: .reviews-track is a native CSS scroll-snap strip, swipeable by touch.
  var reviewsTrack = document.getElementById('reviews-track');
  var reviewsDots = document.getElementById('reviews-dots');
  if (reviewsTrack && reviewsDots) {
    var reviewCards = Array.prototype.slice.call(reviewsTrack.querySelectorAll('.review-card'));
    var currentReview = 0;

    var goToReview = function (i) {
      if (i < 0) i = reviewCards.length - 1;          // wrap
      else if (i >= reviewCards.length) i = 0;
      var card = reviewCards[i];
      if (card) card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    };

    reviewCards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show review ' + (i + 1) + ' of ' + reviewCards.length);
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', function () { goToReview(i); });
      reviewsDots.appendChild(dot);
    });

    // Manual prev / next arrows (visible on phone & tablet; hidden on the desktop grid)
    var reviewsPrev = document.getElementById('reviews-prev');
    var reviewsNext = document.getElementById('reviews-next');
    if (reviewsPrev) reviewsPrev.addEventListener('click', function () { goToReview(currentReview - 1); });
    if (reviewsNext) reviewsNext.addEventListener('click', function () { goToReview(currentReview + 1); });

    var reviewDotEls = Array.prototype.slice.call(reviewsDots.children);
    if ('IntersectionObserver' in window && reviewDotEls.length) {
      var reviewsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = reviewCards.indexOf(entry.target);
            if (idx !== -1) {
              currentReview = idx;
              reviewDotEls.forEach(function (d, di) { d.setAttribute('aria-current', di === idx ? 'true' : 'false'); });
            }
          }
        });
      }, { root: reviewsTrack, threshold: 0.6 });
      reviewCards.forEach(function (c) { reviewsObserver.observe(c); });
    }
  }

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Back to top ---------------- */
  var backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    backBtn.hidden = false;
    var onBackScroll = function () {
      backBtn.classList.toggle('show', window.scrollY > 600);
    };
    onBackScroll();
    window.addEventListener('scroll', onBackScroll, { passive: true });
    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Mobile bar hide-on-scroll-down ---------------- */
  var mobileBar = document.getElementById('mobile-bar');
  if (mobileBar) {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > lastY && y > 300) {
        mobileBar.classList.add('hidden-down');   // scrolling down
      } else {
        mobileBar.classList.remove('hidden-down'); // scrolling up
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------------- Appointment form validation ---------------- */
  /*
     NOTE: This form posts to a Formspree action with a placeholder ID
     (YOUR_FORM_ID in index.html). Until a real form ID (or other backend /
     email API) is connected, submissions are NOT delivered anywhere. The code
     below validates the fields client-side and shows a confirmation message,
     but it does not guarantee the request reached the shop. We call
     preventDefault() so nothing is falsely "sent" while the placeholder ID is
     in place. Once a real Formspree ID is set, remove the preventDefault()
     block marked below so the browser submits to Formspree normally.
  */
  var form = document.getElementById('appointment-form');
  if (form) {
    var confirmEl = document.getElementById('form-confirm');

    var setError = function (fieldId, message) {
      var input = document.getElementById(fieldId);
      var errEl = document.getElementById('err-' + fieldId);
      var wrap = input ? input.closest('.form-field') : null;
      if (errEl) errEl.textContent = message;
      if (wrap) wrap.classList.toggle('invalid', !!message);
      if (input) {
        if (message) { input.setAttribute('aria-invalid', 'true'); }
        else { input.removeAttribute('aria-invalid'); }
      }
      return !message;
    };

    var validate = function () {
      var ok = true;
      var firstInvalid = null;

      var name = document.getElementById('name');
      if (!name.value.trim()) { setError('name', 'Please enter your name.'); ok = false; firstInvalid = firstInvalid || name; }
      else setError('name', '');

      var phone = document.getElementById('phone');
      var phoneDigits = phone.value.replace(/[^0-9]/g, '');
      if (!phone.value.trim()) { setError('phone', 'Please enter a phone number.'); ok = false; firstInvalid = firstInvalid || phone; }
      else if (phoneDigits.length < 10) { setError('phone', 'Please enter a valid phone number.'); ok = false; firstInvalid = firstInvalid || phone; }
      else setError('phone', '');

      var email = document.getElementById('email');
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) { setError('email', 'Please enter your email.'); ok = false; firstInvalid = firstInvalid || email; }
      else if (!emailRe.test(email.value.trim())) { setError('email', 'Please enter a valid email address.'); ok = false; firstInvalid = firstInvalid || email; }
      else setError('email', '');

      var message = document.getElementById('message');
      if (!message.value.trim()) { setError('message', 'Please add a short message.'); ok = false; firstInvalid = firstInvalid || message; }
      else setError('message', '');

      if (firstInvalid) firstInvalid.focus();
      return ok;
    };

    form.addEventListener('submit', function (e) {
      if (!validate()) {
        e.preventDefault();
        if (confirmEl) confirmEl.hidden = true;
        return;
      }

      /* ---- PLACEHOLDER GUARD ----
         Remove this block once a real Formspree ID replaces YOUR_FORM_ID so the
         browser actually submits the form. While the placeholder is present we
         stop the network request and show a confirmation instead of pretending
         the message was delivered. */
      if (form.getAttribute('action').indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        if (confirmEl) {
          confirmEl.hidden = false;
          confirmEl.focus && confirmEl.focus();
          confirmEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        }
        form.reset();
      }
      /* If a real action ID is set, the code above is skipped and the form
         submits to Formspree normally (which then handles the confirmation). */
    });

    // Clear a field's error as the user corrects it
    ['name', 'phone', 'email', 'message'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () {
        var errEl = document.getElementById('err-' + id);
        if (errEl && errEl.textContent) setError(id, '');
      });
    });
  }
})();
