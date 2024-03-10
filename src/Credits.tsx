import { useFrame } from "@react-three/fiber";
import { ComponentPropsWithoutRef, useRef } from "react";
import { Mesh, MeshStandardMaterial, Vector3, Group } from "three";
import { PlayState } from "./PlayButton";
import { Text } from "@react-three/drei";

type CreditsProps = {
  lines: string[];
  playState: PlayState;
};

type CreditLineProps = ComponentPropsWithoutRef<"mesh">;

const SCROLL_SPEED = 1;
const BLOOM_BROAD_RADIUS = 0.3;
const BLOOM_SHARP_RADIUS = 0.8;
const BLOOM_SHARP_PEEK_Y_OFFSET = 1;
const ROTATION_SPEED = 0.2;
const ROTATION_PEEK_Y_OFFSET = 2;
// const ROTATION_AMOUNT = 0.5;
const WAVE_SPEED = 0.7;
const WAVE_AMPLITUDE = 0.7;

function CreditLine(props: CreditLineProps) {
  const { children } = props;

  const line = useRef<Mesh>(null!);
  const material = useRef(
    new MeshStandardMaterial({
      color: "black",
      emissive: 0xff0000,
      emissiveIntensity: 10,
    })
  );

  const worldPos = useRef<Vector3>(new Vector3());

  useFrame((state) => {
    line.current.getWorldPosition(worldPos.current);

    line.current.rotation.y =
      (worldPos.current.y + ROTATION_PEEK_Y_OFFSET) * ROTATION_SPEED;
    line.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.2) + // horizontal movement
      -Math.sin(worldPos.current.y * WAVE_SPEED) * WAVE_AMPLITUDE; // wave
    line.current.position.z = Math.cos(worldPos.current.y * 0.8 + 0.5) * 0.9;

    const emissiveBroad = Math.cos(worldPos.current.y * BLOOM_BROAD_RADIUS) * 1;
    const emissiveSharp =
      -Math.PI / BLOOM_SHARP_RADIUS - BLOOM_SHARP_PEEK_Y_OFFSET <
        worldPos.current.y &&
      worldPos.current.y <
        Math.PI / BLOOM_SHARP_RADIUS - BLOOM_SHARP_PEEK_Y_OFFSET
        ? Math.max(
            0,
            Math.cos(
              worldPos.current.y * BLOOM_SHARP_RADIUS +
                BLOOM_SHARP_PEEK_Y_OFFSET
            ) * 20
          )
        : 0;

    material.current.emissiveIntensity = Math.max(
      0,
      emissiveBroad + emissiveSharp
    );
  });

  return (
    <Text
      ref={line}
      scale={[0.4, 0.4, 0.4]}
      material={material.current}
      {...props}
    >
      {children}
    </Text>
  );
}

export function Credits(props: CreditsProps) {
  const { playState, lines } = props;

  const credits = useRef<Group>(null!);

  useFrame((_, delta) => {
    if (playState === "playing") {
      credits.current.position.y += delta * SCROLL_SPEED;
    } else if (playState === "reset") {
      credits.current.position.y = 0;
    }
  });

  return (
    <group ref={credits}>
      {lines.map((line, index) => (
        <CreditLine
          key={index}
          position-y={lines.length - (lines.length + index / 1.7) - 5}
        >
          {line}
        </CreditLine>
      ))}
    </group>
  );
}
