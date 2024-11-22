import { Canvas } from "@react-three/fiber";
import Experience from "../Components/Experience";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";

const Main = () => {
    return (
      <>
       <Canvas
       onCreated={({ gl, scene }) => {
        scene.fog = new THREE.Fog("#ffffff", 4, 6); // Fog color, start, and end distances
      }}
       >
          <ScrollControls pages={8} damping={0.7}>
              <Experience />
          </ScrollControls>
        </Canvas>
      </>
    );
  };

export default Main;