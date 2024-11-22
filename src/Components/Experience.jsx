import { Line, OrbitControls, PerspectiveCamera, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
      {/* <OrbitControls enableZoom={false} /> */}
      {/* <Background /> */}
      <Map />
      <group ref={cameraGroup}>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}  // initial position of the camera
        fov={60} // fieald of view 
        near={0.1} // view distance min
        far={6} // view distnace max
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