"use client"
import { Canvas, Vector3, useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import './page.scss';
import { Box, Image, OrbitControls } from "@react-three/drei";

export default function Home() {
  return (
    <Canvas>
      <Suspense>
        {/* <Scene url='./textures/magic_card.jpg' position={[1.5, 0, 0]} /> */}
        <Scene url='./textures/ac_right_hand.png' position={[-1, 0, 0]} />
        <Scene url='./textures/ac_body.png' position={[0, 0, 0]} />
        <Scene url='./textures/ac_left_hand.png' position={[1, 0, 0]} />
        <Scene url='./textures/ac_left_leg.png' position={[0.5, -1.618, 0]} />
        <Scene url='./textures/ac_right_leg.png' position={[-0.5, -1.618, 0]} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

function Scene({ url, position }: { url: string, position: Vector3 }) {
  const ref = useRef<Mesh | null>(null);
  const [turning, setTurning] = useState<boolean>(false);
  useFrame((_, delta: number) => {
    if (ref?.current?.rotateY !== undefined && turning) {
      ref.current.rotation.y += (Math.PI + 0.7) / 60 / 2;
      console.log(ref.current.rotation.y)
    }
  })
  useEffect(() => {
    if (turning) {
      setTimeout(() => {
        setTurning(false)
      }, 1000);
    } else {
      if (ref?.current?.rotateY !== undefined) {
        console.log(ref.current.rotation.y % (Math.PI * 2))
        ref.current.rotation.y = ref.current.rotation.y % (Math.PI * 2) > Math.PI ? Math.PI : 0
      }
    }
  }, [turning])
  return (
    <>
      <mesh ref={ref} position={position}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <Image scale={[1, 1.618]} url={url} />
        <Box onClick={() => {
          setTurning(true);
        }} args={[1, 1.618, 0.001]} position={[0, 0, -0.001]} material-color={'gray'} />
      </mesh>
    </>
  )
}