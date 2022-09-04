import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { styled } from "../config/theme";
import { startGame } from "../utils/room";
import { Button } from "./button";

const InviteFriendsContainer = styled("div", {
  display: "flex",
  columnGap: "1rem",
  alignItems: "center",
  flexDirection: "column",
});

const Text = styled("span", {
  color: "$light",
});

export const InviteFriends = (props) => {
  const router = useRouter();
  const [gameLink, setGameLink] = useState("");
  const playerCount = props.playerCount;
  const [copied, setCopied] = useState(false);

  const handleGameStart = async () => {
    const roomId = router.query.roomId;
    const roundsPerStage = 3;

    if (!roomId) {
      throw new Error("No room id");
    }

    const res = await startGame(roomId, roundsPerStage);
    console.log(res);
  };

  useEffect(() => {
    const { roomId } = router.query;
    setGameLink(`${window?.location.origin}/join?roomId=${roomId}`);
  }, [router.query]);

  return (
    <InviteFriendsContainer>
      Invite your friends to play with you. Share this link: <br />
      <Text
        css={{
          marginTop: "1rem",
          marginBottom: "2rem",
          fontSize: "1.2rem",
          display: "flex",
          alignItems: "center",
          columnGap: "0.5rem",
          color: "white",
        }}
      >
        {gameLink}
        <CopyToClipboard
          style={{ cursor: "pointer", transition: "color 50ms ease-in" }}
          text={gameLink}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }}
        >
          <FiCopy size="2rem" color={copied ? "#E2B714" : "white"} />
        </CopyToClipboard>
      </Text>
      <Button onClick={handleGameStart} disabled={playerCount <= 1}>
        START GAME
      </Button>
      {playerCount <= 1 && (
        <Text css={{ color: "$light", marginTop: "1rem" }}>
          You need at least 2 players to start the game
        </Text>
      )}
    </InviteFriendsContainer>
  );
};
