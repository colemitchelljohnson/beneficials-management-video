import React, { useState } from 'react'
import * as THREE from 'three';
import { useSpring, animated } from 'react-spring/three'
import { useRender } from 'react-three-fiber';

var points = [];
for ( var i = 0; i < 10; i ++ ) {
  points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
}
const Grid = () => {
  const [active, setActive] = useState(false)
  const [hovered, setHover] = useState(false)
  const { ...props } = useSpring({
    'material-opacity': hovered ? 0.6 : 0.25,
    scale: active ? [1.5, 1.5, 1.5] : [1, 1, 1],
    rotation: active ? [THREE.Math.degToRad(180), 0, THREE.Math.degToRad(45)] : [0, 0, 0],
    config: { mass: 600, tension: 800, friction: 500, precision: 0.00001 }
  })

  // const url = '../../images/torn-cloud.png';
  // const texture = useMemo(() => new THREE.TextureLoader().load(url), [url])
  return (
    <group>
      <ambientLight color="white" />
      <pointLight color="white" intensity={1} position={[10, 10, 10]} />
      <animated.mesh onClick={e => setActive(!active)} onPointerOver={e => setHover(true)} onPointerOut={e => setHover(false)} {...props}>
        <latheGeometry attach="geometry" args={points} />
        <meshBasicMaterial attach="material" color="yellow" />
      </animated.mesh>
    </group>
  )
}

export default Grid;