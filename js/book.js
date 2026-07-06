/* Interactive "Services Book" — page-flip style navigation for services.html.
   Cover (page 0) + one page per service (1-6). Prev/Next arrows animate the
   outgoing page away and the incoming page in with a subtle rotateY tilt so
   it reads as a page turning, without needing drag physics or a library.
   Deep-links (services.html#crown etc.) open the book straight to that page. */
(function(){
  var book = document.getElementById("services-book");
  if(!book) return;

  var pages = Array.prototype.slice.call(book.querySelectorAll(".book-page"));
  var prevBtn = document.getElementById("book-prev");
  var nextBtn = document.getElementById("book-next");
  var indicator = document.getElementById("book-cur");
  var total = pages.length;
  var current = 0;
  var animating = false;
  var DURATION = 650;

  function labelFor(i){ return i === 0 ? "Cover" : (i + " / " + (total - 1)); }

  function updateControls(){
    if(indicator) indicator.textContent = labelFor(current);
    if(prevBtn) prevBtn.disabled = current === 0;
    if(nextBtn) nextBtn.disabled = current === total - 1;
  }

  function setInstant(index){
    pages.forEach(function(p, i){
      p.style.transition = "none";
      if(i === index){
        p.classList.add("is-active");
        p.style.opacity = "1";
        p.style.visibility = "visible";
        p.style.transform = "none";
        p.style.zIndex = "3";
      } else {
        p.classList.remove("is-active");
        p.style.opacity = "0";
        p.style.visibility = "hidden";
        p.style.zIndex = "1";
      }
    });
    // force reflow, then restore transitions for future navigation
    void book.offsetHeight;
    pages.forEach(function(p){ p.style.transition = ""; });
    current = index;
    updateControls();
  }

  function goTo(index){
    if(animating || index === current || index < 0 || index > total - 1) return;
    animating = true;
    var direction = index > current ? 1 : -1;
    var outgoing = pages[current];
    var incoming = pages[index];

    incoming.style.transition = "none";
    incoming.style.visibility = "visible";
    incoming.style.opacity = "0";
    incoming.style.zIndex = "3";
    incoming.style.transform = "rotateY(" + (direction > 0 ? "12deg" : "-12deg") + ") translateX(" + (direction > 0 ? "40px" : "-40px") + ")";
    outgoing.style.zIndex = "2";

    void incoming.offsetHeight; // force reflow before enabling transition

    incoming.style.transition = "";
    incoming.classList.add("is-active");
    incoming.style.opacity = "1";
    incoming.style.transform = "none";

    outgoing.style.opacity = "0";
    outgoing.style.transform = "rotateY(" + (direction > 0 ? "-12deg" : "12deg") + ") translateX(" + (direction > 0 ? "-40px" : "40px") + ")";

    setTimeout(function(){
      outgoing.classList.remove("is-active");
      outgoing.style.visibility = "hidden";
      outgoing.style.transform = "none";
      current = index;
      animating = false;
      updateControls();
    }, DURATION);
  }

  if(prevBtn) prevBtn.addEventListener("click", function(){ goTo(current - 1); });
  if(nextBtn) nextBtn.addEventListener("click", function(){ goTo(current + 1); });

  document.addEventListener("keydown", function(e){
    var rect = book.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if(!inView) return;
    if(e.key === "ArrowRight") goTo(current + 1);
    if(e.key === "ArrowLeft") goTo(current - 1);
  });

  // Deep-link support: services.html#crown etc. opens straight to that page.
  var hash = (window.location.hash || "").replace("#", "");
  var deepIndex = -1;
  pages.forEach(function(p, i){ if(p.id === hash) deepIndex = i; });

  setInstant(deepIndex > -1 ? deepIndex : 0);
})();
