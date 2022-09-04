import { styled } from "../config/theme";

export const Button = styled("button", {
  padding: "0.5rem 1rem",
  borderRadius: "0.5rem",
  border: "none",
  fontSize: "1.2rem",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",

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
