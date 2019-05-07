import React, { useState } from 'react'
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three'
import { useRender } from 'react-three-fiber';

const Box = () => {
  const [active, setActive] = useState(false)
  const [hovered, setHover] = useState(false)
  const { ...props } = useSpring({
    'material-opacity': hovered ? 0.6 : 0.25,
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    rotation: active ? [THREE.Math.degToRad(180), 0, THREE.Math.degToRad(45)] : [0, 0, 0],
    config: { mass: 600, tension: 800, friction: 500, precision: 0.00001 }
  })
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  let i = 1;
  useRender(() => {

    console.log(i++);

    ctx.font = '20pt Arial';
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'yellow';
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(new Date().getTime(), canvas.width / 2, canvas.height / 2);

    return ctx;

  }, false)

  // const url = '../../images/torn-cloud.png';
  // const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
  return (
    <group>
      <ambientLight color="white" />
      <pointLight color="white" intensity={1} position={[10, 10, 10]} />
      <animated.mesh onClick={e => setActive(!active)} onPointerOver={e => setHover(true)} onPointerOut={e => setHover(false)} {...props}>
        <boxGeometry attach="geometry" args={[1, 2, 4, 2]} />
        <meshStandardMaterial attach="material">
          <canvasTexture name="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
        </meshStandardMaterial>
      </animated.mesh>
    </group>
  )
}

export default Box;