import * as THREE from "three";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { clamp } from "../core/math_operations.js";

const scene = new THREE.Scene
const raycaster = new THREE.Raycaster();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)

var Background = new THREE.Color(0x101016);

var FullBlackBackground = new THREE.Color("rgb(0, 0, 0)");
var BlackBackground = new THREE.Color("rgb(15, 15, 15)");
var WhiteBackground = new THREE.Color("rgb(255, 255, 255)");

const information = {
    "A_nucleotide": {
        TitleInnerHTML: "A <font size=30px>Adenine</font>",
        DescriptionInnerHTML: "Adenine nucleotide",
    },
    "T_nucleotide": {
        TitleInnerHTML: "T <font size=30px>Thymine</font>",
        DescriptionInnerHTML: "Thymine nucleotide",
    },
    "G_nucleotide": {
        TitleInnerHTML: "G <font size=30px>Guanine</font>",
        DescriptionInnerHTML: "Guanine nucleotide",
    },
    "C_nucleotide": {
        TitleInnerHTML: "C <font size=30px>Cytosine</font>",
        DescriptionInnerHTML: "Cytosine nucleotide",
    },
}

let currentCheckpoint = 1;
let checkpointsAmount = 4;
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
        Percentage: 44,
        BackgroundColor: BlackBackground,
        Active: false,
        
        FogDistance: 90,
    },
    4: {
        Percentage: 60,
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



for (let i = 2; i < 15; i++){
    const sinValue = Math.sin(i * 24) * 2
    const sphere_geometry1 = new THREE.OctahedronGeometry(2, 3)
    const sphere_material1 = new THREE.MeshStandardMaterial({ wireframe: true });
    const sphere1 = new THREE.Mesh(sphere_geometry1, sphere_material1);
    
    const sphere_geometry2 = new THREE.OctahedronGeometry(2, 3)
    const sphere_material2 = new THREE.MeshStandardMaterial({ wireframe: true });
    const sphere2 = new THREE.Mesh(sphere_geometry2, sphere_material2);

    var isAT;

    if(Math.floor(Math.random() * 2) == 1){
        isAT = true;
    } else{
        isAT = false;
    }
    
    const cylinder_geometry1 = new THREE.CylinderGeometry(1, 1, 8.75 + sinValue)
    var cylinder_material1;
    
    const cylinder_geometry2 = new THREE.CylinderGeometry(1, 1, 8.75 + sinValue)
    var  cylinder_material2;

    if (isAT == true){
        cylinder_material1 = new THREE.MeshStandardMaterial({wireframe: true , color: new THREE.Color("rgb(245, 84, 66)")});
        cylinder_material2 = new THREE.MeshStandardMaterial({wireframe: true , color: new THREE.Color("rgb(40, 93, 237)")});
    } else{
        cylinder_material1 = new THREE.MeshStandardMaterial({wireframe: true , color: new THREE.Color("rgb(66, 245, 108)")});
        cylinder_material2 = new THREE.MeshStandardMaterial({wireframe: true , color: new THREE.Color("rgb(242, 218, 82)")});
    }

    const cylinder1 = new THREE.Mesh(cylinder_geometry1, cylinder_material1)
    const cylinder2 = new THREE.Mesh(cylinder_geometry2, cylinder_material2)

    if (isAT == true){
        cylinder1.name = "A_nucleotide";
        cylinder2.name = "T_nucleotide";
    } else{
        cylinder1.name = "G_nucleotide";
        cylinder2.name = "C_nucleotide";
    }
    
    const group = new THREE.Group()
    
    sphere1.position.x = 8.75 - 3  + sinValue
    sphere2.position.x = -8.75 - 3 - sinValue
    cylinder1.position.x = 8.75 - 3 - (8.75 - sinValue)/2
    cylinder2.position.x = -8.75 - 3 + (8.75 - sinValue)/2
    
    sphere1.position.z = 15,
    sphere2.position.z = 15,
    cylinder1.position.z = 15;
    cylinder2.position.z = 15;
    
    cylinder1.rotation.x = 3.14/2;
    cylinder1.rotation.z = 3.14/2;
    cylinder2.rotation.x = 3.14/2;
    cylinder2.rotation.z = 3.14/2;

    sphere1.position.y = i * -4.5
    sphere2.position.y = i * -4.5
    cylinder1.position.y = i * -4.5
    cylinder2.position.y = i * -4.5
    
    scene.add(sphere1)
    scene.add(sphere2)
    scene.add(cylinder1)
    scene.add(cylinder2)
    
    //scene.add(group)
}

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

const pointer = new THREE.Vector2();

var CurrentHover;

let EventListener = {
    MouseMoveEvent: null,
}

const onMouseMove = (event) => {
    EventListener.MouseMoveEvent = event
} 

window.addEventListener('mousemove', onMouseMove);

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

document.getElementById('tooltip').style.transform = 'translateY('+(10000)+'px)';
document.getElementById('tooltip').style.transform += 'translateX('+(10000)+'px)';

function animate() {
    requestAnimationFrame(animate)

    //DNA.rotation.y += 0.01;
    if(DNA != null){
        DNA.rotation.z += 0.005;
    }

    if(EventListener.MouseMoveEvent != null){
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
    
        pointer.x = ( EventListener.MouseMoveEvent.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( EventListener.MouseMoveEvent.clientY / window.innerHeight ) * 2 + 1;
    
        if(CurrentHover != null){
            document.getElementById('tooltip').style.transform = 'translateY('+(EventListener.MouseMoveEvent.clientY-80)+'px)';
            document.getElementById('tooltip').style.transform += 'translateX('+(EventListener.MouseMoveEvent.clientX-100)+'px)';         

            document.getElementById('tooltip').classList.replace('fadeOut', 'fadeIn');
    
            document.getElementById('title_tooltip').innerHTML = CurrentHover.TitleInnerHTML;
            document.getElementById('description_tooltip').innerHTML = CurrentHover.DescriptionInnerHTML;
        }else{
            //document.getElementById('tooltip').style.transform = 'translateY('+(10000)+'px)';
            //document.getElementById('tooltip').style.transform += 'translateX('+(10000)+'px)';  

            document.getElementById('tooltip').classList.replace('fadeIn', 'fadeOut');
        }
    }

    Background = Background.lerp(checkpoints[currentActive].BackgroundColor, 0.09);
    scene.background = Background;
    scene.fog.color = Background;
    scene.fog.far = checkpoints[currentActive].FogDistance

	raycaster.setFromCamera( pointer, camera );
    var intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
        var object = intersects[0].object;

        //console.log(object.name)

        if(information[object.name]){
            CurrentHover = information[object.name];
            //console.log(information[object.name], "object data")
        }
    } else{
        CurrentHover = null;
    }

    //Controls.update()

    renderer.setClearColor( 0x000000, 0 ); // the default

    renderer.render(scene, camera)
}

//console.log(scene.fog)

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