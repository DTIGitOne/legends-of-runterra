import { Canvas } from "@react-three/fiber";
import Experience from "../Components/Experience";
import { ScrollControls } from "@react-three/drei";
import * as THREE from "three";
import Overlay from "../Components/Overlay";
import { usePlay } from "../Components/Play";

const Main = () => {
    const { play, end } = usePlay(); // wrapping function state for controlling body scroll bar on site start and end

    return (
      <>
       {/* scene for the 3d elements */}
       <Canvas
            onCreated={({ gl, scene }) => {
              scene.fog = new THREE.Fog("rgba(13, 65, 66, 1)", 4, 6); // Fog color, start, and end distance
            }} 
       >
          {/* scrolling function for the site */}
          <ScrollControls pages={play && !end ? 90 : 0} damping={0.62} style={{
            top: "10px",
            left: "0px",
            bottom: "10px",
            right: "10px",
            width: "auto",
            height: "auto",
            animation: "fadeIn 2s ease-in-out 1.2s forwards",
            opacity: 0,
          }}>
              {/* 3d model and scroll option component */}
              <Experience />
          </ScrollControls>
        </Canvas>
        {/* overlay element for intro and outro screen */}
        <Overlay />
      </>
    );
  };

export default Main;