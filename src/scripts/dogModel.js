// @ts-nocheck
import {
  AmbientLight,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  LoopRepeat,
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/controls/OrbitControls.js';

const CONTAINER_ID = 'llamadevs-model-container';

const startDogModel = () => {
  const container = document.getElementById(CONTAINER_ID);

  if (!container || container.dataset.initialized === 'true') return;

  container.dataset.initialized = 'true';

  const scene = new Scene();

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.5, 3.5);
  camera.lookAt(0, 1.05, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.9;
  controls.maxDistance = 3.8;
  controls.target.set(0, 1.05, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;

  scene.add(new AmbientLight(0xffffff, 1));
  const hemi = new HemisphereLight(0xf5e7d8, 0xd8d0c5, 0.9);
  scene.add(hemi);

  const keyLight = new DirectionalLight(0xffffff, 1.35);
  keyLight.position.set(3.2, 5.6, 4.2);

  const fillLight = new DirectionalLight(0xf2ddc4, 0.6);
  fillLight.position.set(-2.4, 3.2, 2.6);

  const rimLight = new DirectionalLight(0xffffff, 0.45);
  rimLight.position.set(0, 4.4, -3.5);

  scene.add(keyLight, fillLight, rimLight);

  const loader = new GLTFLoader();
  const clock = new Clock();

  let mixer;
  let model;
  let frameId;

  const updateRendererSize = () => {
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    if (model) {
      const responsiveScale = Math.max(1.12, width / 590);
      model.scale.setScalar(responsiveScale);
      model.position.set(0, 0, 0);
    }
  };

  loader.load(
    '/models/dog.glb',
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          child.material.color.multiplyScalar(1.0);
          child.material.roughness = Math.min(child.material.roughness ?? 0.6, 0.55);
          child.material.metalness = 0;
          if (child.material.emissive) {
            child.material.emissiveIntensity = 0;
          }
          child.material.needsUpdate = true;
        }
      });

      mixer = new AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.loop = LoopRepeat;
        action.play();
      });

      updateRendererSize();
    },
    undefined,
    (error) => {
      container.innerHTML =
        '<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">No se pudo cargar el modelo 3D.</div>';
      console.error('Error cargando dog.glb', error);
    }
  );

  const renderScene = () => {
    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);
    controls.update();

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(renderScene);
  };

  const handleResize = () => {
    updateRendererSize();
  };

  updateRendererSize();
  renderScene();
  window.addEventListener('resize', handleResize);

  const cleanup = () => {
    if (frameId) cancelAnimationFrame(frameId);
    window.removeEventListener('resize', handleResize);
    controls.dispose();
    renderer.dispose();
    container.innerHTML = '';
    container.dataset.initialized = 'false';
  };

  window.addEventListener('pagehide', cleanup);
  window.addEventListener('pageshow', startDogModel, { once: true });
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startDogModel();
} else {
  window.addEventListener('DOMContentLoaded', startDogModel, { once: true });
}
