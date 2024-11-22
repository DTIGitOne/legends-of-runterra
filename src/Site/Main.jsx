import { Canvas } from "@react-three/fiber";
import Experience from "../Components/Experience";
import { ScrollControls } from "@react-three/drei";
import { useRef } from "react";

const Main = () => {
    return (
      <>
       <Canvas>
          <color attach="background" args={["#ffffff"]} />
          <ScrollControls pages={8} damping={0.7}>
                <Experience />
          </ScrollControls>
        </Canvas>
      </>
    );
  };

export default Main;