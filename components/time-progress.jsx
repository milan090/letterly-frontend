import { useReadChannelState } from "@onehop/react";
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
  const [sessionID] = useSessionStore((state) => [state.sessionID]);
  const { state: gameState } = useReadChannelState(router.query.roomId);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100);
    return () => clearInterval(interval);
  }, [playerEndTime, playerStartTime]);

  useEffect(() => {
    const isHost = sessionID === gameState?.host;
    const roomId = router.query.roomId;

    if (isHost && roomId && progress === 100) {
      nextPlayer(roomId).then((res) => console.log(res));
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
