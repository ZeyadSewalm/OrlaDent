/* Interactive 3D case-file viewer — Three.js + STLLoader + OrbitControls.
   Loads real case-file STL scans and lets visitors drag to rotate, scroll to
   zoom, toggle auto-rotate / wireframe, and reset the view. Only runs if the
   #stl-viewer mount point exists (home page) and Three.js loaded successfully
   from the CDN.

   Supports multiple case files: add entries to MODELS below (label + file
   path) and a small pill switcher appears automatically letting visitors
   flip between them. The first entry in the array is the default/primary
   model shown on load; with more than one entry the switcher pills render
   automatically (hidden via CSS when there's only one). */
(function(){
  var mount = document.getElementById("stl-viewer");
  if(!mount) return;
  function tr(key, fallback){ return window.OD_I18N ? window.OD_I18N.t(key) : fallback; }

  if(typeof THREE === "undefined" || !THREE.STLLoader || !THREE.OrbitControls){
    var loadingElEarly = document.getElementById("stl-loading");
    if(loadingElEarly){ loadingElEarly.querySelector("span").textContent = tr("home.viewer.unavailable", "3D viewer unavailable"); }
    return;
  }

  /* ---------------- Case file registry ----------------
     Add more { label, file } entries here as new case files are approved —
     no other code changes needed. The first entry is the default/primary
     model shown on load. */
  var MODELS = [
    { label: "All-on-5 Full Arch, Exocad", file: "assets/models/all-on-5.stl?v=2" },
    { label: "Case 3-3 Design, Exocad", file: "assets/models/case-3-3.stl?v=2" },
    { label: "Complete Denture, Exocad", file: "assets/models/complete-denture.stl?v=2" },
    { label: "Veneer Case, Exocad", file: "assets/models/veneer.stl?v=2" }
  ];

  var loadingEl = document.getElementById("stl-loading");
  var autoBtn = document.getElementById("stl-autorotate");
  var wireBtn = document.getElementById("stl-wireframe");
  var resetBtn = document.getElementById("stl-reset");
  var switcherEl = document.getElementById("stl-switcher");
  var labelEl = document.getElementById("stl-model-label");

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 5000);
  var defaultCamPos = new THREE.Vector3(0, 0, 130);
  camera.position.copy(defaultCamPos);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding || renderer.outputEncoding;
  /* Filmic tone mapping keeps the brighter lighting rig below from blowing
     out highlights while still giving enough dynamic range to read fine
     surface detail (margins, cusps, connector geometry) clearly. */
  if(THREE.ACESFilmicToneMapping){
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  }
  mount.appendChild(renderer.domElement);

  /* ---------------- Lighting ----------------
     Metallic PBR materials read as near-black except for a thin specular
     streak unless there's ambient/environment light to fill in the rest of
     the surface — a classic three.js gotcha. Fixed with: a soft procedural
     environment map (so reflections exist all around, not just where a
     direct light happens to hit), a hemisphere light for broad top/bottom
     fill, and a dedicated front light along the camera's default sightline
     so the model reads clearly the moment the page loads, front-on.
     Intensities are pushed noticeably higher than a typical scene because
     these case files carry fine anatomical detail (margins, occlusal
     anatomy, connector geometry) that needs to stay visible in every area
     of the mesh, not just the parts facing a single key light. */
  scene.add(new THREE.HemisphereLight(0x8a744c, 0x241d12, 2.1));
  scene.add(new THREE.AmbientLight(0x6b5a3c, 1.0));

  var front = new THREE.DirectionalLight(0xfff6e2, 2.6);
  front.position.set(0, 4, 130);
  scene.add(front);

  var key = new THREE.DirectionalLight(0xffedc2, 2.0);
  key.position.set(6, 8, 10);
  scene.add(key);

  var rim = new THREE.DirectionalLight(0x9fb3ff, 0.75);
  rim.position.set(-8, -4, -6);
  scene.add(rim);

  var fill = new THREE.PointLight(0xd8b56a, 1.1, 0, 2);
  fill.position.set(-6, 5, 8);
  scene.add(fill);

  /* Extra top-down soft light so occlusal/incisal surfaces (the details
     that face "up" relative to the camera) don't fall into shadow — the
     rig above is strongest from the front, this one fills the top. */
  var top = new THREE.DirectionalLight(0xffffff, 0.9);
  top.position.set(0, 60, 20);
  scene.add(top);

  /* Small procedural environment map (dark floor -> warm ceiling gradient)
     so the gold material has something soft to reflect on every surface,
     not just the faces facing a direct light. */
  (function addEnvironment(){
    if(typeof THREE.PMREMGenerator === "undefined") return;
    try{
      var pmrem = new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      var c = document.createElement("canvas");
      c.width = 8; c.height = 128;
      var ctx = c.getContext("2d");
      var grad = ctx.createLinearGradient(0, 0, 0, 128);
      grad.addColorStop(0, "#8a7448");
      grad.addColorStop(0.45, "#3c2f1c");
      grad.addColorStop(1, "#140f0a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 8, 128);
      var envTex = new THREE.CanvasTexture(c);
      envTex.mapping = THREE.EquirectangularReflectionMapping;
      var rt = pmrem.fromEquirectangular(envTex);
      scene.environment = rt.texture;
      envTex.dispose();
      pmrem.dispose();
    } catch(e){ /* environment map is a nice-to-have, safe to skip on failure */ }
  })();

  var solidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe4c179,
    metalness: 0.42,
    roughness: 0.3,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    reflectivity: 0.6
  });
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xe7c17c, wireframe: true, transparent: true, opacity: 0.55 });

  var mesh = null;
  var currentIndex = -1;
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.6;
  controls.minDistance = 30;
  controls.maxDistance = 400;
  controls.enablePan = false;

  var userInteracted = false;
  controls.addEventListener("start", function(){
    if(!userInteracted){
      userInteracted = true;
      controls.autoRotate = false;
      if(autoBtn) autoBtn.setAttribute("aria-pressed", "false");
    }
  });

  function fitCameraToObject(object){
    var box = new THREE.Box3().setFromObject(object);
    var size = new THREE.Vector3();
    box.getSize(size);
    var center = new THREE.Vector3();
    box.getCenter(center);

    object.position.sub(center); // center the mesh at the origin

    var maxDim = Math.max(size.x, size.y, size.z);
    var fitDist = (maxDim / 2) / Math.tan((camera.fov * Math.PI / 180) / 2) * 1.6;
    defaultCamPos.set(0, maxDim * 0.12, fitDist);
    camera.position.copy(defaultCamPos);
    camera.near = fitDist / 100;
    camera.far = fitDist * 100;
    camera.updateProjectionMatrix();
    front.position.set(0, maxDim * 0.3, fitDist); // keep the front light on the camera's sightline for any model size
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function resize(){
    var w = mount.clientWidth || 1;
    var h = mount.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener("resize", resize);
  if(typeof ResizeObserver !== "undefined"){
    new ResizeObserver(resize).observe(mount);
  }
  resize();

  var loader = new THREE.STLLoader();

  function loadModel(index){
    if(index === currentIndex || index < 0 || index >= MODELS.length) return;
    var entry = MODELS[index];
    currentIndex = index;

    if(loadingEl){
      loadingEl.querySelector("span").textContent = tr("home.viewer.loading", "Loading case file…");
      loadingEl.classList.remove("is-hidden");
    }
    if(labelEl) labelEl.textContent = entry.label;
    if(switcherEl){
      Array.prototype.forEach.call(switcherEl.children, function(btn, i){
        btn.classList.toggle("is-active", i === index);
      });
    }

    loader.load(
      entry.file,
      function(geometry){
        if(mesh){
          scene.remove(mesh);
          mesh.geometry.dispose();
        }
        geometry.computeVertexNormals();
        mesh = new THREE.Mesh(geometry, wireBtn && wireBtn.getAttribute("aria-pressed") === "true" ? wireMaterial : solidMaterial);
        mesh.rotation.x = -Math.PI / 2; // most dental STL exports are Z-up; Three.js is Y-up
        scene.add(mesh);
        fitCameraToObject(mesh);
        userInteracted = false;
        controls.autoRotate = true;
        if(autoBtn) autoBtn.setAttribute("aria-pressed", "true");
        if(loadingEl) loadingEl.classList.add("is-hidden");
      },
      undefined,
      function(){
        if(loadingEl){ loadingEl.querySelector("span").textContent = tr("home.viewer.loadError", "Couldn't load the case file"); }
      }
    );
  }

  /* Build the switcher only when there's more than one case file — with a
     single entry it stays empty and CSS hides it entirely. */
  if(switcherEl && MODELS.length > 1){
    MODELS.forEach(function(entry, i){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = entry.label.split(",")[0].split("·")[0].trim() || ("Case " + (i + 1));
      btn.addEventListener("click", function(){ loadModel(i); });
      switcherEl.appendChild(btn);
    });
  }

  loadModel(0);

  if(autoBtn){
    autoBtn.addEventListener("click", function(){
      controls.autoRotate = !controls.autoRotate;
      userInteracted = !controls.autoRotate;
      autoBtn.setAttribute("aria-pressed", String(controls.autoRotate));
    });
  }
  if(wireBtn){
    wireBtn.addEventListener("click", function(){
      if(!mesh) return;
      var toWire = mesh.material === solidMaterial;
      mesh.material = toWire ? wireMaterial : solidMaterial;
      wireBtn.setAttribute("aria-pressed", String(toWire));
    });
  }
  if(resetBtn){
    resetBtn.addEventListener("click", function(){
      camera.position.copy(defaultCamPos);
      controls.target.set(0, 0, 0);
      controls.autoRotate = true;
      userInteracted = false;
      if(autoBtn) autoBtn.setAttribute("aria-pressed", "true");
      controls.update();
    });
  }

  (function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();
})();
