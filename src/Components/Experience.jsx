import { Line, PerspectiveCamera, useScroll } from "@react-three/drei";
import { Map } from "./Map";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Background from "./Background";
import { dataArray } from "../Data/text";
import TextComponent from "./TextComponent";
import { usePlay } from "./Play";

// formula for camera movement
const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

const Experience = () => {
  const [path, setPath] = useState([]); // State to save path dots

  const cameraRail = useRef();
  const camera = useRef();
  const cameraGroup = useRef(); // Group ref for camera and path
  const scroll = useScroll(); // Scroll from React Three
  const lastScroll = useRef(0);

  const { setHasScroll, end, setEnd } = usePlay(); // states and values for animations on overlay

  const FRICTION_DISTANCE = 2.5;
  
  useEffect(() => {
    const loadPathData = async () => {
      const response = await fetch("Track/ProjectPathMain.json"); // Path render into .JSON using Blender extension
      const data = await response.json(); // await fetching
      const pathPoints = data.points.map((point) => new THREE.Vector3(point.x, point.y, point.z)); // mapped out blender points into three vectros
      
      setPath(pathPoints); // set points state
    };
    loadPathData();
  }, []);

  useFrame((_state, delta) => {
    if (!path || path.length === 0) return; // if path exists 

    if (window.innerWidth > window.innerHeight) {
      // LANDSCAPE
      camera.current.fov = 63;
    } else {
      // PORTTRAIT
      camera.current.fov = 90;
    }

    let friction = 1;
  
    // Set hasScroll if scrolling starts
    if (lastScroll.current <= 0 && scroll.offset > 0) {
      setHasScroll(true);
    }
  
    // if true end the useFrame camera movement 
    if (end) return;
  
    // Calculate lerped scroll offset
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scroll.offset,
      delta * friction
    );
  
    // Clamp lerpedScrollOffset to [0, 1]
    lerpedScrollOffset = Math.min(Math.max(lerpedScrollOffset, 0), 1);
    lastScroll.current = lerpedScrollOffset;
  
    // Determine the current and next points on the path
    const curPointIndex = Math.min(
      Math.floor(lerpedScrollOffset * path.length),
      path.length - 1
    );
  
    // current/next located camera and path point location
    const curPoint = path[curPointIndex];
    const pointAhead = path[(curPointIndex + 1) % path.length];
  
    // Interpolate between points using eased fraction
    const scrollFraction = lerpedScrollOffset % 1;
    const easedFraction = easeInOutCubic(scrollFraction);
  
    const tempPosition = new THREE.Vector3().lerpVectors(curPoint, pointAhead, easedFraction);
  
    // Smooth camera position
    const positionLerpFactor = Math.max(delta * 1, 0.01);
    cameraGroup.current.position.lerp(tempPosition, positionLerpFactor);
  
    // Handle camera rotation
    let isLookingAtText = false;
    let targetLookAt = null;
    let transitionFactor = 1;
  
    // mapped out text arrays for the camera to slow down and look at the text being mapped out
    dataArray.forEach((text) => {
      const textPosition = new THREE.Vector3(...text.pos); // text postition from json turned into three vectors
      const distance = cameraGroup.current.position.distanceTo(textPosition); // distance to the text to control camera and scroll movement
  
      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
  
        const directionToText = new THREE.Vector3()
          .subVectors(textPosition, cameraGroup.current.position)
          .normalize();
  
        const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraGroup.current.quaternion);
  
        const dotProduct = directionToText.dot(cameraForward);
        if (dotProduct > 0) {
          targetLookAt = textPosition.clone();
          targetLookAt.y -= 0.3;
          isLookingAtText = true;
  
          transitionFactor = THREE.MathUtils.clamp(
            1 - distance / FRICTION_DISTANCE,
            0,
            1
          );
        }
      }
    });
  
    // if true, to look at the direction of the position of the text and return camera smootly to path position
    if (isLookingAtText && targetLookAt) {
      const directionToText = new THREE.Vector3().subVectors(targetLookAt, cameraGroup.current.position).normalize();
      const pathDirection = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
      const blendedDirection = directionToText.lerp(pathDirection, 1 - transitionFactor);
  
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        blendedDirection
      );
  
      const rotationSlerpFactor = Math.max(delta * 1, 0.005);
      cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
    } else {
      const direction = new THREE.Vector3().subVectors(pointAhead, curPoint).normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        direction
      );
  
      // tilt the camera forwards a little bit
      const tiltFactor = -0.1;
      const tiltQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltFactor, 0, 0));
      targetQuaternion.multiply(tiltQuaternion);
  
      // rotation of the camera
      const rotationSlerpFactor = Math.max(delta * 1, 0.005);
      cameraGroup.current.quaternion.slerp(targetQuaternion, rotationSlerpFactor);
    }
  
    // if the camera is located 10 points before the last point, end the scene and trigger outro overlay
    if (curPointIndex >= path.length - 10) {
      setEnd(true);
    }
  });
  
  return useMemo(() => (
    <>
      {/* lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.15} />

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
          ref={camera}
          makeDefault
          position={[0, 0, 0]}  // initial position of the camera
          fov={60} // fieald of view 
          near={0.1} // view distance min
          far={50} // view distnace max
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
  ));
};

export default Experience;