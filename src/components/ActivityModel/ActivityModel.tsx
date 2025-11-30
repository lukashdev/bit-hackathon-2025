"use client"
import * as THREE from 'three'
import { JSX, useState, useMemo, useRef, useEffect, Suspense } from 'react'
import { OrbitControls, useGLTF, useCursor, Html, useProgress } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Canvas, useThree } from '@react-three/fiber'
import { Box, Button, IconButton, Text, HStack, Center, Spinner, ChakraProvider } from '@chakra-ui/react'
import { Check, RotateCcw, RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toaster } from "@/components/ui/toaster"
import { useProfile, useUpdateInterests } from '@/hooks/use-api'
import { themeSystem } from '@/styles/theme'

type GLTFResult = GLTF & {
  nodes: {
    podloga: THREE.Mesh
    Sciana: THREE.Mesh
    matydojogi: THREE.Mesh
    hantle: THREE.Mesh
    gitara: THREE.Mesh
    ksiazki: THREE.Mesh
    walizka: THREE.Mesh
    puchar: THREE.Mesh
    zloto: THREE.Mesh
    kostkarubika: THREE.Mesh
    komputer: THREE.Mesh
    jedzenie: THREE.Mesh
    kubek: THREE.Mesh
    roslina: THREE.Mesh
    zegar: THREE.Mesh
    polki: THREE.Mesh
    sluchawki: THREE.Mesh
    gielda: THREE.Mesh
    Rekawice: THREE.Mesh
  }
  materials: {
    podloga: THREE.MeshStandardMaterial
    sciana: THREE.MeshStandardMaterial
    maty: THREE.MeshStandardMaterial
    hantle: THREE.MeshStandardMaterial
    gitara: THREE.MeshStandardMaterial
    ksiazki: THREE.MeshStandardMaterial
    walizka: THREE.MeshStandardMaterial
    zloto: THREE.MeshStandardMaterial
    kostkarubika: THREE.MeshStandardMaterial
    komputer: THREE.MeshStandardMaterial
    jedzenie: THREE.MeshStandardMaterial
    kubek: THREE.MeshStandardMaterial
    roslina: THREE.MeshStandardMaterial
    zegar: THREE.MeshStandardMaterial
    polki: THREE.MeshStandardMaterial
    sluchawki: THREE.MeshStandardMaterial
    gielda: THREE.MeshStandardMaterial
    rekawice: THREE.MeshStandardMaterial
  }
}

const modelToInterest: Record<string, string> = {
  matydojogi: 'Joga',
  hantle: 'Siłownia',
  gitara: 'Muzyka',
  ksiazki: 'Literatura',
  walizka: 'Podróże',
  puchar: 'Rywalizacja',
  zloto: 'Inwestowanie',
  kostkarubika: 'Łamigłówki',
  komputer: 'Technologia',
  jedzenie: 'Gotowanie',
  kubek: 'Kawa',
  roslina: 'Ogrodnictwo',
  zegar: 'Produktywność',
  sluchawki: 'Podcasty',
  gielda: 'Finanse',
  Rekawice: 'Sztuki walki',
}

const interestToModel = Object.entries(modelToInterest).reduce((acc, [model, interest]) => {
  acc[interest] = model;
  return acc;
}, {} as Record<string, string>);

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <ChakraProvider value={themeSystem}>
        <Spinner size="xl" color="brand.accent" />
      </ChakraProvider>
    </Html>
  )
}

const CameraController = ({ setControls }: { setControls: (controls: any) => void }) => {
  const ref = useRef<any>(null)
  const { camera, gl } = useThree()
  
  useEffect(() => {
    if (ref.current) {
      setControls(ref.current)
    }
  }, [setControls])

  return (
    <OrbitControls 
      ref={ref} 
      enablePan={false} 
      enableZoom={false} 
      enableRotate={false} 
      target={[2.04, 1.5, 0.01]}
    />
  )
}

