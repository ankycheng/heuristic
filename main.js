import './style.css'
import * as THREE from 'three'
import { addLight } from './addLights.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { RGBELoader } from './RGBELoader.js'
import { postprocessing } from './postprocessing.js'
import { clickToggle } from './clickToggle.js'
import { lockToggle } from './lockToggle.js'
import { addModels } from './addModels.js'
//function find image in window
//function find active window
//function space - expand toggle
//function scroll recompare active image
//var active image url

//resimplify all my meshes. to squares ok. really simple. 
//after everything we can try shitty uv mapping. 



// let renderPass
// let outlinePass
export const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
//tone down the tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.4 // Lower the exposure to tone down the HDRI
renderer.outputEncoding = THREE.sRGBEncoding
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const composer = postprocessing(scene, camera, renderer)
composer.outline.selectedObjects = []

const pointer = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
const clock = new THREE.Clock()
let controls
camera.position.set(0, 3.5, -5)
camera.lookAt(new THREE.Vector3(0,2,6));

export const meshes = {}
const objects = []
let selectedObjects = []
let prevTime = performance.now()
const velocity = new THREE.Vector3()
const direction = new THREE.Vector3()

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;



export let name
export let intersects
let portfolioTabVisible = false
let wipTabVisible = false
let contactTabVisible = false
export let objNames = ['wip', 'portfolio', 'contact']
export let specialNames = ['wip', 'portfolio', 'contact']
export let disableToggle = false
export let specialNamesToggles = [wipTabVisible, portfolioTabVisible, contactTabVisible]
export let tempLockPanels = []
export function modifyTemp( value ) { tempLockPanels = value; }

export let message = "";
export let messageSpace = document.getElementById("messages")

export function changeMessage (newMessage) {
	// console.log(newMessage)
	messageSpace.textContent=newMessage;
	// update the message with the new thing p element 
}
export let data = ["wip", "contact", "portfolio"];

export function changePopupZ (name, data) {
	// console.log("meowowwwo: ", name, data)
	let indices = ["7", "6", "5"]
	let index = data.indexOf(name);	
	data.unshift(data.splice(index, 1)[0]);
	// data.unshift(data.splice(index, 1, name));
	//delete that thing and then add it back. delete one thing
	console.log("meow: ", data)
	for (let i = 0; i < data.length; i++) {
		// console.log(indices[i].toString())
		document.getElementById(data[i]).style.zIndex = indices[i];
		console.log("RAWR: ", document.getElementById(data[i]).style.zIndex)
	}
}




// every ten seconds we change it to one of the randoms
// the other chagnes override this though because they are triggered by specific EventSource
// get time seconds is in an interval of ten. 
// module ten = 0



pixelate(2, 0); 

//updated the hdri a little bit
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const hdrLoader = new RGBELoader()
hdrLoader.load('./sky-green1.hdr', function (texture) {
	const envMap = pmremGenerator.fromEquirectangular(texture).texture
	scene.environment = envMap
	scene.background = envMap
	texture.dispose()
	pmremGenerator.dispose()
})

init()
animate()

function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	// document.body.appendChild(renderer.domElement)
	document.getElementById('renderer').appendChild(renderer.domElement)


	//lights
	meshes.defaultLight = addLight()
	// meshes.secondLight = addSecondLight()

	controls = new PointerLockControls(camera, document.body)
	const blocker = document.getElementById('blocker')
	const instructions = document.getElementById('instructions')
	const enterbutton = document.getElementById('enterbutton')
	const crosshair = document.getElementById('crosshair')
	const deco = document.getElementsByClassName('deco')
	// console.log(deco)
	
	

	enterbutton.addEventListener('click', function () {
		controls.lock()
	})

	controls.addEventListener('lock', function () {
		instructions.style.display = 'none'
		blocker.style.display = 'none'
		crosshair.style.display = 'flex'
		for (let i = 0; i < deco.length; i++) {
			deco[i].style.display = 'flex'	
		}

		disableToggle = false
		lockToggle(disableToggle, tempLockPanels, specialNamesToggles)
	})

	controls.addEventListener('unlock', function () {
		blocker.style.display = 'block'
		instructions.style.display = ''
		crosshair.style.display = 'none'
		for (let i = 0; i < deco.length; i++) {
			deco[i].style.display = 'none'	
		}

		disableToggle = true
		lockToggle(disableToggle, tempLockPanels, specialNamesToggles)
	})
	scene.add(controls.getObject())

	const onKeyDown = function ( event ) {
		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = true;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = true;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = true;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = true;
				break;

			case 'Space':
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
		// console.log("key pressed")
	};

	const onKeyUp = function ( event ) {
		switch ( event.code ) {

			case 'ArrowUp':
			case 'KeyW':
				moveForward = false;
				break;

			case 'ArrowLeft':
			case 'KeyA':
				moveLeft = false;
				break;

			case 'ArrowDown':
			case 'KeyS':
				moveBackward = false;
				break;

			case 'ArrowRight':
			case 'KeyD':
				moveRight = false;
				break;
		}
	};

	document.addEventListener( 'keydown', onKeyDown );
	document.addEventListener( 'keyup', onKeyUp );

	raycaster = new THREE.Raycaster(
		new THREE.Vector3(),
		new THREE.Vector3(0, -1, 0),
		0,
		10
	)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	window.addEventListener('resize', onWindowResize)
	addModels()
	window.addEventListener('pointermove', onPointerMove)
}

