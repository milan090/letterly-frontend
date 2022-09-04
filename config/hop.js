import { hop } from "@onehop/client";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!PROJECT_ID) {
  throw new Error("Missing env var NEXT_PUBLIC_PROJECT_ID");
}

export const initializeHop = () => {
  if (typeof window === "undefined") {
    return;
  }
  
  hop.init({
    projectId: PROJECT_ID
  });
};