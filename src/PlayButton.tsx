import { useRef } from "react";

export type PlayState = "paused" | "playing" | "reset";

type PlayButtonProps = {
  playState: PlayState;
  onChange: (playState: PlayState) => void;
};

export function PlayButton(props: PlayButtonProps) {
  const { playState, onChange } = props;

  const playButton = useRef<HTMLButtonElement>(null!);

  const soundcloudWidget = useRef(
    window.SC.Widget(document.querySelector("#soundcloudWidget"))
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
