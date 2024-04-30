"use client"
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
// import card from '../textures/magic_card.jpg'
import './page.scss';
import { Box, Image, OrbitControls } from "@react-three/drei";

export default function Home() {
  return (
    <Canvas>
      <Suspense>
        <Scene url='./textures/magic_card.jpg' position={[1.5, 0, 0]} />
        <Scene url='./textures/magic_card.jpg' position={[-1.5, 0, 0]} />
        <Scene url='./textures/magic_card.jpg' position={[0, 0, 0]} />
        {/* <OrbitControls /> */}
      </Suspense>
    </Canvas>
  );
}

function Scene({ url, position }: { url: string, position: number[] }) {
  const ref = useRef<Mesh | null>(null);
  const [turning, setTurning] = useState<boolean>(false);
  useFrame((_, delta: number) => {
    if (ref?.current?.rotateY !== undefined && turning) {
      ref.current.rotation.y += Math.PI / 60 / 2;
    }
  })
  useEffect(() => {
    if (turning) {
      setTimeout(() => {
        setTurning(false)
      }, 1000);
    }
  }, [turning])
  return (
    <>
      <mesh ref={ref} position={position}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <Image scale={[1, 1.618, 1]} url={url} />
        <Box onClick={() => {
          setTurning(true);
        }} args={[1, 1.618, 0.001]} position={[0, 0, -0.001]} material-color={'gray'} />
      </mesh>
    </>
  )
}