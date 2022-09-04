import { useChannelMessage, useReadChannelState } from "@onehop/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "../config/theme";
import { useSessionStore } from "../store/session";
import { clamp } from "../utils/math";
import { nextPlayer } from "../utils/room";

const ProgressContainer = styled("div", {
  height: "5px",
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#e0e0de",
  borderRadius: "5px",
  marginTop: "2.5rem",
});

const Progress = styled("div", {
  height: "5px",

  backgroundColor: "$primary",
  borderRadius: "5px",
  transition: "width 1s linear",
});

const Text = styled("p", {
  fontSize: "1.2rem",
  fontFamily: "monospace",
  color: "$light",
});

export const TimeProgressBar = (props) => {
  const playerStartTime = props.playerStartTime;
  const playerEndTime = props.playerEndTime;

  const [currentTime, setCurrentTime] = useState(new Date());

  const totalDuration = playerEndTime - playerStartTime;
  const elapsedTime = clamp(currentTime - playerStartTime, 0, totalDuration);
  const timeLeft = totalDuration - elapsedTime;
  const progress = clamp(elapsedTime / totalDuration, 0, 1) * 100;

  const router = useRouter();
  const roomId = router.query.roomId;
  const [sessionID] = useSessionStore((state) => [state.sessionID]);
  const { state: gameState } = useReadChannelState(roomId);

  const [tickTokAudio] = useState(new Audio("/audio/tick-tok.mp3"));
  const [tickTokPlaying, setTickTokPlaying] = useState(false);

  const [tickTokFastAudio] = useState(new Audio("/audio/tick-tok-fast.mp3"));
  const [tickTokFastPlaying, setTickTokFastPlaying] = useState(false);

  const [ringAudio] = useState(new Audio("/audio/ring.mp3"));
  const [ringPlaying, setRingPlaying] = useState(false);

  const [countDownInterval, setCountDownInterval] = useState(null);

  const gameFinished = gameState.game === "finished";
  useChannelMessage(roomId, "PLAYER_ANSWER", (answer) => {
    console.log("your", answer);
    if (countDownInterval) {
      clearInterval(countDownInterval);
      setCountDownInterval(null);

      if (tickTokPlaying || tickTokFastPlaying) {
        tickTokAudio.pause();
        setTickTokPlaying(false);
        tickTokAudio.currentTime = 0;

        tickTokFastAudio.pause();
        setTickTokFastPlaying(false);
        tickTokFastAudio.currentTime = 0;
      }
    }
  });

  useEffect(() => {
    if (gameState.game !== "finished") {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 100);
      setCountDownInterval(interval);
      return () => {
        clearInterval(interval);
        setCountDownInterval(null);
      };
    }
  }, [playerEndTime, playerStartTime]);

  useEffect(() => {
    if (countDownInterval) {
      const timeLeftSeconds = timeLeft / 1000;
      const durationSeconds = totalDuration / 1000;

      if (timeLeftSeconds < durationSeconds) {
        if (timeLeftSeconds > 2 && !tickTokPlaying) {
          tickTokAudio.play();
          setTickTokPlaying(true);
          setTickTokFastPlaying(false);
          setRingPlaying(false);
        } else if (
          timeLeftSeconds <= 2 &&
          timeLeftSeconds > 0 &&
          !tickTokFastPlaying
        ) {
          tickTokAudio.pause();
          tickTokAudio.currentTime = 0;
          tickTokFastAudio.play();
          setTickTokFastPlaying(true);
          setTickTokPlaying(false);
          setRingPlaying(false);
        } else if (timeLeftSeconds <= 0 && !ringPlaying) {
          tickTokAudio.pause();
          tickTokAudio.currentTime = 0;
          tickTokFastAudio.pause();
          tickTokFastAudio.currentTime = 0;
          ringAudio.play();
          setRingPlaying(true);
          setTickTokFastPlaying(false);
          setTickTokPlaying(false);
        }
      }
    }
  }, [
    ringAudio,
    ringPlaying,
    tickTokAudio,
    tickTokFastAudio,
    tickTokFastPlaying,
    tickTokPlaying,
    timeLeft,
    totalDuration,
  ]);

  useEffect(() => {
    if (!gameFinished) {
      const isHost = sessionID === gameState?.host;
      const roomId = router.query.roomId;

      if (isHost && roomId && progress === 100) {
        console.log(roomId);
        nextPlayer(roomId).then((res) => console.log(res));
      }
    }
  }, [gameState?.host, progress, router.query.roomId, sessionID]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((prevProgress) => {
  //       const diff = 100 / props.time;
  //       return prevProgress >= 100 ? 100 : prevProgress + diff;
  //     });
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [props.time]);

  return (
    <ProgressContainer>
      <Progress css={{ width: `${progress}%` }} />
      <Text css={{ textAlign: "center", marginTop: "1rem" }}>
        Time left: {(timeLeft / 1000).toFixed(2).substring(0, 7)}
      </Text>
    </ProgressContainer>
  );
};
