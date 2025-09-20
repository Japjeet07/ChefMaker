'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { EXTERNAL_URLS } from '../../constants';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

class Scene {
  views: Array<{ bottom: number; height: number; camera?: THREE.PerspectiveCamera }>;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  light: THREE.PointLight;
  softLight: THREE.AmbientLight;
  modelGroup: THREE.Group;
  w: number = 0;
  h: number = 0;

  constructor(model: THREE.Group) {
    this.views = [
      { bottom: 0, height: 1 }
    ];
    
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(this.renderer.domElement);
    
    // scene
    this.scene = new THREE.Scene();
    
    const view = this.views[0];
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.fromArray([0, 0, 180]);
    view.camera = camera;
    camera.lookAt(new THREE.Vector3(0, 5, 0));
    
    // light
    this.light = new THREE.PointLight(0xffffff, 1.0);
    this.light.position.z = 150;
    this.light.position.x = 70;
    this.light.position.y = -20;
    this.light.castShadow = true;
    this.scene.add(this.light);

    this.softLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.softLight);
    
    // Add additional lighting to ensure the brown color is visible
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-50, 50, 50);
    this.scene.add(fillLight);

    // group
    this.onResize();
    window.addEventListener('resize', this.onResize, false);
    
    this.modelGroup = new THREE.Group();
    this.modelGroup.add(model);
    this.scene.add(this.modelGroup);
  }
  
  render = () => {
    const camera = this.views[0].camera!;
    this.renderer.setViewport(0, 0, this.w, this.h);
    this.renderer.setScissorTest(false);
    camera.aspect = this.w / this.h;
    this.renderer.render(this.scene, camera);
  }
  
  onResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    
    const camera = this.views[0].camera!;
    camera.aspect = this.w / this.h;
    const camZ = (screen.width - (this.w * 1)) / 3;
    camera.position.z = camZ < 180 ? 180 : camZ;
    camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);		
    this.render();
  }
}

