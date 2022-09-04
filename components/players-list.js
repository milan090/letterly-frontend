import { styled } from "../config/theme";
import { PlayerCount } from "./player-count";

const Container = styled("div", {
  background: "$darker",
  padding: "1.5rem 1rem 5rem 1.5rem",
  // paddingBottom: "5rem",
  // paddingLeft: "1.5rem",
  width: "250px",
  borderRadius: "8px",
  minHeight: "70vh",
});

const PlayersListContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "1rem",
  marginTop: "1rem",
});

const PlayerContainer = styled("div", {
  display: "flex",
  alignItems: "flex-start",
  columnGap: "0.5rem",

  "& img": {
    borderRadius: "5px",
  },

  "& h4": {
    margin: 0,
  },
});

const Header = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "1.5rem",
});

export const PlayersList = (props) => {
  return (
    <Container>
      <Header>
        <h3>Players</h3>
        <PlayerCount playerCount={props.playerCount} />
      </Header>
      <PlayersListContainer>
        {props.players.map((player) => {
          return (
            <PlayerContainer key={player.sessionID}>
              <img
                src={`https://avatars.dicebear.com/api/adventurer-neutral/${player.userName}.svg`}
                height={50}
                alt={player.userName}
              />
              <div>
                <h4>{player.userName}</h4>
                <p>Score: {player.score}</p>
              </div>
            </PlayerContainer>
          );
        })}
      </PlayersListContainer>
    </Container>
  );
};
