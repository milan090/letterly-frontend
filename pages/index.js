import Head from "next/head";
import { PageContainer } from "../components/page-container";
import { styled } from "../config/theme";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { createRoom } from "../utils/room";
import { Navbar } from "../components/nav-bar";
import { Button } from "../components/button";
import { useGameStore } from "../store/game-store";
import Image from "next/image";

const Form = styled("form", {
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  rowGap: "1rem",
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

const CAT_PICS = [
  "cat-fine.svg",
  "cat-wink.svg",
  "cat-sleepy.svg",
  "cat-please.svg",
  "cat.svg",
];

const catPic = CAT_PICS[Math.floor(Math.random() * CAT_PICS.length)];

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [setGameState] = useGameStore((s) => [s.setGameState]);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const roomData = await createRoom(username);
      setGameState(roomData);

      const roomId = roomData.id;
      router.push(`/play?roomId=${roomId}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer css={{ display: "flex" }}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />

      <Form onSubmit={handleSubmit}>
        <Image priority={false} src={`/${catPic}`} width={200} height={200} />
        <InputGroup>
          <label htmlFor="name">Name</label>
          <input
            autoComplete="off"
            id="name"
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>

        <Button isLoading={isLoading} variant="primary">Create room</Button>
      </Form>
    </PageContainer>
  );
}
