/* Populates the "Featured Projects" grid on the home page from PROJECTS data. */
(function(){
  var mount = document.getElementById("featured-projects");
  if(!mount || !window.PROJECTS) return;

  var picks = ["full-arch-034", "bridge-006", "mockup-dsd-018", "all-on-x-040"];
  var chosen = [];
  picks.forEach(function(file){
    var found = window.PROJECTS.find(function(p){ return p.file.indexOf(file) !== -1; });
    if(found) chosen.push(found);
  });
  // Fallback: just take first of a few distinct categories
  if(chosen.length < 4){
    var seen = {};
    chosen = [];
    window.PROJECTS.forEach(function(p){
      if(!seen[p.group] && chosen.length < 4){ seen[p.group] = true; chosen.push(p); }
    });
  }

  mount.innerHTML = chosen.map(function(p, i){
    return '<div class="proj-card featured-card" data-reveal style="cursor:default;">' +
      '<div class="proj-thumb"><img src="' + p.file + '" alt="' + p.title + '" loading="lazy"></div>' +
      '<div class="proj-overlay" style="opacity:1; background:linear-gradient(0deg, rgba(10,9,8,.85) 0%, rgba(10,9,8,.05) 60%, transparent 100%);">' +
        '<span class="p-cat">' + p.label + '</span>' +
        '<span class="p-title">' + p.title + '</span>' +
      '</div>' +
    '</div>';
  }).join("");

  // Wrap grid in a link affordance
  mount.querySelectorAll(".proj-card").forEach(function(card){
    card.addEventListener("click", function(){ window.location.href = "projects.html"; });
  });
})();
