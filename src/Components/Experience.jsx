import { GradientTexture, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Background from "./Background";
import { bilgeWaterText, demaciaText, freljordText, ioniaText, ixtalText, noxusText, piltoverText, shurimaText } from "../Data/text";

const Experience = () => {
  const [path, setPath] = useState([]); // state to save path dots
  
  const cameraGroup = useRef(); // group ref for camera and path 
  const scroll = useScroll(); // scrpll from React three

  useEffect(() => {
    const loadPathData = async () => {
      const response = await fetch("Track/ProjectPathMain.json"); // Path render into .JSON using blender exetension
      const data = await response.json();
      const pathPoints = data.points.map((point) => new THREE.Vector3(point.x, point.y, point.z));
      
      setPath(pathPoints);
    };
    loadPathData();
  }, []);

  useFrame((_state, delta) => {
    if (!path || path.length === 0) return; // Ensure path is not empty
  
    // Calculate current point and the next point on the path
    const curPointIndex = Math.min(
      Math.round(scroll.offset * path.length),
      path.length - 1
    );
  
    const curPoint = path[curPointIndex];
    const pointAhead = path[(curPointIndex + 1) % path.length];
  
    // Interpolate camera position between curPoint and pointAhead
    const positionLerpFactor = delta * 6; // Adjust speed as needed
    const nextPosition = new THREE.Vector3().lerpVectors(curPoint, pointAhead, scroll.offset % 1);
    cameraGroup.current.position.lerp(nextPosition, positionLerpFactor);
  
    // Calculate direction vector and create a quaternion for smooth rotation
    const direction = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, -1), // Default camera forward direction
      direction
    );
  
    // Apply tilt (optional)
    const tiltFactor = -0.1; // Slight downward tilt
    const tiltQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltFactor, 0, 0));
    targetQuaternion.multiply(tiltQuaternion);
  
    // Smoothly interpolate the camera's rotation
    const rotationSlerpFactor = delta * 4; // Adjust rotation speed as needed
    cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
  });

  return (
    <>
      {/* background component */}
      <Background /> 

      {/* the terrain component */}
      <Map />

      {/* text */}

      {/* Shiruma Text */}
      <group position={[0.8, 0.85, 4.7]}>
      <Text
        color="radial-gradient(ellipse farthest-corner at top right, #E3CE76 0%, #A67F3C 100%)"
        font="/Friz Quadrata Regular.ttf"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.07}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -100, -0.9, 0]}
        textAlign="center"
      >
       {/* text color */}
       <meshStandardMaterial>
          <GradientTexture
            stops={[0, 1]} // Gradient stops
            colors={['#E7D178', '#C39547']} // Gradient colors
            size={300}
          />
       </meshStandardMaterial>

       {/* inner text variable */}
       {shurimaText}
      </Text>
      </group>

      {/* Ixtal Text */}
      <group position={[6.4, 0.91, 5.35]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.055}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -100, -0.58, 0]}
        textAlign="center"
      >
       {ixtalText}
      </Text>
      </group>

      {/* Bilewater Text */}
      <group position={[10.2, 0.55, 2.58]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.045}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -500, -1.7, 0]}
        textAlign="center"
      >
       {bilgeWaterText}
      </Text>
      </group>

      {/* Ionia Text */}
      <group position={[9, 0.75, -5.9]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.04}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -500, 0.3, 0]}
        textAlign="center"
      >
       {ioniaText}
      </Text>
      </group>

      {/* Noxus Text */}
      <group position={[-1.08, 0.74, -4.63]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.037}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / 50, 0.2, 0]}
        textAlign="center"
      >
       {noxusText}
      </Text>
      </group>

      {/* Freljord Text */}
      <group position={[-9.05, 0.79, -4.62]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.037}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / 40, 2, -0.07]}
        textAlign="center"
      >
       {freljordText}
      </Text>
      </group>

      {/* Demacia Text */}
      <group position={[-8.6, 0.6, -2.04]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.028}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / 100, -1.5, 0]}
        textAlign="center"
      >
       {demaciaText}
      </Text>
      </group>

      {/* Piltover Text */}
      <group position={[3.69, 0.38, 0.74]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.03}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -100, -2.2, 0.1]}
        textAlign="center"
      >
       {piltoverText}
      </Text>
      </group>

      {/* camera and path group */}
      <group ref={cameraGroup}>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}  // initial position of the camera
        fov={60} // fieald of view 
        near={0.1} // view distance min
        far={30} // view distnace max
      />
      {path.length > 0 && (
        <Line
          points={path} // camera path
          opacity={0}
          transparent
          lineWidth={3}
        />
      )}
      </group>

    </>
  );
};

export default Experience;