import { Canvas } from "@react-three/fiber";
import Experience from "../Components/Experience";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";
import Overlay from "../Components/Overlay";
import { usePlay } from "../Components/Play";

const Main = () => {
    const { play, end } = usePlay();

    return (
      <>
       <Canvas
            onCreated={({ gl, scene }) => {
              scene.fog = new THREE.Fog("rgba(68, 112, 112, 1)", 4, 6); // Fog color, start, and end distance
             }} 
       >
          <ScrollControls pages={play && !end ? 90 : 0} damping={0.75} style={{
            top: "10px",
            left: "0px",
            bottom: "10px",
            right: "10px",
            width: "auto",
            height: "auto",
            animation: "fadeIn 2s ease-in-out 1.2s forwards",
            opacity: 0,
          }}>
              <Experience />
          </ScrollControls>
        </Canvas>
        <Overlay />
      </>
    );
  };

export default Main;