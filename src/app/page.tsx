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
        <Card url='./textures/ac_right_hand.png' position={[-1, -1, 0]} />
        <Card url='./textures/ac_body.png' position={[0, -1, 0]} />
        <Card url='./textures/ac_left_hand.png' position={[1, -1, 0]} />
        <Card url='./textures/ac_left_leg.png' position={[0.5, -1, 2]} />
        <Card url='./textures/ac_right_leg.png' position={[-0.5, -1, 2]} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

function Card({ url, position }: { url: string, position: Vector3 }) {
  const ref = useRef<Mesh | null>(null);
  const [turning, setTurning] = useState<boolean>(false);
  const [isFliped, setIsFliped] = useState<boolean>(true);
  useFrame((_, delta: number) => {
    if (ref?.current?.rotateY === undefined || !turning) {
      return;
    }
    if (!isFliped) {
      if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
        ref.current.rotation.y += (Math.PI + 1) / 60;
      }
      if (ref.current.rotation.y % (Math.PI * 2) > Math.PI) {
        ref.current.rotation.y = Math.PI;
      }
    }
    if (isFliped) {
      if (ref.current.rotation.y % (Math.PI * 2) >= Math.PI) {
        ref.current.rotation.y += (Math.PI + 1) / 60;
      }
      if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
        ref.current.rotation.y = 0;
      }
    }
  })
  useEffect(() => {
    if (turning) {
      setTimeout(() => {
        setTurning(false)
      }, 1000);
    }
    if (ref.current) {
      ref.current.rotation.x = -Math.PI / 2
    }
  }, [turning])
  return (
    <>
      <mesh ref={ref} position={position}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <Image scale={[1, 1.618]} url={url} />
        <Box onClick={() => {
          if (turning) {
            return;
          }
          setTurning(true);
          setIsFliped((e: boolean) => !e)
        }} args={[1, 1.618, 0.001]} position={[0, 0, -0.001]} material-color={'gray'} />
      </mesh>
    </>
  )
}