export const ActivityModels = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [controls, setControls] = useState<any>(null)
  const router = useRouter()
  const { data: profile, isLoading: isProfileLoading } = useProfile()
  const { mutateAsync: updateInterests, isPending: isUpdating } = useUpdateInterests()
  const rotateInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (profile?.interests) {
      const initialSelected = profile.interests
        .map(interest => interestToModel[interest])
        .filter(Boolean)
      setSelected(initialSelected)
    }
  }, [profile])

  const handleSelect = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(s => s !== name))
    } else {
      if (selected.length < 5) {
        setSelected([...selected, name])
      } else {
         toaster.create({
            title: "Maksymalna liczba wybrana",
            description: "Możesz wybrać maksymalnie 5 przedmiotów",
            type: "warning",
        });
      }
    }
  }

  const handleRotate = (direction: 'left' | 'right') => {
    if (controls) {
      const currentAngle = controls.getAzimuthalAngle()
      const step = Math.PI / 18 // Faster rotation
      controls.setAzimuthalAngle(currentAngle + (direction === 'left' ? step : -step))
    }
  }

  const startRotate = (direction: 'left' | 'right') => {
    if (rotateInterval.current) return
    handleRotate(direction) // Immediate first step
    rotateInterval.current = setInterval(() => {
      handleRotate(direction)
    }, 16) // ~60fps
  }

  const stopRotate = () => {
    if (rotateInterval.current) {
      clearInterval(rotateInterval.current)
      rotateInterval.current = null
    }
  }

  const handleNext = async () => {
      try {
        const interests = selected.map(modelName => modelToInterest[modelName]).filter(Boolean)
        
        await updateInterests(interests)

        toaster.create({
            title: "Zapisano zainteresowania",
            type: "success",
        })
        
        router.push('/profile') 
      } catch (error) {
        console.error(error)
        toaster.create({
            title: "Błąd",
            description: "Nie udało się zapisać zainteresowań",
            type: "error",
        })
      }
  }

  if (isProfileLoading) {
      return (
          <Center h="100%" w="100%" bg="brand.glassBg" backdropFilter="blur(5px)" borderRadius="xl">
              <Spinner size="xl" color="brand.accent" />
          </Center>
      )
  }

  return (
    <Box position="relative" w="100%" h="100%">
      <Canvas shadows camera={{ position: [2.5, 1.5, 0], fov: 60 }} style={{ height: '100%', width: '100%' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={<Loader />}>
            <Model selected={selected} onSelect={handleSelect} />
        </Suspense>
        <CameraController setControls={setControls} />
      </Canvas>
      
      {/* Controls Overlay */}
      <HStack 
        position="absolute" 
        bottom={4} 
        left="50%" 
        transform="translateX(-50%)" 
        gap={4}
        bg="brand.glassBg"
        p={2}
        borderRadius="full"
        backdropFilter="blur(5px)"
        border="1px solid"
        borderColor="brand.borderColor"
      >
         <IconButton 
            aria-label="Obróć w lewo" 
            onPointerDown={() => startRotate('left')}
            onPointerUp={stopRotate}
            onPointerLeave={stopRotate}
            variant="ghost"
            rounded="full"
            color="brand.mainText"
            _hover={{ bg: "brand.accent", color: "white" }}
         >
            <RotateCcw />
         </IconButton>
         <IconButton 
            aria-label="Obróć w prawo" 
            onPointerDown={() => startRotate('right')}
            onPointerUp={stopRotate}
            onPointerLeave={stopRotate}
            variant="ghost"
            rounded="full"
            color="brand.mainText"
            _hover={{ bg: "brand.accent", color: "white" }}
         >
            <RotateCw />
         </IconButton>
      </HStack>

      {/* Next Button Overlay */}
      {selected.length === 5 && (
          <Box position="absolute" bottom={4} right={4}>
              <Button 
                onClick={handleNext} 
                loading={isUpdating}
                bg="brand.accent" 
                color="brand.buttonText"
                _hover={{ bg: "brand.accent2" }}
                size="lg"
              >
                  Dalej <Check style={{ marginLeft: '8px' }} />
              </Button>
          </Box>
      )}
      
      {/* Counter */}
      <Box 
        position="absolute" 
        top={4} 
        right={4} 
        bg="brand.glassBg" 
        p={3} 
        borderRadius="xl" 
        backdropFilter="blur(5px)"
        border="1px solid"
        borderColor="brand.borderColor"
      >
          <Text fontWeight="bold" color="brand.mainText">Wybrano: {selected.length} / 5</Text>
      </Box>
    </Box>
  )
}

interface SelectableMeshProps {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  name: string
  selected: string[]
  onSelect: (name: string) => void
  position?: [number, number, number] | THREE.Vector3
  rotation?: [number, number, number] | THREE.Euler
  scale?: number | [number, number, number] | THREE.Vector3
}

const SelectableMesh = ({ geometry, material, name, selected, onSelect, ...props }: SelectableMeshProps) => {
  const isSelected = selected.includes(name)
  const [hovered, setHovered] = useState(false)
  
  useCursor(hovered)

  const handleClick = (e: any) => {
    e.stopPropagation()
    onSelect(name)
  }

  const clonedMaterial = useMemo(() => {
    return material.clone()
  }, [material])

  return (
    <group>
      <mesh
        {...props}
        castShadow
        receiveShadow
        geometry={geometry}
        material={clonedMaterial}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false) }}
        material-emissive={isSelected ? new THREE.Color(0xffa500) : new THREE.Color(0x000000)}
        material-emissiveIntensity={isSelected ? 0.5 : 0}
      />
      {hovered && (
        <Html position={[0, 0.2, 0]} center>
          <ChakraProvider value={themeSystem}>
            <Box 
              bg="rgba(0,0,0,0.8)" 
              color="white" 
              px={3} 
              py={1} 
              borderRadius="md" 
              fontSize="sm"
              whiteSpace="nowrap"
              pointerEvents="none"
            >
              {modelToInterest[name]}
            </Box>
          </ChakraProvider>
        </Html>
      )}
    </group>
  )
}

