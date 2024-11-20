import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Map(props) {
  const { nodes, materials } = useGLTF('./Model/Project.gltf')
  return (
    <group {...props} dispose={null}>
      <pointLight intensity={1500} decay={2} position={[-1.825, 16.018, -2.579]} rotation={[-1.839, 0.602, 1.932]} />
      <mesh geometry={nodes.Plane.geometry} material={materials.Texture} position={[-0.138, 0.049, -0.059]} scale={[19.963, 28.351, 11.998]} />
    </group>
  )
}

useGLTF.preload('./Model/Project.gltf')