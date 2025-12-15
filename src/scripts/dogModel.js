// @ts-nocheck
import {
  AmbientLight,
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  LoopRepeat,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const CONTAINER_ID = 'llamadevs-model-container';

const startDogModel = () => {
  const container = document.getElementById(CONTAINER_ID);

  if (!container || container.dataset.initialized === 'true') return;

  container.dataset.initialized = 'true';

  const scene = new Scene();

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(new Color(0x000000), 0);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.25, 3.4);
  camera.lookAt(0, 0.8, 0);

  scene.add(new AmbientLight(0xffffff, 0.8));
  const directionalLight = new DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(3, 5, 4);
  scene.add(directionalLight);

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
      const responsiveScale = Math.max(1.4, width / 380);
      model.scale.setScalar(responsiveScale);
      model.position.set(0, -0.45, 0);
    }
  };

  loader.load(
    '/models/dog.glb',
    (gltf) => {
      model = gltf.scene;
      scene.add(model);

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
    if (model) model.rotation.y -= delta * 0.15;

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
