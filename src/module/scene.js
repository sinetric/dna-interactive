import "../../style.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const scene = new THREE.Scene
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/innerHeight, 0.1, 1000)

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

//scene.background = new THREE.Color(0x101016)

//const SceneBackground = new THREE.TextureLoader().load('../../textures/background.png')
//scene.background = SceneBackground

// Renderer

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, innerHeight);

camera.position.setX(-3);
camera.position.setZ(30);

//const Controls = new OrbitControls(camera, renderer.domElement)

function animate() {
    requestAnimationFrame(animate)

    //DNA.rotation.y += 0.01;
    DNA.rotation.z += 0.005;

    //Controls.update()

    renderer.setClearColor( 0x000000, 0 ); // the default

    renderer.render(scene, camera)
}

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