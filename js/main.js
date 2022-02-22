import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { RGBELoader } from "./RGBELoader.js";

let camera, scene, renderer, loader, coche
let wheel = [];
let colorButton;
let cargarRuedaButton;
let colorSelector;
let nombreTire, nombreRim;
let selectTire, selectRim;
let width = 1200;
let height = 800;
setUI();
setBackground();
setCanvas();
setScene();
setControls();
init();
render();
function init() {
  loadCar("car.glb");
}


function unloadWheel(){
  scene.remove(wheel[0]);
  scene.remove(wheel[1]);
  scene.remove(wheel[2]);
  scene.remove(wheel[3]);
  wheel.pop();wheel.pop();wheel.pop();wheel.pop();
}
function loadWheel(nombreFichero, position) {
  if (loader == null) {
    loader = new GLTFLoader();
  }
  loader.setPath("models/");
  loader.load(
    nombreFichero,
    function (gltf) {
      gltf.scene.name = "wheel";
      wheel.push(gltf.scene);
      scene.add(gltf.scene);
      console.log(gltf.scene.position);
      gltf.scene.position.x = position.x;
      gltf.scene.position.y = position.y;
      gltf.scene.position.z = position.z;
      render();
    },
    function (xhr) {
      console.log(
        "Cargando modelo: " + (xhr.loaded / xhr.total) * 100 + "% loaded"
      );
    }
  );
}
function loadCar(nombreFichero) {
  if (loader == null) {
    loader = new GLTFLoader();
  }
  loader.setPath("models/");
  loader.load(
    nombreFichero,
    function (gltf) {

      gltf.scene.name = nombreFichero;
      coche = gltf.scene;
      scene.add(gltf.scene);
      render();
      loadWheel("tire1.glb", coche.children[2].position);
      loadWheel("rim1.glb", coche.children[2].position);
      loadWheel("rim1.glb", coche.children[1].position);
      loadWheel("tire1.glb", coche.children[1].position);
    },
    function (xhr) {
      console.log(
        "Cargando modelo: " + (xhr.loaded / xhr.total) * 100 + "% loaded"
      );
    }
  );
}



function changeColor() {
  let color = new THREE.Color(colorSelector.value);
  coche.children[4].children[1].material.color = color;
  render();
}
function setUI() {
  colorSelector = document.getElementById("colorSelector");
  colorButton = document.getElementById("colorButton");
  cargarRuedaButton = document.getElementById("cargarRuedaButton");
  selectTire = document.getElementById("tire");
  selectRim = document.getElementById("rim");

  selectRim.addEventListener("change", () => {
    unloadWheel();
    nombreRim = selectRim.value + ".glb";
    nombreTire = selectTire.value + ".glb";
    loadWheel(nombreTire, coche.children[2].position);
    loadWheel(nombreRim, coche.children[2].position);
    loadWheel(nombreTire, coche.children[1].position);
    loadWheel(nombreRim, coche.children[1].position);
  });
  selectTire.addEventListener("change", () => {
    unloadWheel();
    nombreRim = selectRim.value + ".glb";
    nombreTire = selectTire.value + ".glb";
    loadWheel(nombreTire, coche.children[2].position);
    loadWheel(nombreRim, coche.children[2].position);
    loadWheel(nombreTire, coche.children[1].position);
    loadWheel(nombreRim, coche.children[1].position);
  });
  colorButton.addEventListener("click", () => {
    changeColor();
    console.log(scene);
  });
}

function setScene() {
  camera = new THREE.PerspectiveCamera(50, width / height, 0.25, 40);
  camera.position.set(40, 0, 3);
  scene = new THREE.Scene();
}
function setCanvas() {
  let canvasDiv = document.getElementById("car3D");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(width / height);
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding;
  canvasDiv.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
}
function setControls() {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 15;
  controls.target.set(0, 0, -0.2);
  controls.update();
}
function onWindowResize() {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  render();
}

function render() {
  renderer.render(scene, camera);
}

function setBackground() {
  let RGBE = new RGBELoader()
    .setPath("textures/")
    .load("royal_esplanade_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;
      render();
    });
}