/* Renders one Swiper carousel per category on projects.html from window.PROJECTS,
   wires up the existing category filter buttons, and drives a lightbox that reads
   straight from the data array (so it's immune to Swiper's slide-duplication in
   loop mode). */
(function(){
  var mount = document.getElementById("portfolio-sliders");
  if(!mount || !window.PROJECTS) return;

  var GROUPS = [
    { key:"crowns",     label:"Crowns & Inlays" },
    { key:"bridges",    label:"Bridges" },
    { key:"esthetic",   label:"Esthetic Design" },
    { key:"fullarch",   label:"Full Arch & Implant" },
    { key:"surgical",   label:"Surgical Guides" },
    { key:"appliances", label:"Appliances" },
    { key:"ibar",       label:"I-Bar 13" }
  ];

  var countEl = document.getElementById("portfolio-count");
  if(countEl) countEl.textContent = window.PROJECTS.length;

  function esc(s){ return (s || "").replace(/"/g, "&quot;"); }

  function cardHTML(p){
    return (
      '<div class="proj-card" data-id="' + p.id + '" data-group="' + p.group + '" data-cat="' + esc(p.label) + '" data-title="' + esc(p.title) + '">' +
        '<div class="slide-frame"><img src="' + p.file + '" alt="' + esc(p.title) + ' — ' + esc(p.label) + '" loading="lazy"></div>' +
        '<span class="zoom-ic"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg></span>' +
        '<div class="proj-overlay">' +
          '<span class="p-cat">' + esc(p.label) + '</span>' +
          '<span class="p-title">' + esc(p.title) + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  var html = "";
  GROUPS.forEach(function(g){
    var items = window.PROJECTS.filter(function(p){ return p.group === g.key; });
    if(!items.length) return;
    html +=
      '<div class="category-slider" data-group="' + g.key + '" data-reveal>' +
        '<div class="cat-slider-head"><h3>' + g.label + '</h3><span class="count">' + items.length + ' Files</span></div>' +
        '<div class="slider-shell">' +
          '<button class="slider-nav prev" aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>' +
          '<div class="swiper">' +
            '<div class="swiper-wrapper">' +
              items.map(function(p){ return '<div class="swiper-slide">' + cardHTML(p) + '</div>'; }).join("") +
            '</div>' +
          '</div>' +
          '<button class="slider-nav next" aria-label="Next"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>' +
          '<div class="swiper-pagination slider-dots"></div>' +
        '</div>' +
      '</div>';
  });
  mount.innerHTML = html;

  /* ---------------- Init a Swiper per category ----------------
     `observer`/`observeParents` make each Swiper watch its own DOM (and its
     parents') for size/visibility changes and re-measure itself automatically —
     without this, a carousel that gets hidden via `display:none` (by the
     category filter) and shown again keeps the slide widths it measured the
     very first time, so slides can end up stuck off-screen or the section
     renders blank. We also keep a handle to every instance so the filter
     handler can pause autoplay on hidden categories and force a fresh
     `update()` + restart on the one being shown. */
  var swipers = {};
  if(typeof Swiper !== "undefined"){
    document.querySelectorAll(".category-slider").forEach(function(section){
      var count = section.querySelectorAll(".swiper-slide").length;
      var max = Math.max(1, count - 1); // keep slidesPerView < slide count so loop mode stays clean
      var instance = new Swiper(section.querySelector(".swiper"), {
        loop: count > 1,
        spaceBetween: 20,
        slidesPerView: 1,
        speed: 600,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        autoplay: { delay: 2800, disableOnInteraction: false, pauseOnMouseEnter: true },
        navigation: {
          nextEl: section.querySelector(".slider-nav.next"),
          prevEl: section.querySelector(".slider-nav.prev")
        },
        pagination: {
          el: section.querySelector(".swiper-pagination"),
          clickable: true
        },
        breakpoints: {
          0:    { slidesPerView: 1 },
          640:  { slidesPerView: Math.min(2, max) },
          1024: { slidesPerView: Math.min(3, max) },
          1440: { slidesPerView: Math.min(4, max) }
        }
      });
      swipers[section.getAttribute("data-group")] = instance;
    });

    /* Belt-and-suspenders: re-measure every slider once everything (fonts,
       images) has actually finished loading, in case anything was still
       shifting layout when Swiper first measured it. */
    window.addEventListener("load", function(){
      Object.keys(swipers).forEach(function(key){ swipers[key].update(); });
    });
  }

  /* ---------------- Category filter ---------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var sliderSections = document.querySelectorAll(".category-slider");
  function applyFilter(f){
    filterBtns.forEach(function(b){ b.classList.toggle("active", b.getAttribute("data-filter") === f); });
    sliderSections.forEach(function(section){
      var group = section.getAttribute("data-group");
      var match = (f === "all" || group === f);
      section.classList.toggle("is-hidden", !match);

      var instance = swipers[group];
      if(!instance) return;
      if(match){
        /* becoming visible: force a fresh measurement, then resume */
        instance.update();
        if(instance.autoplay) instance.autoplay.start();
      } else {
        /* going hidden: stop autoplay so it isn't animating an invisible,
           zero-size track */
        if(instance.autoplay) instance.autoplay.stop();
      }
    });
  }
  filterBtns.forEach(function(btn){
    btn.addEventListener("click", function(){ applyFilter(btn.getAttribute("data-filter")); });
  });

  /* Deep-link support: services.html links to projects.html?cat=esthetic
     (etc.) so a visitor arriving from a service page lands pre-filtered
     to just that category instead of the full "All Work" view. */
  var params = new URLSearchParams(window.location.search);
  var catParam = params.get("cat");
  if(catParam && document.querySelector('.filter-btn[data-filter="' + catParam + '"]')){
    applyFilter(catParam);
    var section = document.getElementById("portfolio-sliders");
    if(section){ window.addEventListener("load", function(){ section.scrollIntoView({ behavior:"smooth", block:"start" }); }); }
  }

  /* ---------------- Lightbox (data-driven, ignores Swiper's DOM clones) ---------------- */
  var lightbox = document.querySelector(".lightbox");
  if(lightbox){
    var lbImg = lightbox.querySelector("img");
    var lbCatEl = lightbox.querySelector(".lb-cat");
    var lbTitleEl = lightbox.querySelector(".lb-title");
    var activeList = [];
    var activeIndex = 0;

    function showCurrent(){
      var p = activeList[activeIndex];
      if(!p) return;
      lbImg.src = p.file;
      lbImg.alt = p.title;
      if(lbCatEl) lbCatEl.textContent = p.label;
      if(lbTitleEl) lbTitleEl.textContent = p.title;
    }
    function openById(id){
      var clicked = window.PROJECTS.find(function(p){ return p.id === id; });
      if(!clicked) return;
      activeList = window.PROJECTS.filter(function(p){ return p.group === clicked.group; });
      activeIndex = activeList.findIndex(function(p){ return p.id === id; });
      showCurrent();
      lightbox.classList.add("is-open");
      document.body.classList.add("lock-scroll");
    }
    function close(){
      lightbox.classList.remove("is-open");
      document.body.classList.remove("lock-scroll");
    }

    /* Delegated click so it works for Swiper's duplicated loop-mode slides too */
    mount.addEventListener("click", function(e){
      var card = e.target.closest(".proj-card");
      if(!card) return;
      var id = parseInt(card.getAttribute("data-id"), 10);
      openById(id);
    });

    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    if(closeBtn) closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function(e){ if(e.target === lightbox) close(); });
    if(prevBtn) prevBtn.addEventListener("click", function(){
      activeIndex = (activeIndex - 1 + activeList.length) % activeList.length;
      showCurrent();
    });
    if(nextBtn) nextBtn.addEventListener("click", function(){
      activeIndex = (activeIndex + 1) % activeList.length;
      showCurrent();
    });
    document.addEventListener("keydown", function(e){
      if(!lightbox.classList.contains("is-open")) return;
      if(e.key === "Escape") close();
      if(e.key === "ArrowLeft" && prevBtn) prevBtn.click();
      if(e.key === "ArrowRight" && nextBtn) nextBtn.click();
    });
  }

  document.dispatchEvent(new CustomEvent("portfolio:rendered"));
})();
