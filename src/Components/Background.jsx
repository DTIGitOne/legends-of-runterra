import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

const Background = () => {
  return (
    <>
      {/* Add environment for realistic lighting */}
      <Environment preset="sunset" />
      <ambientLight intensity={0} />
      <directionalLight position={[0, 0, 0]} intensity={0} />

      {/* Large sphere with a gradient background */}
      <Sphere scale={[17, 23, 23]} rotation-y={Math.PI / 2}>
          <meshStandardMaterial color="#357ca1" side={THREE.BackSide} />
      </Sphere>
    </>
  );
};

export default Background;
