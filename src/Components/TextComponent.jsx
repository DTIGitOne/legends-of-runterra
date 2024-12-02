import { GradientTexture, Text } from "@react-three/drei";

const TextComponent = ({heading, text, rotation, pos}) => {
    return (
      <group position={pos}>
      {/* Title name */}
      <Text
        font="/Friz Quadrata Regular.ttf"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.12}
        maxWidth={2.5}
        position={[0, 0.03, 0]}
        lineHeight={1}
        rotation={rotation}
        textAlign="center"
      >
        <meshBasicMaterial>
          <GradientTexture
            stops={[0, 1]} // Gradient stops
            colors={['#E7D178', '#C39547']} // Gradient colors
            size={300}
          />
       </meshBasicMaterial>
        {heading}
      </Text>

      <Text
        font="/Friz Quadrata Regular.ttf"
        anchorX="middle"
        anchorY="top"
        fontSize={0.051}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={rotation}
        textAlign="center"
      >
       {/* text color */}
       <meshBasicMaterial>
          <GradientTexture
            stops={[0, 1]} // Gradient stops
            colors={['#FFE784', '#F6BC5A']} // Gradient colors
            size={300}
          />
       </meshBasicMaterial>

       {/* inner text variable */}
       {text}
      </Text>
      </group>
    );
}

export default TextComponent;