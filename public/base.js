import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Define size variables
const planeSize = 30;
const barrierSize = 50;
const barrierHeight = 2;

// Create a Cannon.js world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

// Function to create an object
function createObject(geometry, material, position, mass = 0) {
    // Create Three.js mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);

    // Create Cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(geometry.parameters.width / 2, geometry.parameters.height / 2, geometry.parameters.depth / 2));
    const body = new CANNON.Body({ mass: mass, shape: shape });
    body.position.set(position.x, position.y, position.z);
    world.addBody(body);

    return { mesh, body };
}

// Create the plane
const planeGeometry = new THREE.BoxGeometry(planeSize, 1, planeSize);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const plane = createObject(planeGeometry, planeMaterial, { x: 0, y: 0, z: 0 });

// Create barrier geometry and material
const barrierGeometry = new THREE.BoxGeometry(barrierSize, barrierHeight, barrierSize);
const barrierMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Calculate barrier positions based on plane size
const barrierPosition = planeSize / 2;

// Create the barriers
const barrier1 = createObject(barrierGeometry, barrierMaterial, { x: barrierPosition, y: barrierHeight / 2, z: 0 });
const barrier2 = createObject(barrierGeometry, barrierMaterial, { x: -barrierPosition, y: barrierHeight / 2, z: 0 });
const barrier3 = createObject(barrierGeometry, barrierMaterial, { x: 0, y: barrierHeight / 2, z: barrierPosition });
const barrier4 = createObject(barrierGeometry, barrierMaterial, { x: 0, y: barrierHeight / 2, z: -barrierPosition });