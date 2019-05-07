import React from 'react'
import { apply, Canvas } from 'react-three-fiber'

import Camera from '../../components/Camera'

import { OrbitControls } from '../../resources/controls/OrbitControls'
apply({ OrbitControls })

const Environment = (props) => {
  return (
    <Canvas>
      <Camera />
      {props.children}
    </Canvas>
  )
}

export default Environment;