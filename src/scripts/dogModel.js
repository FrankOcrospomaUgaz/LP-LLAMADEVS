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
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const CONTAINER_ID = 'llamadevs-model-container';

const startDogModel = () => {
  const container = document.getElementById(CONTAINER_ID);

  if (!container || container.dataset.initialized === 'true') return;

  container.dataset.initialized = 'true';

  const scene = new Scene();

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.35, 3.5);
  camera.lookAt(0, 0.85, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 1.9;
  controls.maxDistance = 3.8;
  controls.target.set(0, 0.85, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.7;

  scene.add(new AmbientLight(0xffffff, 1.4));
  const hemi = new HemisphereLight(0xfff7e8, 0xf2e5d6, 1.1);
  scene.add(hemi);

  const keyLight = new DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(3.2, 5.6, 4.2);

  const fillLight = new DirectionalLight(0xfff3e1, 0.8);
  fillLight.position.set(-2.4, 3.2, 2.6);

  const rimLight = new DirectionalLight(0xffffff, 0.6);
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
      const responsiveScale = Math.max(1.05, width / 580);
      model.scale.setScalar(responsiveScale);
      model.position.set(0, -0.35, 0);
    }
  };

  loader.load(
    '/models/dog.glb',
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          child.material.color.multiplyScalar(1.12);
          child.material.roughness = Math.min(child.material.roughness ?? 0.6, 0.5);
          child.material.metalness = 0;
          if (child.material.emissive) {
            child.material.emissive.set(0xfff2d5);
            child.material.emissiveIntensity = 0.08;
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
  };

  window.addEventListener('pagehide', cleanup);
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startDogModel();
} else {
  window.addEventListener('DOMContentLoaded', startDogModel, { once: true });
}