function Model({ selected, onSelect, ...props }: JSX.IntrinsicElements['group'] & { selected: string[], onSelect: (name: string) => void }) {
  const { nodes, materials } = useGLTF('/modele.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.podloga.geometry} material={materials.podloga} position={[2.038, 0.171, 0.01]} scale={0.718} />
      <mesh castShadow receiveShadow geometry={nodes.Sciana.geometry} material={materials.sciana} position={[1.973, 1.154, 0]} />
      <mesh castShadow receiveShadow geometry={nodes.polki.geometry} material={materials.polki} position={[1.973, 1.63, 0]} />
      
      <SelectableMesh name="matydojogi" geometry={nodes.matydojogi.geometry} material={materials.maty} position={[2.587, 1.166, -0.721]} rotation={[3.113, -0.885, 1.753]} scale={[0.128, 0.145, 0.214]} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="hantle" geometry={nodes.hantle.geometry} material={materials.hantle} position={[1.617, 1.077, -0.918]} rotation={[0, 0.357, -Math.PI / 2]} scale={0.033} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="gitara" geometry={nodes.gitara.geometry} material={materials.gitara} position={[2.875, 1.261, 0.233]} rotation={[3.132, 0.095, -1.444]} scale={0.239} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="ksiazki" geometry={nodes.ksiazki.geometry} material={materials.ksiazki} position={[1.402, 1.118, -0.741]} rotation={[0, -0.819, 0]} scale={0.08} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="walizka" geometry={nodes.walizka.geometry} material={materials.walizka} position={[1.06, 1.043, -0.064]} rotation={[0, -0.102, 0]} scale={[0.047, 0.148, 0.148]} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="puchar" geometry={nodes.puchar.geometry} material={materials.zloto} position={[1.403, 1.06, 0.729]} rotation={[0, 0.944, 0]} scale={[0.03, 0.015, 0.03]} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="zloto" geometry={nodes.zloto.geometry} material={materials.zloto} position={[1.185, 1.056, -0.51]} rotation={[-Math.PI, 1.408, -Math.PI]} scale={[0.022, 0.022, 0.046]} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="kostkarubika" geometry={nodes.kostkarubika.geometry} material={materials.kostkarubika} position={[2.689, 1.564, 0.614]} scale={0.047} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="komputer" geometry={nodes.komputer.geometry} material={materials.komputer} position={[1.868, 1.625, 0.934]} rotation={[-Math.PI, 0.007, -Math.PI]} scale={[0.052, 0.103, 0.103]} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="jedzenie" geometry={nodes.jedzenie.geometry} material={materials.jedzenie} position={[1.964, 1.121, -0.988]} rotation={[1.586, 0.745, -0.047]} scale={0.054} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="kubek" geometry={nodes.kubek.geometry} material={materials.kubek} position={[1.139, 1.041, 0.395]} rotation={[0, 0.776, 0]} scale={0.037} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="roslina" geometry={nodes.roslina.geometry} material={materials.roslina} position={[1.756, 1.137, 0.895]} scale={0.034} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="zegar" geometry={nodes.zegar.geometry} material={materials.zegar} position={[2.46, 1.245, 0.84]} rotation={[-Math.PI, 1.097, Math.PI / 2]} scale={0.124} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="sluchawki" geometry={nodes.sluchawki.geometry} material={materials.sluchawki} position={[2.012, 1.655, -0.891]} rotation={[Math.PI / 2, 0, 0]} scale={0.05} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="gielda" geometry={nodes.gielda.geometry} material={materials.gielda} position={[1.134, 1.633, -0.432]} rotation={[Math.PI / 2, 0, -1.109]} scale={0.113} selected={selected} onSelect={onSelect} />
      <SelectableMesh name="Rekawice" geometry={nodes.Rekawice.geometry} material={materials.rekawice} position={[2.795, 1.583, -0.444]} rotation={[2.847, -0.495, 1.22]} scale={0} selected={selected} onSelect={onSelect} />
    </group>
  )
}

useGLTF.preload('/modele.glb')
