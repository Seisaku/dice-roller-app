// JavaScript code to initialize Three.js will go here
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity along the negative Z-axis

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5); // Position the camera diagonally above the scene
camera.lookAt(scene.position); // Ensure the camera is pointing towards the scene center
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Adjust damping factor as needed

// Create a plane
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 }); // mass 0 makes it static
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotate the plane to be horizontal
world.addBody(groundBody);

// const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.DoubleSide });
// const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// planeMesh.rotation.x = -Math.PI / 2;
// scene.add(planeMesh);

const groundDebugGeometry = new THREE.BoxGeometry(30, 0.1, 30);
const groundDebugMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.5 });
const groundDebugMesh = new THREE.Mesh(groundDebugGeometry, groundDebugMaterial);
groundDebugMesh.position.y = -0.05; // Half the height of the box to align with plane
scene.add(groundDebugMesh);

const barrierShape = new CANNON.Box(new CANNON.Vec3(30, 2, 0.2)); // Adjust size as needed
const barrierBody = new CANNON.Body({
    mass: 0, // Static body
    position: new CANNON.Vec3(0, 1, -15) // Position at one edge of the plane
});
barrierBody.addShape(barrierShape);
world.addBody(barrierBody);
const barrierGeometry = new THREE.BoxGeometry(30, 2, 0.2); // Match Cannon.js dimensions
const barrierMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.5 });
const barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);
barrierMesh.quaternion.copy(barrierBody.quaternion); // Copy the rotation of the Cannon.js body
barrierMesh.position.copy(barrierBody.position); // Copy the position of the Cannon.js body
scene.add(barrierMesh);

// Barrier 2 - Opposite side
const barrierMesh2 = new THREE.Mesh(barrierGeometry, barrierMaterial);
barrierMesh2.position.set(0, 1, 15);
scene.add(barrierMesh2);

// Barrier 3 - Perpendicular side
const barrierGeometry3 = new THREE.BoxGeometry(0.2, 2, 30); // Adjust dimensions
const barrierMesh3 = new THREE.Mesh(barrierGeometry3, barrierMaterial);
barrierMesh3.position.set(15, 1, 0);
scene.add(barrierMesh3);

// Barrier 4 - Opposite perpendicular side
const barrierMesh4 = new THREE.Mesh(barrierGeometry3, barrierMaterial);
barrierMesh4.position.set(-15, 1, 0);
scene.add(barrierMesh4);

// Create a cube
const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Example for a cube
const body = new CANNON.Body({
    mass: 1,
    shape: shape
});

body.position.set(0, 25, 0); // Start at 1 unit above the ground plane
body.velocity.set(1, 1, 1); // Forward and upward motion
body.angularVelocity.set(3, -3, 3); // Spinning around Y and Z axes
world.addBody(body);

// Add a cube
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.copy(body.position);
cube.quaternion.copy(body.quaternion);
scene.add(cube);

renderer.domElement.addEventListener('click', onSceneClick);
function onSceneClick() {
    body.position.set(0, 25, 0); // Start at 1 unit above the ground plane
    body.velocity.set(1, 1, 1); // Forward and upward motion
    body.angularVelocity.set(3, -3, 3); // Spinning around Y and Z axes
}


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Only required if controls.enableDamping is set to true

    // Update physics world
    world.step(1 / 60);

    // Synchronize Three.js object with Cannon.js body
    cube.position.copy(body.position);
    cube.quaternion.copy(body.quaternion);

    // Update the text content with cube's current position
    const pos = cube.position;
    document.getElementById('cubeInfo').textContent = `Cube: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`;

    // Render the scene
    renderer.render(scene, camera);
}

animate();