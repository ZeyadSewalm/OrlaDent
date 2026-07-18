/* ==========================================================================
   ORLADENT — main.js
   Nav, loader, GSAP reveals, counters, portfolio filter + lightbox, marquee
   ========================================================================== */

(function(){
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined";
  if(hasGSAP && window.ScrollTrigger){ gsap.registerPlugin(ScrollTrigger); }

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", function(){
    var loader = document.querySelector(".loader");
    if(loader){
      setTimeout(function(){ loader.classList.add("is-hidden"); }, 350);
    }
  });

  /* ---------------- Nav scroll state ---------------- */
  var nav = document.querySelector(".nav");
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 40){ nav.classList.add("is-scrolled"); }
    else{ nav.classList.remove("is-scrolled"); }
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileMenu = document.querySelector(".mobile-menu");
  if(toggle && mobileMenu){
    toggle.addEventListener("click", function(){
      toggle.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open");
      document.body.classList.toggle("lock-scroll");
      toggle.setAttribute("aria-expanded", String(toggle.classList.contains("is-open")));
    });
    mobileMenu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        toggle.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("lock-scroll");
      });
    });
  }

  /* ---------------- Active nav link ---------------- */
  var path = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach(function(a){
    var href = a.getAttribute("href");
    if(href === path || (path === "" && href === "index.html")){ a.classList.add("active"); }
  });

  /* ---------------- Hero heading split-line reveal ---------------- */
  document.querySelectorAll(".hero h1 .line span, [data-split] span").forEach(function(span, i){
    if(hasGSAP){
      gsap.set(span, { yPercent: 130, opacity:0 });
    }
  });

  function runIntro(){
    if(!hasGSAP) return;
    var tl = gsap.timeline({ defaults:{ ease:"power4.out" } });
    tl.to(".hero-kicker", { opacity:1, y:0, duration:.8 }, 0.15)
      .to(".hero h1 .line span", { yPercent:0, opacity:1, duration:1.15, stagger:.09 }, 0.25)
      .to(".hero-sub", { opacity:1, y:0, duration:.9 }, "-=0.6")
      .to(".hero-actions", { opacity:1, y:0, duration:.9 }, "-=0.65")
      .to(".hero-stats", { opacity:1, y:0, duration:.9 }, "-=0.6");
  }
  if(hasGSAP){
    gsap.set(".hero-kicker, .hero-sub, .hero-actions, .hero-stats", { opacity:0, y:26 });
  }
  window.addEventListener("DOMContentLoaded", function(){ setTimeout(runIntro, 250); });

  /* ---------------- Scroll reveals ----------------
     bindReveal/bindRevealGroup are idempotent (guarded by a flag on the
     element) so they can safely be called again for content that gets
     injected by other scripts (e.g. featured.js, portfolio.js) — whether
     that happens before or after this file runs. A MutationObserver keeps
     watching after the initial pass so injection order never matters. */
  function bindReveal(el){
    if(el.__revealBound) return;
    el.__revealBound = true;
    if(!hasGSAP){ el.classList.add("is-visible"); return; }
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: function(){ el.classList.add("is-visible"); },
      once: true
    });
  }

  function bindRevealGroup(group){
    if(group.__revealGroupBound) return;
    group.__revealGroupBound = true;
    if(!hasGSAP){
      group.querySelectorAll("[data-reveal]").forEach(function(k){ k.classList.add("is-visible"); });
      return;
    }
    ScrollTrigger.create({
      trigger: group,
      start: "top 85%",
      once:true,
      onEnter: function(){
        group.querySelectorAll("[data-reveal]").forEach(function(k, idx){
          setTimeout(function(){ k.classList.add("is-visible"); }, idx*110);
        });
      }
    });
  }

  function scanReveals(root){
    if(root.matches && root.matches("[data-reveal-group]")) bindRevealGroup(root);
    if(root.matches && root.matches("[data-reveal]")) bindReveal(root);
    if(root.querySelectorAll){
      root.querySelectorAll("[data-reveal-group]").forEach(bindRevealGroup);
      root.querySelectorAll("[data-reveal]").forEach(bindReveal);
    }
  }

  function initReveals(){
    scanReveals(document);

    if(typeof MutationObserver === "undefined") return;
    var observer = new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node.nodeType === 1) scanReveals(node);
        });
      });
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }
  initReveals();

  /* ---------------- Parallax hero media ---------------- */
  if(hasGSAP){
    document.querySelectorAll(".hero-media").forEach(function(media){
      gsap.to(media.querySelector("video, img"), {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: media.closest(".hero"), start:"top top", end:"bottom top", scrub:true }
      });
    });
  }

  /* Journey roadmap now animates continuously via CSS (see .journey-line-run /
     .journey-node keyframes in style.css) rather than scroll-scrubbed JS. */

  /* ---------------- Counters ---------------- */
  document.querySelectorAll("[data-count]").forEach(function(el){
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = (el.getAttribute("data-count").split(".")[1]||"").length;
    var obj = { v:0 };
    var run = function(){
      gsap.to(obj, {
        v: target, duration: 1.8, ease:"power2.out",
        onUpdate: function(){ el.textContent = obj.v.toFixed(decimals); }
      });
    };
    if(hasGSAP){
      ScrollTrigger.create({ trigger: el, start:"top 90%", once:true, onEnter: run });
    } else { el.textContent = target; }
  });

  /* ---------------- Portfolio filter + lightbox ----------------
     Handled entirely by js/portfolio.js on projects.html, since the
     category-carousel markup and the Swiper instances that go with it
     only exist on that page. Keeping that logic co-located with the
     code that builds the sliders avoids two scripts fighting over the
     same DOM. */

  /* ---------------- Marquee duplication for seamless loop ---------------- */
  document.querySelectorAll(".marquee").forEach(function(m){
    m.innerHTML += m.innerHTML;
  });

  /* ---------------- Contact form (real submission via FormSubmit) ----------------
     Posts to the form's own `action` (FormSubmit's AJAX endpoint) with fetch so the
     page never reloads. Only shows the success state once FormSubmit actually
     confirms delivery — never fakes it. Falls back to a real full-page submit
     (removing this listener) if fetch itself is unavailable. */
  var form = document.querySelector(".contact-form");
  if(form){
    var statusEl = form.querySelector(".form-status");
    function tr(key, fallback){ return window.OD_I18N ? window.OD_I18N.t(key) : fallback; }
    function setStatus(msg, kind){
      if(!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.display = "block";
      statusEl.style.color = kind === "error" ? "#e07a6b" : "var(--gold-light)";
      statusEl.style.border = "1px solid " + (kind === "error" ? "rgba(224,122,107,.4)" : "rgba(195,160,25,.35)");
      statusEl.style.background = kind === "error" ? "rgba(224,122,107,.08)" : "rgba(195,160,25,.08)";
    }
    form.addEventListener("submit", function(e){
      if(typeof fetch === "undefined") return; // let the browser submit the form normally
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = tr("contact.form.sendingBtn", "Sending…");
      setStatus(tr("contact.form.sending", "Sending your message…"), "info");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function(res){
        if(!res.ok) throw new Error("Request failed: " + res.status);
        return res.json().catch(function(){ return {}; });
      }).then(function(){
        btn.innerHTML = tr("contact.form.successBtn", "Message Received");
        setStatus(tr("contact.form.success", "Thanks — your message was sent. We'll reply within one business day."), "success");
        form.reset();
      }).catch(function(err){
        btn.innerHTML = tr("contact.form.errorBtn", "Try Again");
        setStatus(tr("contact.form.error", "Something went wrong sending that — please email hello@orladent.com directly, or try again."), "error");
      }).finally(function(){
        setTimeout(function(){ btn.innerHTML = original; btn.disabled = false; }, 3200);
      });
    });
  }

  /* ---------------- Smooth in-page anchor scroll offset ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener("click", function(e){
      var id = a.getAttribute("href");
      if(id.length < 2) return;
      var target = document.querySelector(id);
      if(target){
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top:y, behavior:"smooth" });
      }
    });
  });

})();
