import Head from "next/head";
import { PageContainer } from "../components/page-container";
import { styled } from "../config/theme";
import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createRoom, getRoom, joinRoom } from "../utils/room";
import { Navbar } from "../components/nav-bar";
import { PlayerCount } from "../components/player-count";
import { useReadChannelState } from "@onehop/react";

const Form = styled("form", {
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  rowGap: "1rem",
});

const CreateRoomBtn = styled("button", {
  background: "$primary",
  color: "black",
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    background: "$primaryHover",
  },
});

const InputGroup = styled("div", {
  display: "flex",
  "& label": {
    height: "3rem",
    padding: "0.5rem 1rem",
    border: "1px solid $light",
    borderRadius: "0.75rem 0 0 0.75rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    fontWeight: "500",
    fontSize: "1.2rem",
  },
  "& input": {
    height: "3rem",
    outline: "none",
    boxSizing: "border-box",
    border: "1px solid $light",
    borderRadius: "0 0.75rem 0.75rem 0",
    background: "$dark",
    fontSize: "1.2rem",
    padding: "0.5rem 1rem",
    color: "$light",
  },
});

export default function Join() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const [playerCount, setPlayerCount] = useState(0);

  const { state: gameState } = useReadChannelState(router.query.roomId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomId = router.query.roomId;

    if (!roomId) {
      return;
    }

    console.log("Joining room", username);
    const roomData = await joinRoom(roomId, username);
    console.log(roomData);
    router.push(`/play?roomId=${roomId}`);
  };

  useEffect(() => {
    console.log("gameState", gameState);
    if (gameState) {
      setPlayerCount(gameState.players.length);
    }
  }, [gameState]);

  return (
    <PageContainer css={{ display: "flex" }}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <Form onSubmit={handleSubmit}>
        <PlayerCount playerCount={playerCount} />
        <InputGroup>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>

        <CreateRoomBtn>Join Room</CreateRoomBtn>
      </Form>
    </PageContainer>
  );
}
