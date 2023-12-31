// JavaScript code to initialize Three.js will go here
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity along the negative Z-axis

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(15, 15, 15); // Position the camera diagonally above the scene
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
groundDebugMesh.name = 'ground';
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
barrierMesh.name = 'barrier1';
scene.add(barrierMesh);

// Barrier 2 - Opposite side
const barrierMesh2 = new THREE.Mesh(barrierGeometry, barrierMaterial);
barrierMesh2.position.set(0, 1, 15);
barrierMesh2.name = 'barrier2';
scene.add(barrierMesh2);

// Barrier 3 - Perpendicular side
const barrierGeometry3 = new THREE.BoxGeometry(0.2, 2, 30); // Adjust dimensions
const barrierMesh3 = new THREE.Mesh(barrierGeometry3, barrierMaterial);
barrierMesh3.position.set(15, 1, 0);
barrierMesh3.name = 'barrier3';
scene.add(barrierMesh3);

// Barrier 4 - Opposite perpendicular side
const barrierMesh4 = new THREE.Mesh(barrierGeometry3, barrierMaterial);
barrierMesh4.position.set(-15, 1, 0);
barrierMesh4.name = 'barrier4';
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
cube.name = 'cube';
scene.add(cube);

//Events
// renderer.domElement.addEventListener('click', onSceneClick);
function onSceneClick() {
    body.position.set(0, 25, 0); // Start at 1 unit above the ground plane
    body.velocity.set(1, 1, 1); // Forward and upward motion
    body.angularVelocity.set(3, -3, 3); // Spinning around Y and Z axes
}

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Create a material for the line
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

// Create a geometry for the line
const lineGeometry = new THREE.BufferGeometry();

// Initial vertices (start and end points of the line)
const vertices = new Float32Array([0, 0, 0, 0, 0, 0]);
lineGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

// Create the line and add it to the scene
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// Update the line in the raycast function
function updateRayLine(origin, direction) {
    lineGeometry.attributes.position.array[0] = origin.x;
    lineGeometry.attributes.position.array[1] = origin.y;
    lineGeometry.attributes.position.array[2] = origin.z;
    lineGeometry.attributes.position.array[3] = origin.x + direction.x * 100; // Length of the ray
    lineGeometry.attributes.position.array[4] = origin.y + direction.y * 100;
    lineGeometry.attributes.position.array[5] = origin.z + direction.z * 100;
    lineGeometry.attributes.position.needsUpdate = true;
}

// Call this function inside your raycasting logic
// For example: updateRayLine(raycaster.ray.origin, raycaster.ray.direction);

// Assuming controls is your instance of THREE.OrbitControls
const dragControls = new DragControls([cube], camera, renderer.domElement);

// Create an invisible mesh for dragging
let dragCube = new THREE.Mesh(cube.geometry, cube.material);
dragCube.visible = false;
scene.add(dragCube);

console.log('DragControls enabled:', dragControls.enabled);
console.log('DragControls objects:', dragControls.objects);

dragControls.addEventListener('drag', function (event) {
    console.log('drag event fired');
    console.log('cube position before:', cube.position);

    // Update the body's position to match the cube's position
    body.position.copy(event.object.position);

    console.log('cube position after:', cube.position);
});

let isDragging = false;

dragControls.addEventListener('dragstart', function (event) {
    isDragging = true;
    // Set the body to kinematic to disable physics
    body.type = CANNON.Body.KINEMATIC;
});

dragControls.addEventListener('dragend', function (event) {
    isDragging = false;
    // Set the body back to dynamic to enable physics after a delay
    setTimeout(function() {
        body.type = CANNON.Body.DYNAMIC;
    }, 100); // Delay in milliseconds
});