function testOutline() {
	//add objs to outline pass
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const mesh = new THREE.Mesh(geometry, material)
	mesh.position.set(0, 1, 1)
	//scene.add(mesh)
	// composer.outline.selectedObjects = [
	// 	meshes.portfolio3.children[0],
	// 	// meshes.portfolio3.children[0],
	// ]
	// composer.outline.selectedObjects = [meshes.portfolio2.children[0]]
	// console.log('meshes.portfolio 3: ', meshes)
}

//document.addEventListener('click', testOutline)

function onPointerMove(event) {
	//primary thing
	// pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.x = 0;
	pointer.y = 0;
	// pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
	// console.log(pointer.x, ", ", pointer.y)

	//now as a separate issue, im not sure why the movement of the camera is not smooth

	raycaster.setFromCamera(pointer, camera)
	intersects = raycaster.intersectObjects( scene.children );
	name = intersects[ 0 ].object.userData.name
	// console.log("name: ", name)
	// console.log("intersects.object: ", intersects[ 0 ].object.userData)

	// outline
	// console.log(intersects.length)
	if (intersects.length == 0) {
		// composer.outline.selectedObjects = [];
		// console.log("no")
	} else {
		// console.log("hi")
		if (objNames.indexOf(name) !== -1) {
			const selectedObject = intersects[ 0 ].object
			addSelectedObject( selectedObject )
			composer.outline.selectedObjects = selectedObjects
			changeMessage ("find all the popup windows!")
		}
	}
}

function addSelectedObject( object ) {
	selectedObjects = [];
	selectedObjects.push( object );
}

window.addEventListener('click', function () {
	clickToggle()
})

//html link
window.addEventListener('keydown', (event) => {
	// now im thinking that these should all be iframes. that open on the right side. is it ok to make these iframes? 
	// console.log(event.key);
	if (event.key == "n") {
		window.open( "https://github.com/xaralu/Moomoo-Saves-Him" )
	}
	if (event.key == "b") {
		window.open( "https://docs.google.com/presentation/d/1Veno8a08tORjJKa1j_Le7i1eOohGiC6FEuTHfTrCPA0/edit#slide=id.p" )
		// lowkey might make this one an iframe. ???? 
	}
	if (event.key == "r") {
		// radial pond deployement
		window.open( "" )
	}
	if (event.key == "j") {
		// kitty cat documentation iframe
		window.open( "" )
	}
});

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	pixelate(2, 0); 
	changeMessage("window resized!")
}

