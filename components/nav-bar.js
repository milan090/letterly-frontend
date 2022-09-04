import Image from "next/image";
import Link from "next/link";
import { styled } from "../config/theme";
import { PlayerCount } from "./player-count";

const NavbarContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "2rem",
});

const BrandLogo = styled("div", {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "$primary",
  display: "flex",
  alignItems: "center",
  columnGap: "1rem",
});

export const Navbar = (props) => {
  return (
    <NavbarContainer>
      <div>
        <Link href="/" passHref>
          <a>
            <BrandLogo>
              <Image src="/logo.svg" alt="Logo" width={50} height={50} />{" "}
              Letterly
            </BrandLogo>
          </a>
        </Link>
      </div>
      {props.playerCount && <PlayerCount playerCount={props.playerCount} />}
    </NavbarContainer>
  );
};
