import * as THREE from 'three'
import React, { JSX } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

export const ActivityModel = () => {

}

type ActionName = 'Cylinder.003Action' | 'Cylinder.004Action'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Cylinder: THREE.Mesh
    Cylinder002: THREE.Mesh
    Cylinder003: THREE.Mesh
    Cylinder004: THREE.Mesh
  }
  materials: {
    ['Material.002']: THREE.MeshStandardMaterial
    ['Material.001']: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials, animations } = useGLTF('/palka.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group name="Scene">
        <mesh name="Cylinder" castShadow receiveShadow geometry={nodes.Cylinder.geometry} material={materials['Material.002']} rotation={[Math.PI / 2, 0, 0]} scale={[1, 6.534, 1]} />
        <mesh name="Cylinder002" castShadow receiveShadow geometry={nodes.Cylinder002.geometry} material={materials['Material.001']} rotation={[Math.PI / 2, 0, 0]} scale={[1, 6.534, 1]} />
        <mesh name="Cylinder003" castShadow receiveShadow geometry={nodes.Cylinder003.geometry} material={materials['Material.001']} position={[0, 0, -0.003]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 6.534, 1]} />
        <mesh name="Cylinder004" castShadow receiveShadow geometry={nodes.Cylinder004.geometry} material={materials['Material.001']} position={[0, 0, -0.003]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 6.534, 1]} />
      </group>
    </group>
  )
}

useGLTF.preload('/palka.glb')