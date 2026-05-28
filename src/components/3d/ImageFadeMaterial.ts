/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-explicit-any */
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/**
 * ImageFadeMaterial
 * A custom WebGL shader material that crossfades between two textures smoothly.
 * This runs directly on the GPU, avoiding the memory leaks and crashes associated
 * with overlapping HTML5 videos or heavy React state changes on mobile devices.
 */
const ImageFadeMaterial = shaderMaterial(
  {
    uTexture1: null,
    uTexture2: null,
    uProgression: 0.0,
    uColor: new THREE.Color("#00f0ff"),
    uOpacity: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture1;
    uniform sampler2D uTexture2;
    uniform float uProgression;
    uniform vec3 uColor;
    uniform float uOpacity;
    
    varying vec2 vUv;
    
    void main() {
      // Sample both textures
      vec4 tex1 = texture2D(uTexture1, vUv);
      vec4 tex2 = texture2D(uTexture2, vUv);
      
      // Mix them based on progression
      vec4 finalTex = mix(tex1, tex2, uProgression);
      
      // Output with base opacity
      gl_FragColor = vec4(finalTex.rgb, finalTex.a * uOpacity);
      
      // Colorize very slightly with the app's neon color for cyberpunk feel
      gl_FragColor.rgb = mix(gl_FragColor.rgb, uColor, 0.05);
      
      // Apply linear to sRGB conversion for correct color space in R3F
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);

// Register it with R3F so it can be used as <imageFadeMaterial />
extend({ ImageFadeMaterial });

export { ImageFadeMaterial };

// Add TypeScript support for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      imageFadeMaterial: any;
    }
  }
}
