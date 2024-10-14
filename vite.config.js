import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            external: [
                "./three",
                './three/examples/jsm/postprocessing/EffectComposer',
                './three/examples/jsm/postprocessing/RenderPass',
                // './three/examples/jsm/postprocessing/GlitchPass',
                './three/examples/jsm/postprocessing/RenderPixelatedPass',
                // 'three/examples/jsm/postprocessing/AfterImagePass',
                './three/examples/jsm/postprocessing/UnrealBloomPass',
                './three/examples/jsm/postprocessing/OutputPass',
                './three/examples/jsm/postprocessing/OutlinePass.js',
                // './three/examples/jsm/postprocessing/FilmPass.js'
            ]
        },
      },
})


