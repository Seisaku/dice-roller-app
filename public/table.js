// JavaScript code to initialize Three.js will go here
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as CANNON from 'https://unpkg.com/cannon-es/dist/cannon-es.js';

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

// Create a plane
const groundShape = new CANNON.Plane();
const groundBody = new CANNON.Body({ mass: 0 }); // mass 0 makes it static
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2); // Rotate the plane to be horizontal
world.addBody(groundBody);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x777777, side: THREE.DoubleSide });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.rotation.x = -Math.PI / 2;
scene.add(planeMesh);

const barrierShape = new CANNON.Box(new CANNON.Vec3(5, 1, 0.1)); // Adjust size as needed
const barrierBody = new CANNON.Body({
    mass: 0, // Static body
    position: new CANNON.Vec3(0, 0, -5) // Position at one edge of the plane
});
barrierBody.addShape(barrierShape);
world.addBody(barrierBody);
const barrierGeometry = new THREE.BoxGeometry(10, 2, 0.2); // Match Cannon.js dimensions
const barrierMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
const barrierMesh = new THREE.Mesh(barrierGeometry, barrierMaterial);
barrierMesh.position.set(0, 0, -5); // Position to match the Cannon.js body
scene.add(barrierMesh);


// Create a cube
const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1)); // Example for a cube
const body = new CANNON.Body({
    mass: 1,
    shape: shape
});
body.position.set(0, 5, 0); // Start at 1 unit above the ground plane
body.velocity.set(1, 1, 1); // Forward and upward motion
body.angularVelocity.set(3, -3, 3); // Spinning around Y and Z axes
world.addBody(body);

// Add a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.copy(body.position);
cube.quaternion.copy(body.quaternion);
scene.add(cube);

renderer.domElement.addEventListener('click', onSceneClick);
function onSceneClick() {
    body.position.set(0, 5, 0); // Start at 1 unit above the ground plane
    body.velocity.set(1, 1, 1); // Forward and upward motion
    body.angularVelocity.set(3, -3, 3); // Spinning around Y and Z axes
}


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update physics world
    world.step(1 / 60);

    // Synchronize Three.js object with Cannon.js body
    cube.position.copy(body.position);
    cube.quaternion.copy(body.quaternion);

    // Update the text content with cube's current position
    const pos = cube.position;
    document.getElementById('cubeInfo').textContent = `Cube Position: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`;

    // Render the scene
    renderer.render(scene, camera);
}

animate();