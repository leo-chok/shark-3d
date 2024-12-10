import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const scene = new THREE.Scene();
let shark;
let mixer;
const loader = new GLTFLoader();
loader.load(
  "Shark3.glb",
  function (gltf) {
    shark = gltf.scene;
    scene.add(shark);

    mixer = new THREE.AnimationMixer(shark);
    mixer.clipAction(gltf.animations[0]).play();
    modelMove();
  },
  function (xhr) {},
  function (error) {}
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// light
const ambientLight = new THREE.AmbientLight(0xfffffff, 4);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xff17ffff, 6);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.01);
  if (
    shark &&
    Math.abs(shark.position.z - targetPositionZ) < 0.1 && // Tolérance de 0.1
    !functionTriggered) {
    functionTriggered = true;
    onSharkReachedTarget();
  }
};
reRender3D();

const targetPositionZ = 18.8; // Position cible pour déclencher la fonction
let functionTriggered = false; // Pour éviter de déclencher plusieurs fois la fonction

let arrPositionModel = [
  {
    id: "banner",
    position: { x: 0.6, y: -0.8, z: 10 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 0, y: 0, z: -50 },
    rotation: { x: 0, y: 5, z: 0 },
    
  },
  {
    id: "description",
    position: { x: 5, y: 0, z: 0 },
    rotation: { x: 0, y: 5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -0.4, z: 18.8 },
    rotation: { x: 0, y: 7.7, z: 0 },
  },
];

// -----------------  Fonctions blocage scroll
// Bloquer le scroll
function disableScroll() {
  document.body.style.overflow = "hidden"; // Bloque le scroll principal
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("keydown", preventKeyScroll, { passive: false });
}

// Débloquer le scroll
function enableScroll() {
  document.body.style.overflow = ""; // Réactive le scroll
  document.body.style.height = "";
  window.removeEventListener("wheel", preventScroll, { passive: false });
  window.removeEventListener("keydown", preventKeyScroll, { passive: false });
}

// Empêcher le scroll via la molette
function preventScroll(event) {
  event.preventDefault();
}

// Empêcher le scroll via le clavier
function preventKeyScroll(event) {
  const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
  if (keys.includes(event.key)) {
    event.preventDefault();
  }
}

// --------------------------



const modelMove = () => {
  const sections = document.querySelectorAll(".section");
  let currentSection;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 3) {
      currentSection = section.id;
    }
  });
  let position_active = arrPositionModel.findIndex(
    (val) => val.id == currentSection
  );
  if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    gsap.to(shark.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: "power1.out",
    });
    gsap.to(shark.rotation, {
      x: new_coordinates.rotation.x,
      y: new_coordinates.rotation.y,
      z: new_coordinates.rotation.z,
      duration: 1,
      ease: "power1.out",
    });

     // Bloquer le scroll si on atteint "contact"
    if (currentSection === "contact") {
      disableScroll(); // Bloque complètement le scroll
      console.log("Scroll bloqué, section contact atteinte !");
    } else {
      enableScroll(); // Réactive le scroll si on quitte la section
      console.log("Scroll activé.");
    }


  }
};
window.addEventListener("scroll", () => {
  if (shark) {
    modelMove();
  }
});
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});



// CREATE MUSIC AMBIENT

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source for background sound
const ambientSound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer (Un clic doit autoriser le son)
const audioLoader = new THREE.AudioLoader();

document.addEventListener("click", () => {
  audioLoader.load("sounds/underwater-ambient.mp3", function (buffer) {
    ambientSound.setBuffer(buffer);
    ambientSound.setLoop(true);
    ambientSound.setVolume(0.5);
    ambientSound.play();
  });
});

// Fonction déclenchée lorsque le requin atteint la position cible
function onSharkReachedTarget() {
  console.log("Le requin a atteint la position Z: 18.8 !");
  
  // Ajouter une classe à un élément HTML
  const blood = document.getElementsByClassName("blood")[0]; // [0] pour le premier élément
  blood.classList.add("out"); // Ajouter la classe 'Out'

  // Créer un nouvel objet audio pour le son du requin
  const sharkRoarSound = new THREE.Audio(listener);

  // Charger et jouer le son de rugissement
  audioLoader.load("sounds/roar.mp3", function (buffer) {
    sharkRoarSound.setBuffer(buffer);
    sharkRoarSound.setLoop(false); // Pas en boucle
    sharkRoarSound.setVolume(1);   // Volume maximum
    sharkRoarSound.play();
    sharkRoarSound.source.onended = () => {
      console.log("Le son est terminé.");
      open('https://github.com/leo-chok/shark-3d');
    };
  });

   
}


