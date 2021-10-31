import React, { Suspense, useRef, useState, useEffect } from "react";
import { ReinhardToneMapping, Mesh, MeshStandardMaterial, Color } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Sky,
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useProgress,
  Html,
  useContextBridge,
} from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import { CarContext, useCarContext } from "../context/CarContext";

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(0)} % loaded</Html>;
};

const Porsche = () => {
  const { carColor } = useCarContext();
  const ref = useRef();

  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTFLoader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const porscheObject = useGLTF("/models/porsche/scene.gltf");
  porscheObject.scene.children[0].traverse((n) => {
    if (n instanceof Mesh && n.material instanceof MeshStandardMaterial) {
      if (n.material.name === "paint") {
        n.material.roughness = 1;
        n.material.metalness = 0;
        n.material.color = new Color(carColor);
      }

      if (n.material.name === "930_tire") {
        n.material.roughness = 1;
        n.material.metalness = 0;
      }

      if (n.material.name === "930_rim") {
        n.material.roughness = 0.5;
        n.material.metalness = 1;
        n.material.color = new Color("#fff");
      }

      if (n.material.name !== "glass") {
        n.castShadow = true;
        n.receiveShadow = true;
      } else {
        n.material.opacity = 0.5;
        n.material.metalness = 1;
        n.material.roughness = 1;
      }
    }
  });

  console.log("porsche object", porscheObject);
  // Animate model
  // useFrame((state) => {
  //   const t = state.clock.getElapsedTime();
  //   ref.current.rotation.y = Math.sin(t / 4) / 8;
  // });

  return <primitive ref={ref} object={porscheObject.scene.children[0]} />;
};

const ColorPicker = () => {
  const { carColor, setCarColor } = useCarContext();

  return (
    <div style={{ position: "fixed", top: "20px", left: "20px" }}>
      <HexColorPicker
        color={carColor}
        onChange={(color) => setCarColor(color)}
      />
    </div>
  );
};

const Camera = () => {
  return <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />;
};

const SpotLightComponent = ({ position = [-7, 3, -10] }) => {
  // const light = useRef();
  // useHelper(light, SpotLightHelper, "black");

  return (
    <spotLight
      // ref={light}
      castShadow
      position={position}
      color={"0xffeb1"}
      intensity={2}
      shadow-mapSize-height={2048}
      shadow-mapSize-width={2048}
      shadow-radius={10}
      shadow-normalBias={0.05}
      power={7}
    />
  );
};

const Porsche3d = () => {
  const colorPickerRef = useRef();
  const ContextBridge = useContextBridge(CarContext);
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        onCreated={(state) => {
          state.gl.toneMapping = ReinhardToneMapping;
          state.gl.toneMappingExposure = 2;
        }}
      >
        <ContextBridge>
          <Camera />
          <ambientLight color={"#fff"} intensity={0.5} />
          <Sky
            distance={450000}
            sunPosition={[0, 2, 0]}
            inclination={0}
            azimuth={0.25}
          />
          {/* <hemisphereLight
          skyColor={"0xffeb1"}
          groundColor={"0xffeb1"}
          intensity={0.1}
        /> */}
          <SpotLightComponent />
          <SpotLightComponent position={[7, 3, 10]} />
          <Suspense fallback={<Loader />}>
            <Porsche carColor={"#ff0000"} colorPickerRef={colorPickerRef} />
            <Environment preset="city" />
            {/* <ContactShadows
            rotation-x={Math.PI / 2}
            position={[0, -0.8, 0]}
            opacity={0.25}
            width={10}
            height={10}
            blur={1.5}
            far={0.8}
          /> */}
          </Suspense>
          <OrbitControls
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            enablePan={true}
          />
        </ContextBridge>
      </Canvas>
      <ColorPicker />
    </>
  );
};

export default Porsche3d;
