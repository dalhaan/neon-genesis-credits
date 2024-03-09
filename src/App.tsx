import { Effects, Text } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  ComponentPropsWithoutRef,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Group, Mesh, MeshStandardMaterial, Vector3 } from "three";

import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

extend({ UnrealBloomPass });

const SCROLL_SPEED = 1;
const BLOOM_BROAD_RADIUS = 0.3;
const BLOOM_SHARP_RADIUS = 0.8;
const BLOOM_SHARP_PEEK_Y_OFFSET = 1;
const ROTATION_SPEED = 1.7;
const ROTATION_PEEK_Y_OFFSET = 0.5;
const WAVE_SPEED = 0.7;
const WAVE_AMPLITUDE = 0.7;

type CreditsProps = {
  lines: string[];
  playState: PlayState;
};

type CreditLineProps = ComponentPropsWithoutRef<"mesh">;

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
      (worldPos.current.y / ROTATION_SPEED + ROTATION_PEEK_Y_OFFSET) * 0.5;
    line.current.position.x =
      Math.sin(state.clock.elapsedTime * 0.2) + // horizontal movement
      -Math.sin(worldPos.current.y * WAVE_SPEED) * WAVE_AMPLITUDE; // wave
    line.current.position.z = Math.cos(worldPos.current.y * 0.8 + 0.5) * 0.9;

    const emissiveBroad = Math.cos(worldPos.current.y * BLOOM_BROAD_RADIUS) * 1;
    const emissiveSharp =
      -Math.PI / BLOOM_SHARP_RADIUS < worldPos.current.y &&
      worldPos.current.y < Math.PI / BLOOM_SHARP_RADIUS
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
    // material.current.color.r = worldPos.current.y + 2.5;
    // const scale = (worldPos.current.y + 2) * 0.05;
    // line.current.scale.set(scale, scale, scale);
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

function Credits(props: CreditsProps) {
  const { playState, lines } = props;

  const credits = useRef<Group>(null!);

  useFrame((state, delta) => {
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

type PlayButtonProps = {
  playState: PlayState;
  onChange: (playState: PlayState) => void;
};

function PlayButton(props: PlayButtonProps) {
  const { playState, onChange } = props;

  const playButton = useRef<HTMLButtonElement>(null!);

  const soundcloudWidget = useRef(
    SC.Widget(document.querySelector("#soundcloudWidget"))
  );

  function handlePlay() {
    soundcloudWidget.current.play();
    onChange("playing");
  }

  function handlePause() {
    soundcloudWidget.current.pause();
    onChange("paused");
  }

  function handleReset() {
    soundcloudWidget.current.seekTo(0);
    soundcloudWidget.current.pause();
    onChange("reset");

    playButton.current.focus();
  }

  function handlePlayPause() {
    if (["paused", "reset"].includes(playState)) {
      handlePlay();
    } else {
      handlePause();
    }
  }

  return (
    <div className="button-roll-credits">
      <button ref={playButton} onClick={handlePlayPause}>
        {["paused", "reset"].includes(playState) ? "Roll Credits" : "Pause"}
      </button>
      {playState !== "reset" ? (
        <button onClick={handleReset}>Reset</button>
      ) : null}
    </div>
  );
}

type PlayState = "paused" | "playing" | "reset";

export function Scene() {
  const [playState, setPlayState] = useState<PlayState>("paused");

  return (
    <>
      <Canvas>
        <Suspense>
          <Effects>
            <unrealBloomPass strength={0.6} radius={2} />
          </Effects>

          <Credits
            playState={playState}
            lines={[
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "Meghan is STINKY",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "",
              "XEBEC",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "和製漢字 和製漢字",
              "",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "和製漢字",
              "",
              "Hideaki Anno",
              "Rie Asano",
              "Hisaki Furukawa",
              "Takayuki Gorai",
              "Takayuki Gotô",
              "Shin'ya Hasegawa",
              "Nobuo Hashimoto",
              "Takashi Hashimoto",
              "Masaaki Hino",
              "Keiko Hiraga",
              "Hisashi Hirai",
              "Tadashi Hiramatsu",
              "Takeshi Honda",
              "Kazunobu Hoshi",
              "Akemi Hosoya",
              "Hiroyuki Imaishi",
              "Izumi Inomata",
              "Satoru Iriyoshi",
              "Mitsuo Iso",
              "Akihiko Isozaki",
              "Kohko Itoh",
              "Kanta Kamei",
              "Yumiko Katayama",
              "Toshio Kawaguchi",
              "Makiko Kawahata",
              "Emiko Kimura",
              "Kôji Kitamura",
              "Harumi Kiyono",
              "Makoto Kogawa",
              "Makiko Kojima",
              "Chiyomi Koyama",
              "Mamoru Kurosawa",
              "Masayuki",
              "Shôichi Masuo",
              "Ryô Miyata",
              "Manami Miyazaki",
              "Yûji Moriyama",
              "Yasushi Muraki",
              "Yasuhito Murata",
              "Atsuko Nakajima",
              "Katsuichi Nakayama",
              "Kimika Narita",
              "Eiko Nishi",
              "Takehiro Noda",
              "Fujie Obara",
              "Nobutoshi Ogura",
              "Yoshiyuki Sadamoto",
              "Miki Sakuma",
              "Akiko Sasaki",
              "Mamoru Sasaki",
              "Jukki Shinoda",
              "Chie Shirakawa",
              "Katsuhiko Shirato",
              "Kôji Sugiura",
              "Shunji Suzuki",
              "Hideki Takahashi",
              "Tomoe Takaya",
              "Tetsuya Takeuchi",
              "Manabu Tanzawa",
              "Norimoto Tokura",
              "Katsuyuki Tsubouchi",
              "Hiromi Uchibayashi",
              "Hidenobu Watanabe",
              "Yôko Watanabe",
              "Ikuto Yamashita",
              "Yayoi Yamashita",
              "Maiko Yamazaki",
              "Naoya Yoshida",
              "Yô Yoshinari",
              "",
              "Meghan is STINKY",
            ]}
          />
        </Suspense>
      </Canvas>

      <PlayButton playState={playState} onChange={setPlayState} />
    </>
  );
}
