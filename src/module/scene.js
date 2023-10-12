import "../../style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { lerp } from "three/src/math/MathUtils";
import { clamp } from "../core/math_operations.js";

const scene = new THREE.Scene
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1, 1000)

var Background = new THREE.Color(0x101016);

var FullBlackBackground = new THREE.Color("rgb(0, 0, 0)");
var BlackBackground = new THREE.Color("rgb(15, 15, 15)");
var WhiteBackground = new THREE.Color("rgb(255, 255, 255)");

let currentCheckpoint = 1;
let checkpointsAmount = 3;
let currentActive = 1;
let backgroundLerpAlpha = 0;
let checkpoints = {
    0: { // This checkpoint is numerically unreachable
        Percentage: -1,
        BackgroundColor: BlackBackground,
        Active: true,
    },
    1: {
        Percentage: 0,
        BackgroundColor: BlackBackground,
        Active: true,

        FogDistance: 5,
    },
    2: {
        Percentage: 1.4,
        BackgroundColor: WhiteBackground,
        Active: false,
        
        FogDistance: 90,
    },
    3: {
        Percentage: 2,
        BackgroundColor: BlackBackground,
        Active: false,
        
        FogDistance: 90,
    }
}

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true,
    alpha: true
})

renderer.setClearColor(0xffffff, 1);

// Torus

var DNA;

const plane_geometry = new THREE.PlaneGeometry(60, 60, 199, 199);
const plane_material = new THREE.MeshStandardMaterial({ wireframe: true });
const plane = new THREE.Mesh(plane_geometry, plane_material);

// Star Generation

function addStar(){
    
}

/*

console.log(geometry)

plane.rotation.x = 57

camera.rotation.x = 0

scene.add(plane);

*/

// Lights

scene.fog = new THREE.Fog(0x101016, 0, 5);
	;(function(){
		var light	= new THREE.AmbientLight( 0x202020 )
		scene.add( light )
		var light	= new THREE.DirectionalLight('white', 5)
		light.position.set(0.5, 0.0, 2)
		scene.add( light )
		var light	= new THREE.DirectionalLight('white', 0.75*2)
		light.position.set(-0.5, -0.5, -2)
		scene.add( light )		
	})()

// Objects Loader

const loader = new OBJLoader();

loader.load(
	'../../assets/models/DNA.obj',
	// called when resource is loaded
	function ( object ) {
        console.log(object)

        object.castShadow = false

        object.position.x = 1;
        object.position.z = 26;
        object.position.y = 1;

        object.rotation.x = 45

        DNA = object;

		scene.add( object );
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

scene.background = new THREE.Color(0x101016);

//const SceneBackground = new THREE.TextureLoader().load('../../textures/background.png')
//scene.background = SceneBackground

// Renderer

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, innerHeight);

camera.position.setX(-3);
camera.position.setZ(30);

//const Controls = new OrbitControls(camera, renderer.domElement)

var startingPoint = 0;
var endPoint = -28662.5;

document.body.onscroll = function(){
    const t = document.body.getBoundingClientRect().top;
    const percentage = clamp(t/endPoint * 100, 0, 100);

    console.log(percentage);

    console.log(checkpoints)
    
    for (const [i, v] of Object.entries(checkpoints)) {
        if(i != 0){
            const next = (Number(i) + 1)
            const previous = (Number(i))

            //console.log(i, v, next, previous, checkpointsAmount)
            //console.log(checkpoints[clamp(next, 0, checkpointsAmount)], clamp(next, 0, checkpointsAmount))
            console.log(checkpoints[previous].Percentage, percentage, checkpoints[clamp(next, 0, checkpointsAmount)].Percentage)

            if(checkpoints[previous].Percentage < percentage){
                if(checkpoints[clamp(next, 0, checkpointsAmount)].Percentage > percentage){
                    currentActive = i;

                    console.log(i, "is now active")
                }
            }
        }
    }

    camera.position.y = t * 0.005
    DNA.position.x = 1 + t * -0.005
}

function animate() {
    requestAnimationFrame(animate)

    //DNA.rotation.y += 0.01;
    if(DNA != null){
        DNA.rotation.z += 0.005;
    }

    Background = Background.lerp(checkpoints[currentActive].BackgroundColor, 0.09);
    scene.background = Background;
    scene.fog.color = Background;
    scene.fog.far = checkpoints[currentActive].FogDistance

    //Controls.update()

    renderer.setClearColor( 0x000000, 0 ); // the default

    renderer.render(scene, camera)
}

console.log(scene.fog)

animate();

export default class Scene {
    constructor(){
        return {
            camera: {
                setPosition: function(x, y, z){
                    camera.position.setX(x)
                    camera.position.setY(y)
                    camera.position.setZ(z)
                },

                setRotation: function(angleX, angleY, angleZ){
                    // camera.position.rotation.X += angleX
                    // camera.position.rotation.Y += angleY
                    // camera.position.rotation.Z += angleZ
                }
            }
        }
    }
}