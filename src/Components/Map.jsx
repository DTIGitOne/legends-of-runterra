import React from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

// the 3d model render into a component using (npx gltfjsx (model path));
export function Map(props) {
  const { scene } = useGLTF('./Model/Project.gltf')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone)
  return (
    <group {...props} dispose={null}>
      <directionalLight intensity={6} decay={2} position={[0.855, 20.122, -0.426]} rotation={[-2.303, -0.094, -0.967]} scale={[7.959, 1.317, 2.506]} target={nodes.Light001.target}>
        <primitive object={nodes.Light001.target} position={[0, 0, -1]} />
      </directionalLight>
      <mesh geometry={nodes.Plane.geometry} material={materials.Texture} position={[-0.138, 0.049, -0.059]} scale={[28.861, 28.351, 17.601]} />
    </group>
  )
}

useGLTF.preload('./Model/Project.gltf')