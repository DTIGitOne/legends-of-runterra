import { Canvas } from "@react-three/fiber";
import Experience from "../Components/Experience";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";

const Main = () => {
    return (
      <>
      {/*
        onCreated={({ gl, scene }) => {
        scene.fog = new THREE.Fog("rgba(255, 255, 255, 0.1)", 4, 6); // Fog color, start, and end distances
       }} 
        */}
       <Canvas
       
       >
          <ScrollControls pages={90} damping={0.75}>
              <Experience />
          </ScrollControls>
        </Canvas>
      </>
    );
  };

export default Main;