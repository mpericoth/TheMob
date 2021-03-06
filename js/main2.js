import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { RGBELoader } from "./RGBELoader.js";

let camera, scene, renderer, loader, coche;
let botonRojo;
let botonAzul;
let botonChasis;
let botonInfo;
let divInfo;

setUI();
setBackground();
setCanvas();
setScene();
setControls();
render();
function setUI() {

  botonInfo = document.getElementById("botonInfo");
  divInfo = document.getElementById("info");
  botonChasis = document.getElementById("chasis");

  botonInfo.addEventListener("click", () => {
    changeColor();
  });
  botonChasis.addEventListener("click", () => {
    loadCar("chasis.glb");
  });
}
function changeColor(){
  coche.children[0].children[1].material.color = new THREE.Color( 'skyblue' );
  render();
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
    },
    function (xhr) {
      console.log(
        "Cargando modelo: " + (xhr.loaded / xhr.total) * 100 + "% loaded"
      );
    }
  );
}
function setScene() {
  camera = new THREE.PerspectiveCamera(50, 600 / 320, 0.25, 20);
  camera.position.set(4, 0, 3);
  scene = new THREE.Scene();
}
function setCanvas() {
  let canvasDiv = document.getElementById("car3D");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(600 / 320);
  renderer.setSize(600, 320);
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
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();
}
function onWindowResize() {
  camera.aspect = 600 / 320;
  camera.updateProjectionMatrix();

  renderer.setSize(600, 320);

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