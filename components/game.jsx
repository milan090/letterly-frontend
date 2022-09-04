import { useChannelMessage, useReadChannelState } from "@onehop/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "../config/theme";
import { useSessionStore } from "../store/session";
import { submitAnswer } from "../utils/room";
import { TimeProgressBar } from "./time-progress";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Image from "next/image";

const PlayerInputContainer = styled("form", {
  display: "flex",
});

const PlayerInput = styled("input", {
  border: "none",
  outline: "none",
  padding: "0.5rem",
  fontSize: "4rem",
  fontWeight: "bold",
  background: "none",
  color: "white",
  textTransform: "uppercase",
  textAlign: "center",

  "&::placeholder": {
    color: "$lighter",
  },
});

const GameContent = styled("label", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minHeight: "60vh",
});

const GameHintMessage = styled("p", {
  fontSize: "1.2rem",
  fontFamily: "monospace",
});

const PrimaryText = styled("span", {
  color: "$primary",
});

const GameMessage = styled("h2", {
  fontSize: "2rem",
  fontWeight: "bold",
});

const Text = styled("span", {
  color: "$light",
});

const PlayerAnswer = styled("div", {
  position: "absolute",
  background: "$light",
  color: "$dark",
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem 0.5rem 0.5rem 0",

  right: "-7rem",
  top: 0,

  variants: {
    isCorrect: {
      true: {
        background: "$success",
      },
      false: {
        background: "$error",
      },
    },
  },
});

export const Game = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const [sessionID] = useSessionStore((state) => [state.sessionID]);
  const { state: gameState } = useReadChannelState(roomId);
  const gameFinished = gameState?.game === "finished";

  const [playerAnswer, setPlayerAnswer] = useState(null);

  useChannelMessage(roomId, "PLAYER_ANSWER", (answer) => {
    setPlayerAnswer(answer);
  });

  const players = gameState?.players || [];
  const currentPlayerId = gameState?.currentPlayer;
  const currentPlayer = players.find((p) => p.sessionID === currentPlayerId);

  const [playerInput, setPlayerInput] = useState("");

  const playerStartTime =
    gameState?.playerStartTime && new Date(gameState.playerStartTime);
  const playerEndTime =
    gameState?.playerEndTime && new Date(gameState.playerEndTime);
  const currentTime = new Date();

  const { width, height } = useWindowSize();

  const handleSubmit = (e) => {
    e.preventDefault();

    setPlayerInput("");
    submitAnswer(router.query.roomId, playerInput).then((res) =>
      console.log("answer", res)
    );
  };

  useEffect(() => {
    if (playerAnswer) {
      setTimeout(() => {
        setPlayerAnswer(null);
      }, 3000);
    }
  }, [playerAnswer]);

  const stage1Word =
    gameState.stage === 1 && gameState.stage1Word?.toUpperCase();
  const stage2Word =
    gameState.stage === 2 && gameState.stage2Word?.toUpperCase();
  const stage3Word = gameState.stage === 3 && gameState.stage3Word;

  if (gameFinished) {
    const maxScore = Math.max(...gameState.players.map((p) => p.score));
    const winner = gameState.players.find(
      (player) => player.score === maxScore
    );
    return (
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Confetti width={width} height={height} />
        <img
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentPlayer?.userName}.svg`}
          height={150}
          alt={currentPlayer?.userName}
        />
        <h1 style={{ marginTop: "2rem" }}>Winner: {winner?.userName}</h1>
      </div>
    );
  }

  return (
    <GameContent htmlFor="answer">
      <div style={{ position: "relative" }}>
        <img
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentPlayer?.userName}.svg`}
          height={250}
          alt={currentPlayer?.userName}
        ></img>
        {playerAnswer && (
          <PlayerAnswer isCorrect={!!playerAnswer.scoreDelta}>
            {playerAnswer.word.toUpperCase()}{" "}
            <strong>
              {playerAnswer.scoreDelta && `${playerAnswer.scoreDelta}+`}
            </strong>
          </PlayerAnswer>
        )}
      </div>
      <GameMessage css={{ textAlign: "center", marginTop: "1rem" }}>
        It&apos;s{" "}
        <PrimaryText>
          {sessionID === currentPlayer.sessionID
            ? "your"
            : `${currentPlayer?.userName}'s`}
        </PrimaryText>{" "}
        turn
      </GameMessage>
      {sessionID === currentPlayerId && (
        <PlayerInputContainer onSubmit={handleSubmit}>
          <PlayerInput
            autoComplete="off"
            value={playerInput}
            placeholder="TYPE"
            id="answer"
            autoFocus
            onChange={(e) => setPlayerInput(e.target.value)}
          />
        </PlayerInputContainer>
      )}
      <GameHintMessage>
        {stage1Word && (
          <>
            Word: {stage1Word.substring(0, stage1Word.length - 1)}
            <Text css={{ color: "$primary" }}>
              {stage1Word.substring(stage1Word.length - 1)}
            </Text>
          </>
        )}
        {stage2Word && (
          <>
            Part of word: <Text css={{ color: "$primary" }}>{stage2Word}</Text>
          </>
        )}
        {stage3Word && (
          <p style={{ maxWidth: "700px", textAlign: "center", marginTop: "1rem" }}>
            Definition: <Text>{stage3Word.definition}</Text>
          </p>
        )}
      </GameHintMessage>
      {playerStartTime && playerEndTime && currentTime && (
        <TimeProgressBar
          playerStartTime={playerStartTime}
          playerEndTime={playerEndTime}
          currentTime={currentTime}
        />
      )}
    </GameContent>
  );
};
