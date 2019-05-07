import React, { useEffect, useRef } from 'react'
import { useRender, useThree } from 'react-three-fiber'

const Camera = (props) => {
  const camera = useRef()
  const controls = useRef()
  const { size, setDefaultCamera } = useThree()
  useEffect(() => void setDefaultCamera(camera.current), [])
  useRender(() => controls.current.update())
  return (
    <>
      <perspectiveCamera
        ref={camera}
        aspect={size.width / size.height}
        radius={(size.width + size.height) / 4}
        fov={55}
        position={[0, 0, 5]}
        onUpdate={self => self.updateProjectionMatrix()}
      />
      {camera.current && (
        <group>
          <orbitControls ref={controls} args={[camera.current]} enableDamping dampingFactor={0.1} rotateSpeed={0.1} />
        </group>
      )}
    </>
  )
}

export default Camera;