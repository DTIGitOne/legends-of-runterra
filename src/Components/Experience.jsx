import { Line, OrbitControls, PerspectiveCamera, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Experience = () => {
  const [path, setPath] = useState([]);
  
  const cameraGroup = useRef();
  const scroll = useScroll();

  useEffect(() => {
    const loadPathData = async () => {
      const response = await fetch("Track/ProjectPathMain.json"); // Adjust the path as needed
      const data = await response.json();
      const pathPoints = data.points.map((point) => new THREE.Vector3(point.x, point.y, point.z));
      
      setPath(pathPoints);
    };
    loadPathData();
  }, []);

  useFrame((_state, delta) => {
    if (!path || path.length === 0) return; // Ensure path is not empty
    
    const curPointIndex = Math.min(
      Math.round(scroll.offset * path.length),
      path.length - 1
    );
    
    const curPoint = path[curPointIndex];
    const pointAhead = path[(curPointIndex + 1) % path.length];
    
    // Direction vector from curPoint to pointAhead
    const direction = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
    
    // Ensure the camera is looking forward along the path
    // Invert the direction if the camera is looking backward
    const adjustedDirection = direction.negate(); 
  
    // Apply smooth rotation towards the new direction
    cameraGroup.current.lookAt(curPoint.clone().add(adjustedDirection));
  
    // Add tilt down by adjusting the camera's rotation
    // Tilt the camera down on the X-axis (tiltFactor is the amount of tilt)
    const tiltFactor = 0.1; // Adjust this value to control the tilt amount
    cameraGroup.current.rotation.x += tiltFactor;
  
    // Interpolate the camera position smoothly along the path
    cameraGroup.current.position.lerp(curPoint, delta * 12);
  });

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      {/* <Background /> */}
      <Map />
      <group ref={cameraGroup}>
      <PerspectiveCamera
        makeDefault
        position={[0, 0.04, 0]}  // Set initial position here (example position)
        fov={17}
        near={0.1}
        far={0.6}
      />
      {path.length > 0 && (
        <Line
          points={path}
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