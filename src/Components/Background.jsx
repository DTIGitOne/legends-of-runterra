import { Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three";

const Background = () => {

  return (
      <Sphere scale={[20, 20, 20]} rotation-y={Math.PI / 2}>
        <LayerMaterial color={"#ffffff"} side={THREE.BackSide}>
          <Gradient
            colorA="#447070"
            colorB="#447070"
            start={0}
            end={0}
            axes="y"
          />
        </LayerMaterial>
      </Sphere>
  );
};

export default Background;