function loadModel() {
  gsap.registerPlugin(ScrollTrigger);
  
  var object: THREE.Group;

  function onModelLoaded() {
    console.log('Applying materials to airplane model...');
    
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        console.log('Applying material to mesh:', child.name || 'unnamed');
        
        // Create the exact material from the original
        const mat = new THREE.MeshPhongMaterial({ 
          color: 0xC0C0C0,  // Silver color
          specular: 0xFFFFFF, 
          shininess: 30, 
          flatShading: true,
          side: THREE.DoubleSide  // Ensure both sides are visible
        });
        
        child.material = mat;
        child.castShadow = true;
        child.receiveShadow = true;
        
        console.log('Material applied:', mat.color.getHexString());
      }
    });

    console.log('Airplane model ready with materials applied');
    setupAnimation(object);
  }

  // Try to load the original airplane model, fallback to custom model
  const manager = new THREE.LoadingManager(onModelLoaded);
  manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

  const loader = new OBJLoader(manager);
  
  // Try to load the local airplane model first, then external
  loader.load(
    '/1405+Plane_1.obj',
    function (obj) { 
      console.log('Loaded local airplane model');
      object = obj; 
    },
    function (progress) {
      console.log('Loading progress:', progress);
    },
    function (error) {
      console.log('Failed to load local model, trying external:', error);
      // Try external model
      loader.load(
        EXTERNAL_URLS.PLANE_MODEL,
        function (obj) { 
          console.log('Loaded external airplane model');
          object = obj; 
        },
        function (progress) {
          console.log('Loading progress:', progress);
        },
        function (error) {
          console.log('Failed to load external model, using custom airplane:', error);
          // Fallback to custom airplane model
          createCustomAirplane();
        }
      );
    }
  );

  function createCustomAirplane() {
    const airplaneGroup = new THREE.Group();
    
    // Main fuselage (more detailed)
    const fuselageGeometry = new THREE.CylinderGeometry(1.5, 2.5, 35, 12);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x8B4513,  // Saddle brown color
      specular: 0xD0CBC7, 
      shininess: 5, 
      flatShading: true 
    });
    
    const fuselage = new THREE.Mesh(fuselageGeometry, material);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.position.y = 0;
    airplaneGroup.add(fuselage);
    
    // Main wings (more realistic shape)
    const wingGeometry = new THREE.BoxGeometry(50, 0.8, 12);
    const wing = new THREE.Mesh(wingGeometry, material);
    wing.position.set(0, 0, 0);
    airplaneGroup.add(wing);
    
    // Wing tips
    const wingTipGeometry = new THREE.BoxGeometry(8, 0.6, 3);
    const leftWingTip = new THREE.Mesh(wingTipGeometry, material);
    leftWingTip.position.set(0, 0, -7.5);
    airplaneGroup.add(leftWingTip);
    
    const rightWingTip = new THREE.Mesh(wingTipGeometry, material);
    rightWingTip.position.set(0, 0, 7.5);
    airplaneGroup.add(rightWingTip);
    
    // Vertical tail fin
    const tailFinGeometry = new THREE.BoxGeometry(2, 15, 0.8);
    const tailFin = new THREE.Mesh(tailFinGeometry, material);
    tailFin.position.set(-16, 0, 0);
    airplaneGroup.add(tailFin);
    
    // Horizontal tail
    const horizontalTailGeometry = new THREE.BoxGeometry(12, 0.6, 2);
    const horizontalTail = new THREE.Mesh(horizontalTailGeometry, material);
    horizontalTail.position.set(-16, 0, 0);
    airplaneGroup.add(horizontalTail);
    
    // Engine nacelles
    const engineGeometry = new THREE.CylinderGeometry(1.2, 1.5, 8, 8);
    const leftEngine = new THREE.Mesh(engineGeometry, material);
    leftEngine.position.set(8, 0, -8);
    leftEngine.rotation.z = Math.PI / 2;
    airplaneGroup.add(leftEngine);
    
    const rightEngine = new THREE.Mesh(engineGeometry, material);
    rightEngine.position.set(8, 0, 8);
    rightEngine.rotation.z = Math.PI / 2;
    airplaneGroup.add(rightEngine);
    
    // Propellers
    const propGeometry = new THREE.BoxGeometry(0.3, 6, 0.1);
    const leftProp = new THREE.Mesh(propGeometry, material);
    leftProp.position.set(12, 0, -8);
    leftProp.rotation.z = Math.PI / 2;
    airplaneGroup.add(leftProp);
    
    const rightProp = new THREE.Mesh(propGeometry, material);
    rightProp.position.set(12, 0, 8);
    rightProp.rotation.z = Math.PI / 2;
    airplaneGroup.add(rightProp);
    
    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(2, 8, 6);
    const cockpit = new THREE.Mesh(cockpitGeometry, material);
    cockpit.position.set(10, 0, 0);
    cockpit.scale.set(1, 0.6, 0.8);
    airplaneGroup.add(cockpit);
    
    // Landing gear
    const gearGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 6);
    const frontGear = new THREE.Mesh(gearGeometry, material);
    frontGear.position.set(8, -2, 0);
    airplaneGroup.add(frontGear);
    
    const leftGear = new THREE.Mesh(gearGeometry, material);
    leftGear.position.set(-5, -2, -6);
    airplaneGroup.add(leftGear);
    
    const rightGear = new THREE.Mesh(gearGeometry, material);
    rightGear.position.set(-5, -2, 6);
    airplaneGroup.add(rightGear);
    
    object = airplaneGroup;
    onModelLoaded();
  }
}

