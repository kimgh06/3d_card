"use client"
import { Canvas, Vector2, Vector3, useFrame } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import './page.scss';
import { Box, CameraControls, Image, OrbitControls } from "@react-three/drei";
import { CardRefStore, CardStore } from './store';

export default function Home() {
  let Library = [
    './textures/ac_right_leg.png',
    './textures/ac_right_hand.png',
    './textures/ac_body.png',
    './textures/ac_left_hand.png',
    './textures/ac_left_leg.png',
  ];
  let creatures, lands, hand, graveyard;
  return (
    <Canvas>
      <Suspense>
        {Library.map((i: string, n: number) =>
          <Card key={n} id={n.toString()} url={i} position={[-2 + n * 1.2, 0, 2]} type={n === 0 ? 'top' : 'top'} />
        )}
        <Field position={[-2, 0, -1]} />
        <Field position={[0, 0, -1]} />
        <Field position={[2, 0, -1]} />
        <Field position={[-1, 0, 1]} />
        <Field position={[1, 0, 1]} />
        <Cam />
      </Suspense>
    </Canvas>
  );
}

function Cam() {
  const camcontrolRef = useRef<CameraControls | null>(null);
  useFrame(() => {
    if (camcontrolRef.current) {
      camcontrolRef.current.setPosition(0, 5, 1);
    }
  });
  return <CameraControls ref={camcontrolRef} />
}

function Field({ position = [0, 0, 0] }: { position?: Vector3 }) {
  const ref = useRef<Mesh | null>(null);
  const { cardNumber } = CardStore(e => e);
  const { refs, setRefPosition } = CardRefStore(e => e);
  useEffect(() => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2
      ref.current.rotation.z = Math.PI
    }
  }, [])
  return (
    <>
      <mesh ref={ref} position={position}
        onPointerUp={() => {
          if (!cardNumber || !position) {
            return;
          }
          setRefPosition(cardNumber, position);
        }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight />
        <Box args={[1, 1.618, 0.001]} position={[0, 0, 0.01]} material-color={'white'} />
      </mesh>
    </>
  )
}

function Card({ id, url, position, type }: { id: string, url: string, position: Vector3, type?: string }) {
  const ref = useRef<Mesh | null>(null);
  const [turning, setTurning] = useState<boolean | Vector2>(false);
  const [isFliped, setIsFliped] = useState<boolean>(true);
  const [drag, setDrag] = useState<boolean>(false);
  const [down, setDown] = useState<null | number[]>(null);
  const { setCardNumber } = CardStore(e => e);
  const { setRef, refs } = CardRefStore(e => e);
  useFrame((state, delta: number) => {
    if (!ref.current) {
      return;
    }
    if (drag && type === 'top') {
      ref.current.position.x = state.pointer.x * window.innerWidth / 240;
      ref.current.position.z = -state.pointer.y * window.innerHeight / 200;
      setRef(id, ref.current)
    }
    if (turning && type === 'top') {
      const upping = 0.07;
      if (!isFliped) {
        if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
          ref.current.rotation.y += (Math.PI + 1) / 60;
          if (ref.current.rotation.y % (Math.PI * 2) <= Math.PI / 2) {
            ref.current.position.y += upping
          } else {
            ref.current.position.y -= upping
          }
        }
        if (ref.current.rotation.y % (Math.PI * 2) > Math.PI) {
          ref.current.rotation.y = Math.PI;
          ref.current.position.y = position[1 as keyof Vector3];
        }
      }
      else if (isFliped) {
        if (ref.current.rotation.y % (Math.PI * 2) >= Math.PI) {
          ref.current.rotation.y += (Math.PI + 1) / 60;
          if (ref.current.rotation.y % (Math.PI * 2) <= 3 * Math.PI / 2) {
            ref.current.position.y += upping
          } else {
            ref.current.position.y -= upping
          }
        }
        if (ref.current.rotation.y % (Math.PI * 2) < Math.PI) {
          ref.current.rotation.y = 0;
          ref.current.position.y = position[1 as keyof Vector3];
        }
      }
    }
  })
  useEffect(() => {
    if (turning) {
      setTimeout(() => {
        setTurning(false);
        setDown(null);
      }, 500);
    }
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2
      ref.current.rotation.z = Math.PI
    }
    if (!refs[id]) {
      setRef(id, ref.current)
    }
  }, [turning])
  useEffect(() => {
    // console.log(id, refs[id]?.position)
    ref.current = refs[id]
  }, [refs])
  return (
    <>
      <mesh ref={ref} onPointerDown={e => {
        setDown([e.pointer.x, e.pointer.y]);
      }} onPointerMove={e => {
        if (down === null) {
          setCardNumber(null);
          return;
        }
        const range = 0.01;
        if (down[0] - e.pointer.x > range || down[0] - e.pointer.x < -range || down[1] - e.pointer.y > range || down[1] - e.pointer.y < -range) {
          setDrag(true);
          setCardNumber(id);
        }
      }} onPointerUp={e => {
        setDown(null);
        setDrag(false);
      }} position={position}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <Image scale={[1, 1.618]} url={url} />
        <Box onClick={() => {
          if (turning || drag) {
            return;
          }
          setTurning(true);
          setIsFliped((e: boolean) => !e)
        }} args={[1, 1.618, 0.001]} position={[0, 0, -0.001]} material-color={'black'} />
      </mesh>
    </>
  )
}