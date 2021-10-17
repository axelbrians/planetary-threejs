import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import randomInt from './randomNextInt';
import MoonTexture from './assets/images/MoonTexture.jpg';
import EarthTexture from './assets/images/EarthTexture.jpg';
import EarthCloud from './assets/images/EarthCloud.png';
import SunTexture from './assets/images/SunTexture.jpg';
import MarsTexture from './assets/images/MarsTexture.jpg';


// Canvas
const canvas = document.querySelector('canvas.webgl');


// Scene
const scene = new THREE.Scene();


// Grid helper
// const gridHelper = new THREE.GridHelper( 1000, 1000 );
// scene.add( gridHelper );


// Geomtry



// Mesh



// Add mesh to canvass

let starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let star = new THREE.SphereGeometry(0.3, 32, 16);

function generateStar() {
    // console.log("added new star" + positions);


    let starMesh = new THREE.Mesh(star, starMaterial);
    starMesh.position.set(
        randomInt(-1000, 1000), 
        randomInt(-1000, 1000), 
        randomInt(-1000, 1000)
    );
    return starMesh;
}

Array.from({ length: 1000 }, () => 1).map(() => {
    scene.add(generateStar());
});

var rMoon = 35;
var thetaMoon = 0;
var dThetaMoon = 2 * Math.PI / 1000;

var rEarth = 250;
var thetaEarth = 0;
var dThetaEarth = 2 * Math.PI / 12000;

var rMars = 350;
var thetaMars = 0;
var dThetaMars = 2 * Math.PI / 24000;

const sunTexture = new THREE.TextureLoader().load(SunTexture);
const sunGeo = new THREE.SphereGeometry(70, 50, 50);
const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(0, 0, 0);
scene.add(sun);


const earthTexture = new THREE.TextureLoader().load(EarthTexture);
const earthGeo = new THREE.SphereGeometry(20, 50, 50);
const earthMat = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeo, earthMat);
earth.position.set(0, 0, 0);
scene.add(earth);

const earthCloudTexture = new THREE.TextureLoader().load(EarthCloud);
const cloudGeo = new THREE.SphereGeometry(20.2, 50, 50);
const cloudMat = new THREE.MeshPhongMaterial({
    map: earthCloudTexture,
    transparent: true,
    opacity: 0.1,
    emissive: 0xffffff
});
const earthCloud = new THREE.Mesh(cloudGeo, cloudMat);
earthCloud.position.set(0, 0, 0);
scene.add(earthCloud);


const moonTexture = new THREE.TextureLoader().load(MoonTexture);
const moonGeometry = new THREE.SphereGeometry(10, 50, 50);
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(35, 0, 0);
scene.add(moon)


const marsTexture = new THREE.TextureLoader().load(MarsTexture);
const marsGeometry = new THREE.SphereGeometry(16, 50, 50);
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
mars.position.set(0, 0, 0);
scene.add(mars)


// Lights option

// Point Light


// Spot Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.visible = false;
scene.add(directionalLight);

// Debug
const gui = new dat.GUI();

/*
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(250, 20, 550);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const onKeyListener = (event) => {
    if (event.keyCode === 32) {
        isPaused = !isPaused;
    } else if (event.keyCode === 82) {
        isReversed = !isReversed;
    }
}


document.addEventListener('keydown', onKeyListener);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock()

let isPaused = false;
let isReversed = false;

const earthSpeedRot = 0.002;
const earthCloudSpeedRot = 0.0009;
const moonSpeedRot = 0.002;
const marsSpeedRot = 0.002;
const sunSpeedRot = 0.001;


const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    // Update objects depends on isPaused
    if (!isPaused) {
        if (!isReversed) {
            thetaEarth += dThetaEarth;
            earth.rotation.y -= earthSpeedRot;
            earth.position.x = rEarth * Math.cos(thetaEarth);
            earth.position.z = rEarth * Math.sin(thetaEarth);

            earthCloud.rotation.y -= earthCloudSpeedRot;
            earthCloud.position.x = rEarth * Math.cos(thetaEarth);
            earthCloud.position.z = rEarth * Math.sin(thetaEarth);


            thetaMoon += dThetaMoon;
            moon.position.x = rMoon * Math.cos(thetaMoon) + rEarth * Math.cos(thetaEarth);
            moon.position.z = rMoon * Math.sin(thetaMoon) + rEarth * Math.sin(thetaEarth);
            moon.position.y = rMoon * Math.sin(thetaMoon);
            moon.rotation.y -= moonSpeedRot;
            moon.rotation.z -= moonSpeedRot;

            thetaMars += dThetaMars;
            mars.position.x = rMars * Math.cos(thetaMars);
            mars.position.z = rMars * Math.sin(thetaMars);
            mars.rotation.y -= marsSpeedRot;

            sun.rotation.y -= sunSpeedRot;
        } else {
            thetaEarth -= dThetaEarth;
            earth.rotation.y += earthSpeedRot;
            earth.position.x = rEarth * Math.cos(thetaEarth);
            earth.position.z = rEarth * Math.sin(thetaEarth);

            earthCloud.rotation.y += earthCloudSpeedRot;
            earthCloud.position.x = rEarth * Math.cos(thetaEarth);
            earthCloud.position.z = rEarth * Math.sin(thetaEarth);


            thetaMoon -= dThetaMoon;
            moon.position.x = rMoon * Math.cos(thetaMoon) + rEarth * Math.cos(thetaEarth);
            moon.position.z = rMoon * Math.sin(thetaMoon) + rEarth * Math.sin(thetaEarth);
            moon.position.y = rMoon * Math.sin(thetaMoon);
            moon.rotation.y += moonSpeedRot;
            moon.rotation.z += moonSpeedRot;

            thetaMars -= dThetaMars;
            mars.position.x = rMars * Math.cos(thetaMars);
            mars.position.z = rMars * Math.sin(thetaMars);
            mars.rotation.y += marsSpeedRot;

            sun.rotation.y += sunSpeedRot;
        }
    }
    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()