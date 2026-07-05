/* Interactive 3D case-file viewer — Three.js + STLLoader + OrbitControls.
   Loads a real wax-up CAD scan and lets visitors drag to rotate, scroll to
   zoom, toggle auto-rotate / wireframe, and reset the view. Only runs if the
   #stl-viewer mount point exists (home page) and Three.js loaded successfully
   from the CDN. */
(function(){
  var mount = document.getElementById("stl-viewer");
  if(!mount) return;
  if(typeof THREE === "undefined" || !THREE.STLLoader || !THREE.OrbitControls){
    var loadingEl = document.getElementById("stl-loading");
    if(loadingEl){ loadingEl.querySelector("span").textContent = "3D viewer unavailable"; }
    return;
  }

  var shell = mount.closest(".viewer-shell");
  var loadingEl = document.getElementById("stl-loading");
  var autoBtn = document.getElementById("stl-autorotate");
  var wireBtn = document.getElementById("stl-wireframe");
  var resetBtn = document.getElementById("stl-reset");

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 5000);
  var defaultCamPos = new THREE.Vector3(0, 0, 130);
  camera.position.copy(defaultCamPos);

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mount.appendChild(renderer.domElement);

  /* Lighting — warm key light + cool fill, tuned for a gold-metal read */
  scene.add(new THREE.AmbientLight(0x554430, 1.1));
  var key = new THREE.DirectionalLight(0xffe3ac, 1.3);
  key.position.set(4, 6, 8);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x6f7fff, 0.35);
  rim.position.set(-6, -3, -4);
  scene.add(rim);
  var fill = new THREE.PointLight(0xc3a019, 0.6, 0, 2);
  fill.position.set(-5, 4, 6);
  scene.add(fill);

  var solidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd8b158,
    metalness: 0.72,
    roughness: 0.33,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
    reflectivity: 0.5
  });
  var wireMaterial = new THREE.MeshBasicMaterial({ color: 0xe7c17c, wireframe: true, transparent: true, opacity: 0.55 });

  var mesh = null;
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
  loader.load(
    "assets/models/waxup-cad.stl",
    function(geometry){
      geometry.computeVertexNormals();
      mesh = new THREE.Mesh(geometry, solidMaterial);
      mesh.rotation.x = -Math.PI / 2; // most dental STL exports are Z-up; Three.js is Y-up
      scene.add(mesh);
      fitCameraToObject(mesh);
      if(loadingEl) loadingEl.classList.add("is-hidden");
    },
    undefined,
    function(){
      if(loadingEl){ loadingEl.querySelector("span").textContent = "Couldn't load the case file"; }
    }
  );

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
