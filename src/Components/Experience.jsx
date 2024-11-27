import { Line, PerspectiveCamera, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Background from "./Background";
import { dataArray } from "../Data/text";
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
  
    // Smooth transition variables
    let isLookingAtText = false;
    let targetLookAt = null;
    let transitionFactor = 1;
  
    dataArray.forEach((text) => {
      const textPosition = new THREE.Vector3(...text.pos); // Parse position from JSON
      const distance = cameraGroup.current.position.distanceTo(textPosition);
  
      if (distance < FRICTION_DISTANCE) {
        // Calculate direction from camera to text
        const directionToText = new THREE.Vector3().subVectors(
          textPosition,
          cameraGroup.current.position
        ).normalize();
  
        const cameraForward = new THREE.Vector3(0, 0, -1)
          .applyQuaternion(cameraGroup.current.quaternion);
  
        // Only look at the text if it is in front of the camera
        const dotProduct = directionToText.dot(cameraForward);
        if (dotProduct > 0) { // Text is in front of the camera
          targetLookAt = textPosition.clone();
          targetLookAt.y -= 0.3; // Pan down slightly
          isLookingAtText = true;
  
          // Smooth transition factor
          transitionFactor = THREE.MathUtils.clamp(
            1 - (distance / FRICTION_DISTANCE),
            0,
            1
          );
        }
      }
    });
  
    if (isLookingAtText && targetLookAt) {
      // Blend between looking at the text and the path direction
      const directionToText = new THREE.Vector3().subVectors(targetLookAt, cameraGroup.current.position).normalize();
      const pathDirection = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
      const blendedDirection = directionToText.lerp(pathDirection, 1 - transitionFactor);
  
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), // Default camera forward direction
        blendedDirection
      );
  
      const rotationSlerpFactor = Math.max(delta * 1, 0.005); // Smooth rotation factor
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
      const rotationSlerpFactor = Math.max(delta * 1, 0.005); // Smooth rotation factor
      cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
    }
  });
  
  return (
    <>
      {/* background component */}
      <Background /> 

      {/* the terrain component */}
      <Map />

      {/* mapped out text array */}
      {dataArray.map((item) => {
        return (
          <TextComponent key={item.title} heading={item.title} text={item.text} pos={item.pos} rotation={item.rotation} />
        )
      })}

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