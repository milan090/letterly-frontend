import { useChannelMessage, useReadChannelState } from "@onehop/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { styled } from "../config/theme";
import { useSessionStore } from "../store/session";
import { submitAnswer } from "../utils/room";
import { TimeProgressBar } from "./time-progress";

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

  right: "-5rem",
  top: 0
});

export const Game = () => {
  const router = useRouter();
  const roomId = router.query.roomId;
  const [sessionID] = useSessionStore((state) => [state.sessionID]);
  const { state: gameState } = useReadChannelState(roomId);

  const [playerAnswer, setPlayerAnswer] = useState("");

  useChannelMessage(roomId, "PLAYER_ANSWER", (answer) => {
    console.log("Player answer", answer);
    if (answer.player !== sessionID) {
      setPlayerAnswer(answer.word);
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    submitAnswer(router.query.roomId, playerInput).then((res) =>
      console.log("answer", res)
    );
  };

  useEffect(() => {
    if (playerAnswer) {
      setTimeout(() => {
        setPlayerAnswer("");
      }, 3000);
    }
  }, [playerAnswer]);

  const word = gameState.stage1Word?.toUpperCase();

  return (
    <GameContent htmlFor="answer">
      <div style={{ position: "relative" }}>
        <img
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentPlayer?.userName}.svg`}
          height={250}
          alt={currentPlayer?.userName}
        ></img>
        {playerAnswer && (
          <PlayerAnswer>{playerAnswer.toUpperCase()}</PlayerAnswer>
        )}
      </div>
      <GameMessage css={{ textAlign: "center", marginTop: "1rem" }}>
        It&apos;s <PrimaryText>{currentPlayer?.userName}&apos;s</PrimaryText>{" "}
        turn
      </GameMessage>
      {sessionID === currentPlayerId && (
        <PlayerInputContainer onSubmit={handleSubmit}>
          <PlayerInput
            value={playerInput}
            placeholder="TYPE"
            id="answer"
            autoFocus
            onChange={(e) => setPlayerInput(e.target.value)}
          />
        </PlayerInputContainer>
      )}
      <GameHintMessage>
        Word: {word.substring(0, word.length - 1)}
        <Text css={{ color: "$primary" }}>
          {word.substring(word.length - 1)}
        </Text>
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
