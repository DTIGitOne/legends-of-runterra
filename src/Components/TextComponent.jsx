import { GradientTexture, Text } from "@react-three/drei";

const TextComponent = ({heading, text, rotation, pos}) => {
    return (
      <group position={pos}>
      {/* Title name */}
      <Text
        font="/Friz Quadrata Regular.ttf"
        anchorX="middle"
        anchorY="middle"
        fontSize={0.165}
        maxWidth={2.5}
        lineHeight={1}
        rotation={rotation}
        textAlign="center"
      >
        <meshStandardMaterial>
          <GradientTexture
            stops={[0, 1]} // Gradient stops
            colors={['#E7D178', '#C39547']} // Gradient colors
            size={300}
          />
       </meshStandardMaterial>
        {heading}
      </Text>

      <Text
        font="/Friz Quadrata Regular.ttf"
        anchorX="middle"
        anchorY="top"
        fontSize={0.07}
        maxWidth={2.5}
        lineHeight={1.2}
        whiteSpace="pre-line"
        rotation={rotation}
        textAlign="center"
      >
       {/* text color */}
       <meshStandardMaterial>
          <GradientTexture
            stops={[0, 1]} // Gradient stops
            colors={['#FFE784', '#F6BC5A']} // Gradient colors
            size={300}
          />
       </meshStandardMaterial>

       {/* inner text variable */}
       {text}
      </Text>
      </group>
    );
}

export default TextComponent;