function onMouseDown(event) {
    event.preventDefault();

    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;


    document.getElementById('mouseInfo').textContent = `Mouse: x=${mouse.x.toFixed(2)}, y=${mouse.y.toFixed(2)}`;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([cube]); // Replace diceMesh with your dice object

    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction.clone();

    updateRayLine(origin, direction);

    // Now, 'meshes' is an array of all Mesh objects in the scene
    const intersectsTest = raycaster.intersectObjects(meshes); // Replace with your array of objects
    let meshIntersects = intersectsTest.map(intersect => intersect.object.name);
    document.getElementById('raycasterInfo').textContent = `Raycaster: x=${raycaster.ray.direction.x.toFixed(2)}, y=${raycaster.ray.direction.y.toFixed(2)}, z=${raycaster.ray.direction.z.toFixed(2)} [${meshIntersects}]`;

    if (intersects.length > 0) {
        // Mouse is over the dice
        // Handle dice dragging logic
        document.getElementById('mouseInfo').textContent = `Mouse: x=${mouse.x.toFixed(2)}, y=${mouse.y.toFixed(2)} (over dice)`;
        // Disable OrbitControls
        controls.enabled = false;
    } else {
        document.getElementById('mouseInfo').textContent = `Mouse: x=${mouse.x.toFixed(2)}, y=${mouse.y.toFixed(2)} (camera)`;
        // Enable OrbitControls
        controls.enabled = true;
    }
}



function onMouseMove(event) {
    event.preventDefault();

    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

    document.getElementById('mouseInfo').textContent = `Mouse: x=${mouse.x.toFixed(2)}, y=${mouse.y.toFixed(2)}`;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([cube]); // Replace diceMesh with your dice object

    const origin = raycaster.ray.origin;
    const direction = raycaster.ray.direction.clone();

    // Now, 'meshes' is an array of all Mesh objects in the scene
    const intersectsTest = raycaster.intersectObjects(meshes); // Replace with your array of objects
    let meshIntersects = intersectsTest.map(intersect => intersect.object.name);
    document.getElementById('raycasterInfo').textContent = `Raycaster: x=${raycaster.ray.direction.x.toFixed(2)}, y=${raycaster.ray.direction.y.toFixed(2)}, z=${raycaster.ray.direction.z.toFixed(2)} [${meshIntersects}]`;

    if (intersects.length > 0) {
        // Mouse is over the dice
        // Handle dice dragging logic        
        cube.material.color.set(0xff0000);
    } else {
        cube.material.color.set(0x00ff00);
        // Mouse is not over the dice
        // Allow OrbitControls to handle the event
    }
}

function onMouseUp(event) {
    // Enable OrbitControls
    controls.enabled = true;

    // Enable physics for the cube
    body.type = CANNON.Body.DYNAMIC;
}

// Create an empty array to store the meshes
let meshes = [];

// Traverse the scene graph
scene.traverse(function (node) {
    // If the node is a Mesh, add it to the array
    if (node.isMesh) {
        meshes.push(node);
    }
});

window.addEventListener('keydown', function (event) {
    // Check if the 'r' key was pressed
    if (event.key === 'r') {
        // Set the camera position to be above the cube
        camera.position.set(cube.position.x, cube.position.y + 15, cube.position.z);
        // Point the camera towards the cube
        camera.lookAt(cube.position);
        // Update the OrbitControls
        controls.update();
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Only required if controls.enableDamping is set to true

    // Update physics world
    world.step(1 / 60);

    // Synchronize Three.js object with Cannon.js body
    if (isDragging === false) {
        cube.position.copy(body.position);
        cube.quaternion.copy(body.quaternion);
    }

    // Update the text content with cube's current position
    const pos = cube.position;
    document.getElementById('cubeInfo').textContent = `Cube: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`;

    document.getElementById('cameraInfo').textContent = `Camera: x=${camera.position.x.toFixed(2)}, y=${camera.position.y.toFixed(2)}, z=${camera.position.z.toFixed(2)}`;

    // Render the scene
    renderer.render(scene, camera);
}

animate();