function pixelate(tileSize = 10, sigmaGauss = 2) {
	tileSize = tileSize < 1 ? 1 : tileSize;
	sigmaGauss = sigmaGauss < 1 ? 1 : sigmaGauss;
  
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
  
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
  
	ctx.fillStyle = "rgba(0, 0, 0, 0.642)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
  
	// only to make the output visible
	// document.body.appendChild(canvas);
  
	const rows = canvas.height / tileSize;
	const cols = canvas.width / tileSize;
	for (let r = 0; r < rows; r++) {
	  for (let c = 0; c < cols; c++) {
		ctx.fillStyle = "white";
  
		ctx.fillRect(
		  c * tileSize - 1 + Math.floor(tileSize / 2),
		  r * tileSize - 1 + Math.floor(tileSize / 2),
		  1,
		  1
		);
	  }
	}
  
	const pixelate = document.getElementById("pixelate");
	pixelate.innerHTML = "";
  
	const blur = document.createElementNS(
	  "http://www.w3.org/2000/svg",
	  "feGaussianBlur"
	);
	blur.setAttribute("in", "SourceGraphic");
	blur.setAttribute("stdDeviation", sigmaGauss);
	blur.setAttribute("result", "blurred");
  
	const hmap = document.createElementNS(
	  "http://www.w3.org/2000/svg",
	  "feImage"
	);
	const hmapUrl = canvas.toDataURL();
	hmap.setAttribute("href", hmapUrl);
	hmap.setAttribute("result", "hmap");
  
	const blend = document.createElementNS(
	  "http://www.w3.org/2000/svg",
	  "feBlend"
	);
	// blend.setAttribute("mode", "lighten");
	blend.setAttribute("mode", "multiply");
	blend.setAttribute("in", "blurred");
	blend.setAttribute("in2", "hmap");
  
	const morph = document.createElementNS(
	  "http://www.w3.org/2000/svg",
	  "feMorphology"
	);
	morph.setAttribute("operator", "dilate");
	morph.setAttribute("radius", tileSize / 2);
  
	pixelate.setAttribute("width", canvas.width);
	pixelate.setAttribute("height", canvas.height);
	pixelate.appendChild(blur);
	pixelate.appendChild(hmap);
	pixelate.appendChild(blend);
	// pixelate.appendChild(morph);
  }



function randMessage(){ 
	let randMessages = ["click anywhere to close popups", "open all the popups!", "you better have checked the legal agreement", "watch out for ol benny", "i basically live in here..", "sorry my shit is really messy", "i love having art on my walls"]
	let randIndex = Math.floor(Math.random() * 4);
	changeMessage(randMessages[randIndex])
	
};

setInterval(randMessage, 10000);

function animate() {

	// // time based message change
	// let randMessages = ["click anywhere to close popups", "open all the popups!", "hover over any hearts!!"]
	// let meow = new Date();
	// var now = new Date().getTime();
	// let seconds = Math.floor((now % (1000 * 60)) / 1000);
	// // console.log("seconds: ", seconds)
	// console.log("milliseconds: ", meow.getMilliseconds())
	// if (seconds % 10 == 0) {
	// 	console.log("interval of ten")
		
	// 	// return just staops everything cuz i guess its stuck in this loop then?
	// 	// need to be more exact about the time that we use
	// }
	// //dont think i can do it based on a timer l;ike thjat. 
	
	

	requestAnimationFrame(animate)
	const time = performance.now()

	if (controls.isLocked === true) {
		raycaster.ray.origin.copy(controls.getObject().position)
		raycaster.ray.origin.y -= 10

		const intersections = raycaster.intersectObjects(objects, false)

		// const onObject = intersections.length > 0

		const delta = (time - prevTime) / 1000

		velocity.x -= velocity.x * 20.0 * delta
		velocity.z -= velocity.z * 20.0 * delta
		// velocity.y -= 10.8 * 100.0 * delta // 100.0 = mass

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
		// if ( onObject === true ) {
		// 	velocity.y = Math.max( 0, velocity.y );
		// 	canJump = true;
		// }

		controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );

		// controls.getObject().position.y += ( velocity.y * delta ); // new behavior
		// if ( controls.getObject().position.y < 10 ) {
		// 	velocity.y = 0;
		// 	controls.getObject().position.y = 10;
		// 	canJump = true;
		// }


		//modify position
		if ( controls.getObject().position.z > 2 ) {
			controls.getObject().position.z = 2;
		}
		if ( controls.getObject().position.z < -4 ) {
			controls.getObject().position.z = -4;
		}
		if ( controls.getObject().position.x > 3 ) {
			controls.getObject().position.x = 3;
		}
		if ( controls.getObject().position.x < -2 ) {
			controls.getObject().position.x = -2;
		}
		
	}

	prevTime = time
	// console.log(scene.children)
	//renderer.render(scene, camera)
	composer.composer.render()
}

// pixellation filter found here: 
// https://stackoverflow.com/questions/66624701/pixelate-a-whole-webpage
//used the second option listed
