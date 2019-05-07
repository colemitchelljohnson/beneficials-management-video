import React, { useState, useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const Loader = ({ path, url }) => {
  const [gltf, set] = useState()
  useMemo(() => {
    var loader = new GLTFLoader().setPath('../../models/dama_de_elche')
    loader.load('scene.gltf', set)
  }, [url])
  return gltf
  ?
      <>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.5} position={[300, 300, 4000]} />
        <primitive object={gltf.scene.children[0].children[1]} />
      </>
  : null
}

export default Loader;