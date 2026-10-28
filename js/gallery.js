/* ==========================================================================
   Gallery page — "Flight Log"
   Vanilla JS, loaded only on gallery.html (after main.js).

   ---------------------------------------------------------------------
   REPLACING PLACEHOLDER PHOTOS
   Every entry in GALLERY_ITEMS below has a `file` pointing at
   images/gallery/<filename>.jpg. Nothing exists at that path yet, so
   every frame shows a generated placeholder pattern with its category
   icon and expected filename printed on it. To swap in a real photo,
   just add a file with that exact name to images/gallery/ — no code
   or markup changes needed, the placeholder disappears automatically
   as soon as the image loads successfully.
   To add, remove, or reorder photos, edit the GALLERY_ITEMS array —
   each object is one frame in the wall.
   ---------------------------------------------------------------------
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Category catalogue — id, display label, placeholder tint (hue),
   * and a small line icon shown on unresolved placeholder tiles.
   * ------------------------------------------------------------------ */
  var CATEGORIES = [
    {
      id: 'uav-missions', label: 'UAV Missions', hue: 195,
      icon: '<rect x="9" y="9" width="6" height="6" rx="1.2"/><line x1="9" y1="9" x2="4.5" y2="4.5"/><line x1="15" y1="9" x2="19.5" y2="4.5"/><line x1="9" y1="15" x2="4.5" y2="19.5"/><line x1="15" y1="15" x2="19.5" y2="19.5"/><circle cx="4.5" cy="4.5" r="2"/><circle cx="19.5" cy="4.5" r="2"/><circle cx="4.5" cy="19.5" r="2"/><circle cx="19.5" cy="19.5" r="2"/>'
    },
    {
      id: 'crop-health', label: 'Crop Health Monitoring', hue: 142,
      icon: '<path d="M5 20c8 0 14-6 14-14 0-.7-.05-1.3-.1-2C10.5 4.5 5 10 5 18c0 .7.03 1.3.1 2z"/><path d="M5 20c3-5 6-8 12-11"/>'
    },
    {
      id: 'research', label: 'Research', hue: 265,
      icon: '<path d="M9 3h6"/><path d="M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M7.5 15h9"/>'
    },
    {
      id: 'aircraft-design', label: 'Aircraft Design', hue: 210,
      icon: '<path d="M3 15c4-6 14-8 18-4-4 3-13 3-18 4z"/><line x1="6.5" y1="17.5" x2="18.5" y2="17.5" stroke-dasharray="1.6 2.6"/>'
    },
    {
      id: 'internship', label: 'Internship', hue: 30,
      icon: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>'
    },
    {
      id: 'events', label: 'Events', hue: 328,
      icon: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8"/><path d="M12 16v4"/><path d="M7 9.5l3 2 2-3 3 2.5"/>'
    },
    {
      id: 'personal-photography', label: 'Personal Photography', hue: 16,
      icon: '<path d="M4 8h3l1.5-2h7L17 8h3a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8z"/><circle cx="12" cy="14" r="3.5"/>'
    }
  ];

  /* ------------------------------------------------------------------ *
   * The wall itself. `file` is the placeholder filename this frame is
   * waiting for inside images/gallery/. `size` cycles through the mosaic
   * spans defined in gallery-journey.css.
   * ------------------------------------------------------------------ */
  var SIZE_CYCLE = ['', 'fl-s-wide', '', 'fl-s-tall', '', '', 'fl-s-big', '', 'fl-s-wide', '', 'fl-s-tall', ''];

  var GALLERY_ITEMS = [
    // NEW PHOTO GOES HERE: paste one new line below this note (see EDIT-GUIDE.html)
    { category: 'uav-missions', title: 'Autonomous survey flight over a test field', caption: 'Waypoint-following mapping pass, flown on autopilot to cross-check GPS track against the planned grid.', file: 'uav-missions-01.jpg' },
    { category: 'crop-health', title: 'Multispectral pass over a wheat test plot', caption: 'Capturing NIR and red-edge bands for an NDVI comparison across irrigation zones.', file: 'crop-health-01.jpg' },
    { category: 'research', title: 'Processing flight imagery into an orthomosaic', caption: 'Stitching overlapping frames from a mapping flight into a single georeferenced image.', file: 'research-01.jpg' },
    { category: 'aircraft-design', title: 'Wind-tunnel test of a scaled wing section', caption: 'Checking lift and stall behaviour on a test airfoil before it goes into a full airframe.', file: 'aircraft-design-01.jpg' },
    { category: 'internship', title: 'First week on the aerospace internship floor', caption: 'Getting oriented on the bench setup and the team’s testing workflow.', file: 'internship-01.jpg' },
    { category: 'events', title: 'Presenting a poster at a research conference', caption: 'Walking attendees through the mapping pipeline and early field results.', file: 'events-01.jpg' },
    { category: 'personal-photography', title: 'Golden hour over the Kathmandu valley', caption: 'Shot on a weekend hike above the valley, just as the haze caught the light.', file: 'personal-photography-01.jpg' },

    { category: 'uav-missions', title: 'Pre-flight checklist on the launch pad', caption: 'Running through control surfaces, battery voltage, and GPS lock before takeoff.', file: 'uav-missions-02.jpg' },
    { category: 'crop-health', title: 'Ground-truthing canopy health with a handheld sensor', caption: 'Cross-checking aerial NDVI readings against on-the-ground chlorophyll measurements.', file: 'crop-health-02.jpg' },
    { category: 'research', title: 'Annotating a dataset for a computer vision model', caption: 'Labelling crop-row imagery to train a segmentation model for field boundaries.', file: 'research-02.jpg' },
    { category: 'aircraft-design', title: 'CAD layout of an airframe on the workbench', caption: 'Reviewing a fuselage layout against printed structural components.', file: 'aircraft-design-02.jpg' },
    { category: 'internship', title: 'Systems briefing with the internship team', caption: 'Working through subsystem integration notes ahead of a test.', file: 'internship-02.jpg' },
    { category: 'events', title: 'Panel discussion at a UAV & robotics workshop', caption: 'A morning session on autonomous flight and applied remote sensing.', file: 'events-02.jpg' },
    { category: 'personal-photography', title: 'Long exposure of city lights from a rooftop', caption: 'A quiet night frame, tripod-mounted, somewhere between projects.', file: 'personal-photography-02.jpg' },

    { category: 'uav-missions', title: 'Fixed-wing UAV mid-launch, hand-toss takeoff', caption: 'Hand-launching a fixed-wing platform for a long-endurance mapping run.', file: 'uav-missions-03.jpg' },
    { category: 'crop-health', title: 'Comparing healthy and stressed rows from altitude', caption: 'A single pass showing visible contrast between well-irrigated and drought-stressed rows.', file: 'crop-health-03.jpg' },
    { category: 'research', title: 'Presenting orthomosaic outputs to the research group', caption: 'Walking the group through a stitched field map and flagging problem zones.', file: 'research-03.jpg' },
    { category: 'aircraft-design', title: '3D-printed structural component, fresh off the printer', caption: 'A rib section for a test wing, printed for a quick fit check.', file: 'aircraft-design-03.jpg' },
    { category: 'internship', title: 'Hands-on with lab equipment during the internship', caption: 'Getting familiar with test instrumentation on the bench.', file: 'internship-03.jpg' },
    { category: 'events', title: 'Demo booth at a university tech showcase', caption: 'Showing a live mapping demo to visitors between talks.', file: 'events-03.jpg' },
    { category: 'personal-photography', title: 'Morning mist over the hills on a weekend hike', caption: 'An early start above the cloud line, camera in hand instead of a drone.', file: 'personal-photography-03.jpg' },

    { category: 'uav-missions', title: 'Manual calibration flight before a mapping run', caption: 'A short manual flight to check trim and control response before switching to autopilot.', file: 'uav-missions-04.jpg' },
    { category: 'crop-health', title: 'Early-growth-stage NDVI capture', caption: 'One of the season’s first passes, used as a baseline for later comparisons.', file: 'crop-health-04.jpg' },
    { category: 'research', title: 'Whiteboard session on a flight-planning algorithm', caption: 'Sketching out coverage logic for an adaptive flight-path planner.', file: 'research-04.jpg' },
    { category: 'aircraft-design', title: 'Balancing a fixed-wing airframe before its maiden flight', caption: 'Checking centre of gravity before the first test flight of a new build.', file: 'aircraft-design-04.jpg' },
    { category: 'internship', title: 'Internship cohort at the year-end review', caption: 'Wrapping up the internship with a final presentation to the team.', file: 'internship-04.jpg' },
    { category: 'events', title: 'Networking session between conference talks', caption: 'Catching up with other researchers between sessions.', file: 'events-04.jpg' },
    { category: 'personal-photography', title: 'Street frame from an evening walk', caption: 'An off-duty frame, no flight plan involved.', file: 'personal-photography-04.jpg' }
  ];

  var categoryById = {};
  CATEGORIES.forEach(function (c) { categoryById[c.id] = c; });

  var els = {};
  var visibleOrder = []; // ids (indices into GALLERY_ITEMS) of frames matching the current filter, in DOM order
  var currentFilter = 'all';
  var viewerIndex = -1;
  var lastTrigger = null;

  /* ------------------------------------------------------------------ *
   * Build: filter bar
   * ------------------------------------------------------------------ */
  function renderFilters() {
    var counts = { all: GALLERY_ITEMS.length };
    CATEGORIES.forEach(function (c) { counts[c.id] = 0; });
    GALLERY_ITEMS.forEach(function (it) { counts[it.category]++; });

    var frag = document.createDocumentFragment();

    var allBtn = makeFilterBtn('all', 'All', counts.all, true);
    frag.appendChild(allBtn);

    CATEGORIES.forEach(function (c) {
      frag.appendChild(makeFilterBtn(c.id, c.label, counts[c.id], false));
    });

    els.filters.appendChild(frag);
  }

  function makeFilterBtn(id, label, count, active) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fl-filter-btn' + (active ? ' is-active' : '');
    btn.setAttribute('data-filter', id);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(active));
    btn.innerHTML = label + ' <span class="fl-filter-n">' + count + '</span>';
    btn.addEventListener('click', function () { applyFilter(id, btn); });
    return btn;
  }

  /* ------------------------------------------------------------------ *
   * Build: mosaic wall
   * ------------------------------------------------------------------ */
  function renderGrid() {
    var frag = document.createDocumentFragment();

    GALLERY_ITEMS.forEach(function (item, index) {
      var cat = categoryById[item.category];
      var sizeClass = SIZE_CYCLE[index % SIZE_CYCLE.length];
      var code = 'WP-' + String(index + 1).padStart(3, '0');

      var article = document.createElement('div');
      article.className = 'fl-item' + (sizeClass ? ' ' + sizeClass : '');
      article.setAttribute('data-category', item.category);
      article.setAttribute('data-index', String(index));

      var revealWrap = document.createElement('div');
      revealWrap.className = 'fl-reveal';
      revealWrap.style.transitionDelay = (reduceMotion ? 0 : (index % 6) * 0.06) + 's';

      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'fl-card';
      card.setAttribute('data-index', String(index));
      card.setAttribute('aria-label', 'Open frame ' + code + ': ' + item.title);

      var frame = document.createElement('span');
      frame.className = 'fl-frame';

      var img = document.createElement('img');
      img.alt = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = 'images/gallery/' + item.file;
      img.addEventListener('error', function () {
        frame.classList.add('is-missing');
        img.remove();
        frame.appendChild(buildPlaceholder(cat, item.file));
      }, { once: true });
      frame.appendChild(img);

      var sweep = document.createElement('span');
      sweep.className = 'fl-sweep';
      sweep.setAttribute('aria-hidden', 'true');

      var chip = document.createElement('span');
      chip.className = 'fl-chip';
      chip.textContent = code;

      var meta = document.createElement('span');
      meta.className = 'fl-meta';
      meta.innerHTML =
        '<span class="fl-meta-top"><span class="fl-meta-code">' + code + '</span>' +
        '<span class="fl-meta-cat">' + cat.label + '</span></span>' +
        '<h3>' + item.title + '</h3>';

      card.appendChild(frame);
      card.appendChild(sweep);
      card.appendChild(chip);
      card.appendChild(meta);
      card.addEventListener('click', function () { openViewer(index); });

      revealWrap.appendChild(card);
      article.appendChild(revealWrap);
      frag.appendChild(article);
    });

    els.grid.appendChild(frag);
  }

  function buildPlaceholder(cat, filename) {
    var ph = document.createElement('span');
    ph.className = 'fl-placeholder';
    ph.style.setProperty('--ph-hue', String(cat.hue));
    ph.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + cat.icon + '</svg>' +
      '<span class="fl-placeholder-label">' + cat.label + '<code>images/gallery/' + filename + '</code></span>';
    return ph;
  }

  /* ------------------------------------------------------------------ *
   * Scroll-reveal for mosaic tiles
   * ------------------------------------------------------------------ */
  function initReveal() {
    var items = els.grid.querySelectorAll('.fl-reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Filtering
   * ------------------------------------------------------------------ */
  function applyFilter(filterId, triggerBtn) {
    if (filterId === currentFilter) return;
    currentFilter = filterId;

    els.filters.querySelectorAll('.fl-filter-btn').forEach(function (b) {
      var active = b === triggerBtn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });

    var items = els.grid.querySelectorAll('.fl-item');
    var toHide = [];
    var toShow = [];

    items.forEach(function (el) {
      var matches = filterId === 'all' || el.getAttribute('data-category') === filterId;
      var currentlyHidden = el.classList.contains('fl-hidden');
      if (matches && currentlyHidden) toShow.push(el);
      if (!matches && !currentlyHidden) toHide.push(el);
    });

    if (reduceMotion) {
      toHide.forEach(function (el) { el.classList.add('fl-hidden'); });
      toShow.forEach(function (el) { el.classList.remove('fl-hidden'); });
    } else {
      toHide.forEach(function (el) {
        el.classList.add('fl-filtering-out');
        window.setTimeout(function () {
          el.classList.add('fl-hidden');
          el.classList.remove('fl-filtering-out');
        }, 290);
      });
      toShow.forEach(function (el) {
        el.classList.remove('fl-hidden');
        el.classList.add('fl-filtering-in');
        window.setTimeout(function () { el.classList.remove('fl-filtering-in'); }, 520);
      });
    }

    updateVisibleOrder();
    updateCount();
  }

  function updateVisibleOrder() {
    visibleOrder = [];
    els.grid.querySelectorAll('.fl-item').forEach(function (el) {
      if (!el.classList.contains('fl-hidden')) {
        visibleOrder.push(parseInt(el.getAttribute('data-index'), 10));
      }
    });
  }

  function updateCount() {
    var n = currentFilter === 'all' ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(function (it) { return it.category === currentFilter; }).length;
    els.count.innerHTML = '<strong>' + n + '</strong> frame' + (n === 1 ? '' : 's');
    els.empty.classList.toggle('is-visible', n === 0);
  }

  /* ------------------------------------------------------------------ *
   * Fullscreen viewer
   * ------------------------------------------------------------------ */
  function openViewer(index) {
    updateVisibleOrder();
    if (visibleOrder.indexOf(index) === -1) {
      // filtered out somehow (shouldn't happen from a live click) — fall back
      visibleOrder = GALLERY_ITEMS.map(function (_, i) { return i; });
    }
    viewerIndex = index;
    lastTrigger = document.activeElement;

    renderViewerFrame(true);
    els.viewer.classList.add('is-open');
    els.viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('fl-viewer-open');
    els.viewerClose.focus();

    document.addEventListener('keydown', onViewerKeydown);
    els.viewerStage.addEventListener('touchstart', onTouchStart, { passive: true });
    els.viewerStage.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  function closeViewer() {
    els.viewer.classList.remove('is-open');
    els.viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fl-viewer-open');
    document.removeEventListener('keydown', onViewerKeydown);
    els.viewerStage.removeEventListener('touchstart', onTouchStart);
    els.viewerStage.removeEventListener('touchend', onTouchEnd);
    if (lastTrigger && typeof lastTrigger.focus === 'function') lastTrigger.focus();
  }

  function stepViewer(dir) {
    var pos = visibleOrder.indexOf(viewerIndex);
    if (pos === -1) pos = 0;
    pos = (pos + dir + visibleOrder.length) % visibleOrder.length;
    viewerIndex = visibleOrder[pos];
    renderViewerFrame(false);
  }

  function renderViewerFrame(immediate) {
    var item = GALLERY_ITEMS[viewerIndex];
    var cat = categoryById[item.category];
    var code = 'WP-' + String(viewerIndex + 1).padStart(3, '0');
    var pos = visibleOrder.indexOf(viewerIndex);

    els.viewerFrame.innerHTML = '';
    var img = document.createElement('img');
    img.alt = item.title;
    img.decoding = 'async';
    img.addEventListener('load', function () { img.classList.add('is-shown'); });
    img.addEventListener('error', function () {
      img.remove();
      var ph = buildPlaceholder(cat, item.file);
      ph.classList.add('fl-placeholder');
      els.viewerFrame.appendChild(ph);
      window.requestAnimationFrame(function () { ph.style.opacity = '1'; });
    }, { once: true });
    els.viewerFrame.appendChild(img);
    img.src = 'images/gallery/' + item.file;
    if (immediate || reduceMotion) {
      window.requestAnimationFrame(function () { img.classList.add('is-shown'); });
    }

    els.viewerIndex.textContent = String(pos + 1).padStart(2, '0') + ' / ' + String(visibleOrder.length).padStart(2, '0');
    els.viewerCode.textContent = code;
    els.viewerCat.textContent = cat.label;
    els.viewerTitle.textContent = item.title;
    els.viewerDesc.textContent = item.caption;
    els.viewerCounterFill.style.width = (((pos + 1) / visibleOrder.length) * 100) + '%';
  }

  function onViewerKeydown(e) {
    if (e.key === 'Escape') { closeViewer(); return; }
    if (e.key === 'ArrowLeft') { stepViewer(-1); return; }
    if (e.key === 'ArrowRight') { stepViewer(1); return; }
    if (e.key === 'Tab') {
      // Minimal focus trap across the three interactive controls.
      var focusable = [els.viewerPrev, els.viewerNext, els.viewerClose];
      var idx = focusable.indexOf(document.activeElement);
      e.preventDefault();
      var nextIdx;
      if (e.shiftKey) {
        nextIdx = idx <= 0 ? focusable.length - 1 : idx - 1;
      } else {
        nextIdx = idx === -1 || idx === focusable.length - 1 ? 0 : idx + 1;
      }
      focusable[nextIdx].focus();
    }
  }

  var touchStartX = null;
  function onTouchStart(e) {
    touchStartX = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 46) stepViewer(dx > 0 ? -1 : 1);
    touchStartX = null;
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  function init() {
    els.grid = document.getElementById('fl-grid');
    els.filters = document.getElementById('fl-filters');
    els.count = document.getElementById('fl-count');
    els.empty = document.getElementById('fl-empty');
    els.viewer = document.getElementById('fl-viewer');
    if (!els.grid || !els.filters || !els.viewer) return;

    els.viewerFrame = document.getElementById('fl-viewer-frame');
    els.viewerClose = document.getElementById('fl-viewer-close');
    els.viewerPrev = document.getElementById('fl-viewer-prev');
    els.viewerNext = document.getElementById('fl-viewer-next');
    els.viewerBackdrop = els.viewer.querySelector('.fl-viewer-backdrop');
    els.viewerIndex = document.getElementById('fl-viewer-index');
    els.viewerCode = document.getElementById('fl-viewer-code');
    els.viewerCat = document.getElementById('fl-viewer-cat');
    els.viewerTitle = document.getElementById('fl-viewer-title');
    els.viewerDesc = document.getElementById('fl-viewer-desc');
    els.viewerStage = els.viewer.querySelector('.fl-viewer-stage');
    els.viewerCounterFill = document.getElementById('fl-viewer-counter-fill');

    renderFilters();
    renderGrid();
    updateVisibleOrder();
    updateCount();
    initReveal();

    els.viewerClose.addEventListener('click', closeViewer);
    els.viewerBackdrop.addEventListener('click', closeViewer);
    els.viewerPrev.addEventListener('click', function () { stepViewer(-1); });
    els.viewerNext.addEventListener('click', function () { stepViewer(1); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
