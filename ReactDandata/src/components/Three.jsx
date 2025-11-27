import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OutlineEffect } from "three/addons/effects/OutlineEffect.js";

export default function ThreeCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // === SCENE & RENDERER ===
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "inline-block";

    // === OUTLINE EFFECT ===
    const effect = new OutlineEffect(renderer, {
      defaultThickness: 0.005,
      defaultColor: [0, 0, 0],
      defaultAlpha: 1,
      defaultKeepAlive: true,
    });

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.01,
      100
    );
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 1, 0);

    // === LIGHT ===
    const light = new THREE.DirectionalLight(0x7577bd, 5);
    light.position.set(0, -5, 5);
    scene.add(light);

    // === VARIABLES ===
    let model;
    let rotationSpeed = 0.015;
    const baseRotationSpeed = 0.015;
    let jumpVelocity = 0;
    let isJumping = false;
    let groundY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // === RESIZE HANDLER ===
    const handleResize = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // === LOAD MODEL ===
    new GLTFLoader().load(
      "dandatabeforbake.glb",
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.35, 0.35, 0.35);
        model.position.y = -0.5;
        groundY = model.position.y;

        model.traverse((child) => {
          if (child.isMesh) {
            child.material.userData.outlineParameters = {
              thickness: 0.01,
              color: new THREE.Color(0x75ceee).toArray(),
              alpha: 1,
              visible: true,
            };
          }
        });

        scene.add(model);
      },
      undefined,
      (error) => console.error("Erreur chargement modèle :", error)
    );

    // === INTERACTION ===
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleClick = (event) => {
      if (isMobile) return; // désactive le clic sur mobile
      if (!model || isJumping) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      if (raycaster.intersectObject(model, true).length > 0) {
        isJumping = true;
        jumpVelocity = 0.09;
        rotationSpeed = 0.18;
      }
    };
    window.addEventListener("click", handleClick);

    // Change cursor en pointer quand survol du modèle
    const handleMouseMove = (event) => {
      if (!model) return;
      mouse.x = (event.clientX / mount.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / mount.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(model, true);
      mount.style.cursor = intersects.length > 0 ? "pointer" : "default";
    };
    window.addEventListener("mousemove", handleMouseMove);

    // === ANIMATION LOOP ===
    const animate = () => {
      requestAnimationFrame(animate);

      if (model) {
        model.rotation.y += rotationSpeed;

        if (isJumping) {
          model.position.y += jumpVelocity;
          jumpVelocity -= 0.003;

          if (jumpVelocity < 0) {
            const targetSpeed = baseRotationSpeed + 0.01;
            rotationSpeed += (targetSpeed - rotationSpeed) * 0.05;
          }

          if (model.position.y <= groundY) {
            model.position.y = groundY;
            if (Math.abs(jumpVelocity) > 0.01) {
              jumpVelocity = -jumpVelocity * 0.4;
            } else {
              jumpVelocity = 0;
              isJumping = false;
              rotationSpeed = baseRotationSpeed;
            }
          }
        }
      }

      effect.render(scene, camera);
    };

    animate();

    // === CLEANUP ===
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}
