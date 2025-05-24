'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text3D, Environment } from '@react-three/drei'
import * as THREE from 'three'

interface OwlGuardianProps {
  emotion: 'neutral' | 'watching' | 'hiding' | 'happy' | 'nervous' | 'celebrating'
  lookAtField?: string | null
  mousePosition: { x: number; y: number }
}

function OwlMesh({ emotion, lookAtField, mousePosition }: OwlGuardianProps) {
  const meshRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const leftPupilRef = useRef<THREE.Mesh>(null)
  const rightPupilRef = useRef<THREE.Mesh>(null)
  const leftWingRef = useRef<THREE.Mesh>(null)
  const rightWingRef = useRef<THREE.Mesh>(null)
  const beakRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()
  
  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 })
  const [wingAnimation, setWingAnimation] = useState(0)
  const [bodyBounce, setBodyBounce] = useState(0)
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Calcular offset para las pupilas basado en la posición del mouse
    // Solo las pupilas siguen al mouse, no todo el cuerpo del búho
    const x = (mousePosition.x / window.innerWidth) * 2 - 1
    const y = -(mousePosition.y / window.innerHeight) * 2 + 1
    
    // Limitamos el movimiento para que las pupilas no salgan del ojo
    const maxOffset = 0.06 // Máximo desplazamiento de las pupilas (reducido para ser más realista)
    setPupilOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, x * maxOffset)),
      y: Math.max(-maxOffset, Math.min(maxOffset, y * maxOffset))
    })
  }, [mousePosition])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (meshRef.current) {
      // Animación de respiración suave
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02)
      
      // Eliminamos la rotación del cuerpo hacia el mouse - solo las pupilas siguen al mouse
    }

    // Animaciones específicas por emoción
    if (emotion === 'celebrating') {
      setWingAnimation(Math.sin(time * 8) * 0.5)
      setBodyBounce(Math.abs(Math.sin(time * 4)) * 0.3)
    } else if (emotion === 'nervous') {
      setWingAnimation(Math.sin(time * 12) * 0.2)
      setBodyBounce(Math.sin(time * 6) * 0.1)
    } else {
      setWingAnimation(Math.sin(time * 3) * 0.1)
      setBodyBounce(0)
    }

    // Animación de alas
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.rotation.z = -0.3 + wingAnimation
      rightWingRef.current.rotation.z = 0.3 - wingAnimation
    }

    // Bounce del cuerpo
    if (meshRef.current) {
      meshRef.current.position.y = bodyBounce
    }

    // Animación de ojos (manteniendo las expresiones)
    if (leftEyeRef.current && rightEyeRef.current) {
      if (emotion === 'hiding') {
        // Ojos cerrados - como una línea '-'
        leftEyeRef.current.scale.set(1, 0.05, 1) // Muy aplastado verticalmente
        rightEyeRef.current.scale.set(1, 0.05, 1)
        leftEyeRef.current.position.y = 0.4 // Mantener posición base
        rightEyeRef.current.position.y = 0.4
        
        // También ocultar las pupilas cuando los ojos están cerrados
        if (leftPupilRef.current && rightPupilRef.current) {
          leftPupilRef.current.scale.set(1, 0.05, 1)
          rightPupilRef.current.scale.set(1, 0.05, 1)
        }
      } else if (emotion === 'happy') {
        // Ojos sonrientes - mantener el tamaño grande pero con forma sonriente
        leftEyeRef.current.scale.set(1, 0.7, 1)
        rightEyeRef.current.scale.set(1, 0.7, 1)
        leftEyeRef.current.rotation.z = 0.3
        rightEyeRef.current.rotation.z = -0.3
        
        // Pupilas también sonrientes
        if (leftPupilRef.current && rightPupilRef.current) {
          leftPupilRef.current.scale.set(1, 0.7, 1)
          rightPupilRef.current.scale.set(1, 0.7, 1)
        }
      } else if (emotion === 'nervous') {
        // Ojos grandes y nerviosos - las pupilas deben escalar proporcionalmente
        const nervousScale = 1.3 + Math.sin(time * 10) * 0.1
        leftEyeRef.current.scale.setScalar(nervousScale)
        rightEyeRef.current.scale.setScalar(nervousScale)
        
        // Las pupilas también deben escalar con el mismo factor
        if (leftPupilRef.current && rightPupilRef.current) {
          leftPupilRef.current.scale.setScalar(nervousScale)
          rightPupilRef.current.scale.setScalar(nervousScale)
        }
      } else {
        // Ojos normales - ahora más grandes por defecto
        leftEyeRef.current.scale.set(1, 1, 1)
        rightEyeRef.current.scale.set(1, 1, 1)
        leftEyeRef.current.rotation.z = 0
        rightEyeRef.current.rotation.z = 0
        
        // Pupilas normales
        if (leftPupilRef.current && rightPupilRef.current) {
          leftPupilRef.current.scale.set(1, 1, 1)
          rightPupilRef.current.scale.set(1, 1, 1)
        }
      }
    }

    // Animación de las pupilas siguiendo al mouse (solo si no están ocultas)
    if (leftPupilRef.current && rightPupilRef.current && emotion !== 'hiding') {
      // Posición base de las pupilas (centradas en cada ojo)
      const leftEyeBaseX = -0.25
      const rightEyeBaseX = 0.25
      const eyeBaseY = 0.4
      const eyeBaseZ = 0.52 // Ligeramente adelante del ojo blanco
      
      // Aplicar el offset del mouse de manera suave
      const smoothPupilX = THREE.MathUtils.lerp(
        leftPupilRef.current.position.x - leftEyeBaseX, 
        pupilOffset.x, 
        0.1
      )
      const smoothPupilY = THREE.MathUtils.lerp(
        leftPupilRef.current.position.y - eyeBaseY, 
        pupilOffset.y, 
        0.1
      )
      
      // Establecer posiciones finales
      leftPupilRef.current.position.set(
        leftEyeBaseX + smoothPupilX,
        eyeBaseY + smoothPupilY,
        eyeBaseZ
      )
      rightPupilRef.current.position.set(
        rightEyeBaseX + smoothPupilX,
        eyeBaseY + smoothPupilY,
        eyeBaseZ
      )
    } else if (emotion === 'hiding') {
      // Cuando los ojos están cerrados, mantener las pupilas en posición base pero aplastadas
      leftPupilRef.current?.position.set(-0.25, 0.4, 0.52)
      rightPupilRef.current?.position.set(0.25, 0.4, 0.52)
    }

    // Animación del pico
    if (beakRef.current) {
      if (emotion === 'happy' || emotion === 'celebrating') {
        beakRef.current.rotation.x = Math.sin(time * 4) * 0.1
      } else {
        beakRef.current.rotation.x = 0
      }
    }
  })

  const getBodyColor = () => {
    switch (emotion) {
      case 'happy':
      case 'celebrating':
        return '#8B5A3C'
      case 'nervous':
        return '#6B4423'
      case 'hiding':
        return '#5A3A1F'
      default:
        return '#7A4A2A'
    }
  }

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={0.7}>
      {/* Cuerpo del búho */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      
      {/* Cabeza */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      
      {/* Orejas */}
      <mesh position={[-0.3, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      <mesh position={[0.3, 0.8, 0]} rotation={[0, 0, 0.3]}>
        <coneGeometry args={[0.15, 0.4, 8]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      
      {/* Ojos - Ahora más grandes y con un anillo exterior para hacerlos más expresivos */}
      <group>
        {/* Anillo exterior del ojo izquierdo */}
        <mesh position={[-0.25, 0.4, 0.38]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#F0F0F0" />
        </mesh>
        {/* Ojo izquierdo principal */}
        <mesh ref={leftEyeRef} position={[-0.25, 0.4, 0.42]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Anillo exterior del ojo derecho */}
        <mesh position={[0.25, 0.4, 0.38]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial color="#F0F0F0" />
        </mesh>
        {/* Ojo derecho principal */}
        <mesh ref={rightEyeRef} position={[0.25, 0.4, 0.42]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>
      
      {/* Pupilas - Ahora pueden moverse siguiendo al mouse */}
      <mesh ref={leftPupilRef} position={[-0.25, 0.4, 0.52]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightPupilRef} position={[0.25, 0.4, 0.52]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Reflejos en los ojos para hacerlos más expresivos */}
      <mesh position={[-0.22, 0.45, 0.54]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.28, 0.45, 0.54]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Pico */}
      <mesh ref={beakRef} position={[0, 0.2, 0.5]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      
      {/* Alas */}
      <mesh ref={leftWingRef} position={[-0.7, -0.2, 0]} rotation={[0, 0, -0.3]} scale={[0.3, 0.6, 0.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.7, -0.2, 0]} rotation={[0, 0, 0.3]} scale={[0.3, 0.6, 0.2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={getBodyColor()} />
      </mesh>
      
      {/* Patas */}
      <mesh position={[-0.2, -1.2, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
      <mesh position={[0.2, -1.2, 0.2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#FFA500" />
      </mesh>
    </group>
  )
}

export function OwlGuardian({ emotion, lookAtField, mousePosition }: OwlGuardianProps) {
  return (
    <div className="relative w-full h-40"> {/* Reducido de h-64 a h-40 */}
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <Environment preset="sunset" />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <OwlMesh 
          emotion={emotion} 
          lookAtField={lookAtField} 
          mousePosition={mousePosition}
        />
        
        {emotion === 'celebrating' && (
          <>
            {/* Partículas de celebración */}
            {Array.from({ length: 15 }).map((_, i) => (
              <mesh key={i} position={[
                (Math.random() - 0.5) * 4,
                Math.random() * 3,
                (Math.random() - 0.5) * 2
              ]}>
                <sphereGeometry args={[0.02]} />
                <meshStandardMaterial color={`hsl(${Math.random() * 360}, 70%, 60%)`} />
              </mesh>
            ))}
          </>
        )}
      </Canvas>
      
      {/* Mensaje del búho - Más compacto */}
      <div className="absolute transform -translate-x-1/2 bottom-2 left-1/2">
        <div className="px-2 py-1 rounded-md shadow-md bg-white/90 backdrop-blur-sm">
          <p className="text-xs leading-tight text-center text-gray-700">
            {emotion === 'neutral' && "¡Hola! Soy tu guardián 🦉"}
            {emotion === 'watching' && "Te estoy observando... 👀"}
            {emotion === 'hiding' && "¡No puedo ver tu contraseña! 🙈"}
            {emotion === 'happy' && "¡Excelente! Todo se ve bien 😊"}
            {emotion === 'nervous' && "¡Ups! Algo no está bien... 😰"}
            {emotion === 'celebrating' && "¡Bienvenido! ¡Éxito total! 🎉"}
          </p>
        </div>
      </div>
    </div>
  )
}