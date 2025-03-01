document.getElementById('scan-ar').addEventListener('click', () => {
  document.querySelectorAll('#main-content > div').forEach(el => el.classList.add('hidden'));
  document.getElementById('ar-viewer').classList.remove('hidden');

  const container = document.getElementById('ar-container');
  const loading = document.getElementById('loading');
  let scene, camera, renderer, arSession;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('target-image.jpg', (texture) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, 0, -2);
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      plane.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();
  }, undefined, (error) => {
    loading.innerText = "Ошибка загрузки изображения — проверь файл!";
    console.error("Ошибка:", error);
  });

  if (navigator.xr) {
    navigator.xr.isSessionSupported('immersive-ar').then(supported => {
      if (supported) {
        navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['hit-test'] }).then(session => {
          arSession = session;
          renderer.xr.setSession(session);
          loading.style.display = 'none';

          session.requestReferenceSpace('local').then(refSpace => {
            const hitTestSource = session.requestHitTestSource({ space: refSpace });
            const onFrame = (time, frame) => {
              const pose = frame.getViewerPose(refSpace);
              if (pose) {
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length) {
                  const hit = hitTestResults[0].results[0];
                  const poseMatrix = hit.getPose().transform.matrix;
                  plane.position.setFromMatrixPosition(poseMatrix);
                }
              }
            };
            session.addEventListener('frame', onFrame);
          });
        }).catch(error => {
          loading.innerText = "Ошибка AR: " + error.message;
          console.error(error);
        });
      } else {
        loading.innerText = "AR не поддерживается этим устройством!";
      }
    });
  } else {
    loading.innerText = "WebXR не поддерживается!";
  }

  const isLowEnd = navigator.hardwareConcurrency < 4;
  if (isLowEnd) {
    renderer.setPixelRatio(0.5);
  }
});
