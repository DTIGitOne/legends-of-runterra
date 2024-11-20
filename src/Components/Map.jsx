import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Map(props) {
  const { nodes, materials } = useGLTF('./Model/Project.gltf')
  return (
    <group {...props} dispose={null}>
      <pointLight intensity={100} decay={2} position={[-0.932, 3.867, -0.229]} rotation={[-1.839, 0.602, 1.932]} />
      <mesh geometry={nodes.Plane.geometry} material={materials.Texture} position={[-0.138, 0.049, -0.059]} scale={[1.024, 1, 0.641]} />
    </group>
  )
}

useGLTF.preload('./Model/Project.gltf')