function setupAnimation(model: THREE.Group) {
  const scene = new Scene(model);
  const plane = scene.modelGroup;
  
  // Configure ScrollTrigger for mobile compatibility
  ScrollTrigger.config({
    ignoreMobileResize: true,
    syncInterval: 16, // 60fps
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });

  // Force refresh on mobile devices
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
  
  gsap.fromTo('canvas', { x: "50%", autoAlpha: 0 }, { duration: 1, x: "0%", autoAlpha: 1 });
  gsap.to('.loading', { autoAlpha: 0 });
  gsap.to('.scroll-cta', { opacity: 1 });
  gsap.set('svg', { autoAlpha: 1 });
  
  const tau = Math.PI * 2;

  // Exact setup from original teststyle
  gsap.set(plane.rotation, { y: tau * -.25 });
  gsap.set(plane.position, { x: 80, y: -32, z: -60 });
  gsap.set(plane.scale, { x: 0.8, y: 0.8, z: 0.8 }); // Make plane bigger for better visibility
  
  scene.render();
  
  const sectionDuration = 12; // Even slower movement for better visibility
  
  gsap.to('.ground', {
    y: "30%",
    scrollTrigger: {
      trigger: ".ground-container",
      scrub: true,
      start: "top bottom",
      end: "bottom top"
    }
  });
  
  // Animate clouds in all cloud areas
  gsap.from('.parallax.clouds', {
    y: "25%",
    scrollTrigger: {
      trigger: ".h-screen",
      scrub: true,
      start: "top bottom",
      end: "bottom top"
    }
  });

  gsap.from('.ground-container .clouds', {
    y: "25%",
    scrollTrigger: {
      trigger: ".ground-container",
      scrub: true,
      start: "top bottom",
      end: "bottom top"
    }
  });
  
  gsap.to('#line-length', {
    opacity: 1,
    scrollTrigger: {
      trigger: ".length",
      scrub: true,
      start: "top bottom",
      end: "top top"
    }
  });
  
  gsap.to('#line-wingspan', {
    opacity: 1,
    scrollTrigger: {
      trigger: ".wingspan",
      scrub: true,
      start: "top 25%",
      end: "bottom 50%"
    }
  });	
  
  gsap.to('#circle-phalange', {
    opacity: 1,
    scrollTrigger: {
      trigger: ".phalange",
      scrub: true,
      start: "top 50%",
      end: "bottom 100%"
    }
  });
  
  gsap.to('#line-length', {
    opacity: 0,
    scrollTrigger: {
      trigger: ".length",
      scrub: true,
      start: "top top",
      end: "bottom top"
    }
  });
  
  gsap.to('#line-wingspan', {
    opacity: 0,
    scrollTrigger: {
      trigger: ".wingspan",
      scrub: true,
      start: "top top",
      end: "bottom top"
    }
  });	
  
  gsap.to('#circle-phalange', {
    opacity: 0,
    scrollTrigger: {
      trigger: ".phalange",
      scrub: true,
      start: "top top",
      end: "bottom top"
    }
  });
  
  const tl = gsap.timeline({
    onUpdate: scene.render,
    scrollTrigger: {
      trigger: ".content",
      scrub: 1, // Faster scrub for mobile responsiveness
      start: "top top",
      end: "bottom bottom",
      anticipatePin: 1,
      refreshPriority: -1,
      onUpdate: (self) => {
        // Force render on mobile
        if (window.innerWidth <= 768) {
          scene.render();
        }
      }
    },
    defaults: { duration: sectionDuration, ease: 'power2.inOut' }
  });
  
  let delay = 10;
  
  // Hide scroll CTA
  tl.to('.scroll-cta', { duration: 0.25, opacity: 0 }, delay);
  
  // 1. Left → Straight
  tl.to(plane.rotation, { x: tau * .25, y: 0, z: -tau * 0.05, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: -40, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // Straight (center) - plane faces forward, no banking
//   tl.to(plane.rotation, { x: 0, y: 0, z: 0, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 0, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // 2. Right → Straight
  tl.to(plane.rotation, { x: tau * .25, y: 0, z: tau * 0.05, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 40, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // Straight (center) - plane faces forward, no banking
//   tl.to(plane.rotation, { x: 0, y: 0, z: 0, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 0, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // 3. Left → Straight
  tl.to(plane.rotation, { x: tau * .25, y: 0, z: -tau * 0.05, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: -40, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // Straight (center) - plane faces forward, no banking
//   tl.to(plane.rotation, { x: 0, y: 0, z: 0, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 0, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // 4. Right → Straight
  tl.to(plane.rotation, { x: tau * .25, y: 0, z: tau * 0.05, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 40, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // Straight (center) - plane faces forward, no banking
//   tl.to(plane.rotation, { x: 0, y: 0, z: 0, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 0, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;

  tl.to(plane.rotation, { x: tau * .25, y: 0, z: -tau * 0.05, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: -40, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;
  
  // Straight (center) - plane faces forward, no banking
  tl.to(plane.rotation, { x: 0, y: 0, z: 0, ease: 'power0.none' }, delay);
  tl.to(plane.position, { x: 0, y: 25, z: -60, ease: 'power0.none' }, delay);
  
  delay += sectionDuration;



  
  
  // Final fly-away animation
  tl.to(plane.rotation, { duration: sectionDuration, x: 0, y: 0, z: 0, ease: 'power2.out' }, delay);
  tl.to(plane.position, { duration: sectionDuration , x: 0, y: 0, z: 800, ease: 'power2.out' }, delay);
  tl.to(plane.scale, { duration: sectionDuration , x: 0.2, y: 0.2, z: 0.2, ease: 'power2.out' }, delay);
  
  tl.to(scene.light.position, { duration: sectionDuration, x: 0, y: 0, z: 0 }, delay);
}

export default function CookingScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    loadModel();

    // Add mobile-specific event listeners
    const handleOrientationChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    };

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      
      const canvas = document.querySelector('canvas');
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      
      // Refresh ScrollTrigger on cleanup
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={containerRef} className="cooking-scene">
      <div className="loading">Loading</div>
    </div>
  );
}
