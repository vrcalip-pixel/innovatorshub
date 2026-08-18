/* ============================================================
   AI Innovators — shared behavior. No dependencies.
   ============================================================ */

/* ---- CONFIGURE ME -------------------------------------------------
   Paste the Google Apps Script Web App URL here after deploying
   form-handler.gs (see README, "Wiring the interest form").
   Until this is filled in, the form shows a friendly fallback
   message with the project email instead of silently failing.
------------------------------------------------------------------- */
var FORM_ENDPOINT = ''; // e.g. 'https://script.google.com/macros/s/AKfy.../exec'

/* Interest-list deadline: October 16, 2026, 10:00 AM Pacific (PDT = UTC-7) */
var DEADLINE = new Date('2026-10-16T10:00:00-07:00');

/* ---- Mobile navigation ---- */
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', function () {
    var open = list.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'Close' : 'Menu';
  });
})();

/* ---- Hero prompt typing ----
   Cycles real prompts a student in this program would write.
   Static first prompt when the visitor prefers reduced motion. */
(function () {
  var line = document.getElementById('prompt-line');
  if (!line) return;

  var prompts = [
    'Help me size the market for a mobile taqueria serving the North Long Beach lunch crowd.',
    'Compare three competitors near the Port and tell me what none of them offer.',
    'Draft a 12-month cash flow for a two-person sneaker resale shop on Pine Ave.',
    'Turn my business plan into a six-slide pitch deck a judge can follow in five minutes.'
  ];

  var caret = '<span class="caret" aria-hidden="true"></span>';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    line.innerHTML = prompts[0] + caret;
    return;
  }

  var p = 0, i = 0, deleting = false;
  function tick() {
    var text = prompts[p];
    i = deleting ? i - 1 : i + 1;
    line.innerHTML = text.slice(0, i) + caret;

    var delay = deleting ? 18 : 34;
    if (!deleting && i === text.length) { deleting = true; delay = 2800; }
    else if (deleting && i === 0) { deleting = false; p = (p + 1) % prompts.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ---- Countdown to the interest-list deadline ---- */
(function () {
  var box = document.getElementById('countdown');
  if (!box) return;

  var closed = document.getElementById('deadline-closed');
  var open_  = document.getElementById('deadline-open');

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function show(el, visible) {
    if (!el) return;
    el.hidden = !visible;
    el.classList[visible ? 'remove' : 'add']('is-hidden');
  }

  function render() {
    var ms = DEADLINE - new Date();

    // Past the deadline: the whole bar becomes the closed notice.
    if (ms <= 0) {
      show(box, false);
      show(open_, false);
      show(closed, true);
      return;
    }

    // Before the deadline: countdown only, no trace of the closed notice.
    show(closed, false);
    show(open_, true);

    var days = Math.floor(ms / 86400000);
    var hrs  = Math.floor(ms % 86400000 / 3600000);
    var mins = Math.floor(ms % 3600000 / 60000);
    var secs = Math.floor(ms % 60000 / 1000);

    box.innerHTML =
      '<li><b>' + days + '</b><span>days</span></li>' +
      '<li><b>' + pad(hrs) + '</b><span>hrs</span></li>' +
      '<li><b>' + pad(mins) + '</b><span>min</span></li>' +
      '<li><b>' + pad(secs) + '</b><span>sec</span></li>';

    setTimeout(render, 1000);
  }
  render();
})();

/* ---- Native forms → Google Sheet ----
   Any <form data-sheet-form> on the page is handled here.
   Submits without leaving the page and without a third-party service. */
(function () {
  var forms = document.querySelectorAll('form[data-sheet-form]');
  if (!forms.length) return;

  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form-status');
    var button = form.querySelector('button[type="submit"]');
    var buttonText = button ? button.textContent : '';

    function say(msg, kind) {
      if (!status) return;
      status.className = 'form-status is-' + kind;
      status.textContent = msg;
      status.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: bots fill hidden fields, people don't.
      var trap = form.querySelector('input[name="_website"]');
      if (trap && trap.value) return;

      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (!FORM_ENDPOINT) {
        say('This form is not connected yet. Please email vcalip@lbcc.edu and we will add you to the list.', 'error');
        return;
      }

      if (button) { button.disabled = true; button.textContent = 'Sending\u2026'; }
      say('Sending\u2026', 'ok');

      var data = new URLSearchParams(new FormData(form));
      data.append('_form', form.getAttribute('data-sheet-form'));
      data.append('_submitted', new Date().toISOString());

      // No custom headers — keeps it a simple request, so no CORS preflight.
      fetch(FORM_ENDPOINT, { method: 'POST', body: data })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok) {
            form.reset();
            say('You\u2019re on the list. Watch your email \u2014 we\u2019ll send registration steps and information session dates.', 'ok');
          } else {
            throw new Error('rejected');
          }
        })
        .catch(function () {
          say('Something went wrong sending that. Please email vcalip@lbcc.edu and we will add you manually.', 'error');
        })
        .then(function () {
          if (button) { button.disabled = false; button.textContent = buttonText; }
        });
    });
  });
})();
