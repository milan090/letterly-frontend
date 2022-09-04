import { hop } from "@onehop/client";
import { useReadChannelState } from "@onehop/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "../components/button";
import { Navbar } from "../components/nav-bar";
import { PageContainer } from "../components/page-container";
import { PlayersList } from "../components/players-list";
import { styled } from "../config/theme";
import { useGameStore } from "../store/game-store";
import { FiCopy } from "react-icons/fi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { InviteFriends } from "../components/invite-friends";
import { useSessionStore } from "../store/session";

const Container = styled("div", {
  margin: "0 auto",
  marginTop: "4rem",
  maxWidth: "1450px",
  width: "100%",
  display: "flex",
  columnGap: "2rem",
  padding: "0 2rem",
});

const GameContainer = styled("div", {
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const PrimaryText = styled("span", {
  color: "$primary",
});

const GameMessage = styled("h2", {
  fontSize: "2rem",
  fontWeight: "bold",
});

const GameBar = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
});

const GameInfo = styled("div", {
  display: "flex",
  columnGap: "1rem",
  alignItems: "center",
});

const StageTitle = styled("h1", {
  fontSize: "3rem",
  fontWeight: "bold",
  marginBottom: "1rem",
});

const StageRound = styled("span", {
  fontSize: "1.5rem",
});

const GameStatus = styled("span", {
  fontSize: "1.2rem",
  fontFamily: "monospace",
});

const PlayerInputContainer = styled("div", {
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

const GameContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const GameHintMessage = styled("p", {
  fontSize: "1.2rem",
  fontFamily: "monospace",
});

export default function Play() {
  const [playerInput, setPlayerInput] = useState("");

  const [sessionID, setSessionID] = useSessionStore((s) => [
    s.sessionID,
    s.setSessionID,
  ]);

  const router = useRouter();

  const { state: gameState } = useReadChannelState(router.query.roomId);

  useEffect(() => {
    console.log("Game state", gameState);
  }, [gameState]);

  // const currentPlayer = players[0];
  const currentPlayer = null;
  
  const players = gameState?.players || [];
  const playerCount = players?.length || 0;

  return (
    <PageContainer css={{ alignItems: "center" }}>
      <Navbar playerCount={playerCount} />

      <Container>
        <PlayersList players={players} playerCount={playerCount} />
        <GameContainer>
          <GameBar>
            <GameInfo>
              <StageTitle>Stage 1: Last Letter</StageTitle>
              <StageRound>(Round 3)</StageRound>
            </GameInfo>
            <GameStatus>Waiting for input...</GameStatus>
          </GameBar>
          {currentPlayer ? (
            <GameContent>
              <img
                src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentPlayer.name}.svg`}
                height={250}
              />
              <GameMessage css={{ textAlign: "center", marginTop: "1rem" }}>
                It&apos;s <PrimaryText>{currentPlayer.name}&apos;s</PrimaryText>{" "}
                turn
              </GameMessage>
              <PlayerInputContainer>
                <PlayerInput
                  value={playerInput}
                  placeholder="TYPE"
                  onChange={(e) => setPlayerInput(e.target.value)}
                />
              </PlayerInputContainer>
              <GameHintMessage>
                HINT:Enter word starting with letter A
              </GameHintMessage>
            </GameContent>
          ) : sessionID === gameState?.host ? (
            <InviteFriends playerCount={playerCount} />
          ) : (
            "Wait for host to start the game"
          )}
        </GameContainer>
      </Container>
    </PageContainer>
  );
}
