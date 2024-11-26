import { GradientTexture, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Background from "./Background";
import { bilgeWaterText, dataArray, demaciaText, freljordText, ioniaText, ixtalText, noxusText, piltoverText, shurimaText } from "../Data/text";
import TextComponent from "./TextComponent";

const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

const Experience = () => {
  const [path, setPath] = useState([]); // State to save path dots

  const cameraRail = useRef();
  const cameraGroup = useRef(); // Group ref for camera and path
  const scroll = useScroll(); // Scroll from React Three

  const FRICTION_DISTANCE = 2.5;
  
  useEffect(() => {
    const loadPathData = async () => {
      const response = await fetch("Track/ProjectPathMain.json"); // Path render into .JSON using Blender extension
      const data = await response.json();
      const pathPoints = data.points.map((point) => new THREE.Vector3(point.x, point.y, point.z));
      
      setPath(pathPoints);
    };
    loadPathData();
  }, []);

  useFrame((_state, delta) => {
    if (!path || path.length === 0) return; // Ensure path is not empty
  
    // Calculate the current point and the next point on the path
    const curPointIndex = Math.min(
      Math.round(scroll.offset * path.length),
      path.length - 1
    );
  
    const curPoint = path[curPointIndex];
    const pointAhead = path[(curPointIndex + 1) % path.length];
  
    // Interpolate camera position between curPoint and pointAhead using easing
    const scrollFraction = scroll.offset % 1;
    const easedFraction = easeInOutCubic(scrollFraction); // Easing for smoothness
  
    const tempPosition = new THREE.Vector3().lerpVectors(curPoint, pointAhead, easedFraction);
    const positionLerpFactor = Math.max(delta * 1, 0.01); // Ensure minimal lerp speed for smoothness
    cameraGroup.current.position.lerp(tempPosition, positionLerpFactor);
  
    // Check proximity to text positions
    let isLookingAtText = false;
    let targetLookAt = null;
  
    dataArray.forEach((text) => {
      const textPosition = new THREE.Vector3(...text.pos); // Parse position from JSON
      const distance = cameraGroup.current.position.distanceTo(textPosition);
  
      if (distance < FRICTION_DISTANCE) {
        // Calculate direction from camera to text and the forward direction of the camera
        const directionToText = new THREE.Vector3().subVectors(
          textPosition,
          cameraGroup.current.position
        ).normalize();
  
        const cameraForward = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(cameraGroup.current.quaternion);
  
        // Only look at the text if it is in front of the camera
        const dotProduct = directionToText.dot(cameraForward);
        if (dotProduct > 0) { // Text is in front of the camera
          // Apply downward offset to the target look-at position
          targetLookAt = textPosition.clone();
          targetLookAt.y -= 0.3; // Pan down by 0.5 units (adjust as needed)
          isLookingAtText = true;
        }
      }
    });
  
    if (isLookingAtText && targetLookAt) {
      // Smoothly look at the adjusted text position
      const directionToText = new THREE.Vector3().subVectors(targetLookAt, cameraGroup.current.position).normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward direction
        directionToText
      );
  
      const rotationSlerpFactor = Math.max(delta * 1, 0.001); // Smooth rotation factor
      cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
    } else {
      // Default smooth rotation along the path
      const direction = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward direction
        direction
      );
  
      // Apply tilt
      const tiltFactor = -0.1; // Slight downward tilt
      const tiltQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltFactor, 0, 0));
      targetQuaternion.multiply(tiltQuaternion);
  
      // Smoothly interpolate the camera's rotation
      const rotationSlerpFactor = Math.max(delta * 1, 0.001); // Smooth rotation factor
      cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
    }
  });
  
  
  return (
    <>
      {/* background component */}
      <Background /> 

      {/* the terrain component */}
      <Map />

      {/* text */}
      {dataArray.map((item) => {
        return (
          <TextComponent key={item.title} heading={item.title} text={item.text} pos={item.pos} rotation={item.rotation} />
        )
      })}

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
      <group position={[3.25, 0.57, -0.34]}>
      <Text
        color="white"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.03}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={[Math.PI / -100, -1.9, 0.05]}
        textAlign="center"
      >
       {piltoverText}
      </Text>
      </group>

      {/* camera and path group */}
      <group ref={cameraGroup}>
      <group ref={cameraRail}>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}  // initial position of the camera
        fov={60} // fieald of view 
        near={0.1} // view distance min
        far={30} // view distnace max
      />
      </group>
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