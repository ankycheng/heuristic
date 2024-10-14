import * as THREE from 'three'

export function addLight() {
	const light = new THREE.DirectionalLight(0x88D8C0, 10)
	light.position.set(10, 10, -5)
	return light
}

// export function addSecondLight() {
// 	const light = new THREE.AmbientLight(0xD8F2EA, 0.6 )
// 	light.position.set(0,0,0)
// 	return light
// }
