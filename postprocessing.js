import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'
// import { AfterimagePass } from '/three/examples/jsm/postprocessing/AfterImagePass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
// import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { Vector2 } from 'three'



export function postprocessing(scene, camera, renderer) {
	const composer = new EffectComposer(renderer)
	composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	composer.setSize(window.innerWidth, window.innerHeight)

	const renderPass = new RenderPass(scene, camera)
	composer.addPass(renderPass)

	// const glitchPass = new GlitchPass()

	const outlinePass = new OutlinePass(
		new Vector2(window.innerWidth, window.innerHeight),
		scene,
		camera
	)
	outlinePass.edgeStrength = 20
	outlinePass.pulsePeriod = 3;
	outlinePass.edgeGlow = 5
	outlinePass.edgeThickness = 5
	outlinePass.visibleEdgeColor.set('#ff0000') // Set outline color to red
	outlinePass.hiddenEdgeColor.set('#000000')
	

	composer.addPass(outlinePass)

	const pixelPass = new RenderPixelatedPass(6, scene, camera)
	pixelPass.normalEdgeStrength = 20 //change value to manipulate the strength of how well you can see the edges of shapes in the scene
	//composer.addPass(pixelPass)

	// const afterPass = new AfterimagePass()
	// afterPass.uniforms.damp.value = 0.19
	// //composer.addPass(afterPass)

	const bloomPass = new UnrealBloomPass()
	bloomPass.strength = 0.5
	// composer.addPass(bloomPass)
	// bloomPass.enabled = true

	const outputPass = new OutputPass()
	composer.addPass(outputPass)

	// const effectFilm = new FilmPass(0.15)
	// //composer.addPass(effectFilm)

	return {
		composer: composer,
		bloom: bloomPass,
		// after: afterPass,
		outline: outlinePass,
	}
}
