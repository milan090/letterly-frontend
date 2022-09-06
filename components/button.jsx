import { PropagateLoader, PulseLoader, SyncLoader } from "react-spinners";
import { styled } from "../config/theme";

const ButtonInner = styled("button", {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  variants: {
    variant: {
      primary: {
        background: "$primary",
        color: "black",
        "&:hover": {
          background: "$primaryHover",
        },
      },
    },
  },

  "&:disabled": {
    background: "$lighter",
    cursor: "not-allowed",
    color: "black",

    "&:hover": {
      background: "$lighter",
    },
  },

  defaultVariants: {
    variant: "primary",
  },
});

export const Button = ({ children, isLoading, ...props }) => {
  return (
    <ButtonInner {...props}>
      {isLoading && (
        <PulseLoader
          cssOverride={{
            position: "absolute",
          }}
          color={"yellow"}
          loading={true}
          size={8}
        />
      )}
      <span style={{ opacity: isLoading ? 0 : 1 }}>{children}</span>
    </ButtonInner>
  );
};
