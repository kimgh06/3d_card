"use client"
import { Canvas, Vector3, useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import './page.scss';
import { Box, CameraControls, Image, OrbitControls } from "@react-three/drei";

export default function Home() {
  let Library = ['./textures/ac_right_hand.png', './textures/ac_body.png', './textures/ac_left_hand.png', './textures/ac_left_hand.png', './textures/ac_right_leg.png'];
  let creatures, lands, hand, graveyard;
  return (
    <Canvas>
      <Suspense>
        {Library.map((i: string, n: number) =>
          <Card key={n} url={i} position={[0, -0.01 * n - 1, 0]} type={n === 0 ? 'flip' : ''} />
        )}
        {/* <OrbitControls /> */}
        <Cam />
      </Suspense>
    </Canvas>
  );
}

function Cam() {
  const camcontrolRef = useRef<CameraControls | null>(null);
  useFrame(() => {
    // if (camcontrolRef.current) {
    //   const camposi: Vector3 = camcontrolRef.current.getPosition();
    //   console.log(camposi)
    // camcontrolRef.current.rotate(Math.PI / 4, 0, true);
    // camcontrolRef.current.zoom(-1, true);
    // }
  });
  useEffect(() => {
    if (camcontrolRef.current) {
      let posi = []
      camcontrolRef.current.setPosition(0, 2, 3);
      const camposi = camcontrolRef.current.getPosition();
      console.log(camposi.x, camposi.y, camposi.z)
      // camcontrolRef.current.rotate(Math.PI / 4, 0, true);
      // camcontrolRef.current.zoom(-1, true);
    }
  }, [])
  return <CameraControls ref={camcontrolRef} />
}

function Card({ url, position, type }: { url: string, position: Vector3, type?: string }) {
  const ref = useRef<Mesh | null>(null);
  const [turning, setTurning] = useState<boolean>(false);
  const [isFliped, setIsFliped] = useState<boolean>(true);
  useFrame((_, delta: number) => {
    if (ref?.current?.rotateY === undefined || !turning || type !== 'flip') {
      return;
    }
    if (!isFliped) {
      if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
        ref.current.rotation.y += (Math.PI + 1) / 60;
        if (ref.current.rotation.y % (Math.PI * 2) <= Math.PI / 2) {
          ref.current.position.y += 0.05
        } else {
          ref.current.position.y -= 0.05
        }
      }
      if (ref.current.rotation.y % (Math.PI * 2) > Math.PI) {
        ref.current.rotation.y = Math.PI;
        ref.current.position.y = position[1];
        // console.log(position[1])
      }
    }
    if (isFliped) {
      if (ref.current.rotation.y % (Math.PI * 2) >= Math.PI) {
        ref.current.rotation.y += (Math.PI + 1) / 60;
        if (ref.current.rotation.y % (Math.PI * 2) <= 3 * Math.PI / 2) {
          ref.current.position.y += 0.05
        } else {
          ref.current.position.y -= 0.05
        }
      }
      if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
        ref.current.rotation.y = 0;
        ref.current.position.y = position[1];
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
      ref.current.rotation.x = Math.PI / 2
      ref.current.rotation.z = Math.PI
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
        }} args={[1, 1.618, 0.001]} position={[0, 0, -0.001]} material-color={'black'} />
      </mesh>
    </>
  )
}