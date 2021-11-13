import React, { Suspense, useRef, useEffect } from 'react'
import { ReinhardToneMapping, Mesh, MeshStandardMaterial, Color } from 'three'
import '../utils/InfiniteGridHelper'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Sky,
  useGLTF,
  OrbitControls,
  PerspectiveCamera,
  Environment,
  useProgress,
  Html,
  useContextBridge,
  AdaptiveDpr
} from '@react-three/drei'
import { CarContext, useCarContext } from '../context/CarContext'
import ColorPicker from '../components/ColorPicker'

const Loader = () => {
  const { setShowColorPicker } = useCarContext()
  const { progress } = useProgress()

  useEffect(() => {
    return () => setShowColorPicker(true)
  }, [])

  return <Html center>{progress.toFixed(0)} % loaded</Html>
}

const Porsche = ({ carRef }) => {
  const { carColor } = useCarContext()
  const frWheel = useRef()
  const flWheel = useRef()
  const rrWheel = useRef()
  const rlWheel = useRef()
  const gridHelperRef = useRef()

  // Drei's useGLTF hook sets up draco automatically, that's how it differs from useLoader(GLTfroader, url)
  // { nodes, materials } are extras that come from useLoader, these do not exist in threejs/GLTFLoader
  // nodes is a named collection of meshes, materials a named collection of materials
  const porscheObject = useGLTF('/models/porsche/scene.gltf')

  porscheObject.nodes.root.children[0].traverse((n) => {
    if (n instanceof Mesh && n.material instanceof MeshStandardMaterial) {
      n.castShadow = false
      n.receiveShadow = false
    }
  })

  const frRim = porscheObject.nodes.mesh_5.clone()
  const frTyre = porscheObject.nodes.mesh_6.clone()

  const flRim = porscheObject.nodes.mesh_47.clone()
  const flTyre = porscheObject.nodes.mesh_48.clone()

  const rrRim = porscheObject.nodes.mesh_3.clone()
  const rrTyre = porscheObject.nodes.mesh_4.clone()

  const rlRim = porscheObject.nodes.mesh_62.clone()
  const rlTyre = porscheObject.nodes.mesh_63.clone()

  porscheObject.nodes.mesh_3.removeFromParent()
  porscheObject.nodes.mesh_4.removeFromParent()
  porscheObject.nodes.mesh_5.removeFromParent()
  porscheObject.nodes.mesh_6.removeFromParent()
  porscheObject.nodes.mesh_47.removeFromParent()
  porscheObject.nodes.mesh_48.removeFromParent()
  porscheObject.nodes.mesh_62.removeFromParent()
  porscheObject.nodes.mesh_63.removeFromParent()

  porscheObject.materials.paint.roughness = 1
  porscheObject.materials.paint.metalness = 0
  porscheObject.materials.paint.color = new Color(carColor)

  porscheObject.materials['930_tire'].roughness = 1
  porscheObject.materials['930_tire'].metalness = 0

  porscheObject.materials['930_rim'].roughness = 0.5
  porscheObject.materials['930_rim'].metalness = 1
  porscheObject.materials['930_rim'].color = new Color('#fff')

  // porscheObject.materials.glass.opacity = 0.5;
  // porscheObject.materials.glass.metalness = 1;
  // porscheObject.materials.glass.roughness = 1;

  porscheObject.materials['930_lights_refraction'].opacity = 0.7
  porscheObject.materials['930_lights_refraction'].color = new Color('#424242')

  // Animate model
  useFrame((state) => {
    // console.log("state ", state.clock.getDelta());
    const t = state.clock.getElapsedTime()
    // ref.current.rotation.y = Math.sin(t / 4) / 8;
    const rotationFactor = 1.9
    frWheel.current.rotation.x = t * rotationFactor
    flWheel.current.rotation.x = t * rotationFactor
    rrWheel.current.rotation.x = t * rotationFactor
    rlWheel.current.rotation.x = t * rotationFactor
    gridHelperRef.current.position.z = -t / 1.3
  })

  return (
    <>
      <group ref={carRef}>
        <primitive object={porscheObject.scene.children[0]} />
        <group ref={frWheel} position={[-0.83, 0.45, 1.6]} scale={0.8}>
          <mesh
            receiveShadow
            castShadow
            matrixWorld={frRim.matrixWorld}
            geometry={frRim.geometry}
            material={frRim.material}
          />
          <mesh receiveShadow castShadow geometry={frTyre.geometry} material={frTyre.material} />
        </group>
        <group ref={flWheel} position={[0.83, 0.45, 1.6]} scale={0.8}>
          <mesh receiveShadow castShadow geometry={flRim.geometry} material={flRim.material} />
          <mesh receiveShadow castShadow geometry={flTyre.geometry} material={flTyre.material} />
        </group>

        <group ref={rrWheel} position={[-0.95, 0.45, -1]} scale={0.8}>
          <mesh receiveShadow castShadow geometry={rrRim.geometry} material={rrRim.material} />
          <mesh receiveShadow castShadow geometry={rrTyre.geometry} material={rrTyre.material} />
        </group>

        <group ref={rlWheel} position={[0.95, 0.45, -1]} scale={0.8}>
          <mesh receiveShadow castShadow geometry={rlRim.geometry} material={rlRim.material} />
          <mesh receiveShadow castShadow geometry={rlTyre.geometry} material={rlTyre.material} />
        </group>
      </group>
      <infiniteGridHelper ref={gridHelperRef} />
    </>
  )
}

const Camera = () => {
  return <PerspectiveCamera makeDefault position={[3, 2, 4]} fov={50} />
}

const SpotLightComponent = ({ position = [-7, 3, -10] }) => {
  // const light = useRef();
  // useHelper(light, SpotLightHelper, "black");

  return (
    <spotLight
      // ref={light}
      castShadow
      position={position}
      color={'#fff'}
      intensity={5}
      shadow-mapSize-height={1024}
      shadow-mapSize-width={1024}
      shadow-radius={10}
      shadow-normalBias={0.03}
      power={7}
    />
  )
}

const Porsche3d = () => {
  const { showColorPicker } = useCarContext()
  const carRef = useRef()
  const ContextBridge = useContextBridge(CarContext)

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        mode="concurrent"
        onCreated={(state) => {
          state.gl.toneMapping = ReinhardToneMapping
          state.gl.toneMappingExposure = 2
        }}
      >
        <ContextBridge>
          <Camera far={2} />
          {/* <ambientLight color={"#fff"} intensity={0.5} /> */}
          <Sky distance={450000} sunPosition={[0, 2, 0]} inclination={0} azimuth={0.25} />
          <SpotLightComponent />
          <SpotLightComponent position={[7, 3, 10]} />
          <Suspense fallback={<Loader />}>
            <Porsche carRef={carRef} />
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
          <AdaptiveDpr pixelated />
          <OrbitControls
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={3}
            maxDistance={8}
            enablePan={false}
          />
        </ContextBridge>
      </Canvas>
      {showColorPicker && <ColorPicker />}
    </>
  )
}

export default Porsche3d
