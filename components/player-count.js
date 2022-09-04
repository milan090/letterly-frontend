import { styled } from "../config/theme";
import { FaUserAlt } from "react-icons/fa";

const PlayerCountContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const PlayerCount = (props) => {
  return (
    <PlayerCountContainer>
      <FaUserAlt />
      <div>{props.playerCount} / 10 </div>
    </PlayerCountContainer>
  );
};
