import { useEffect } from "react";
import shortUUID from "short-uuid";
import { api } from "../config/axios";
import { initializeHop } from "../config/hop";
import "../styles/globals.css";

import { useSessionStore } from "../store/session";

function MyApp({ Component, pageProps }) {
  const [sessionID, setSessionID] = useSessionStore((s) => [
    s.sessionID,
    s.setSessionID,
  ]);
  useEffect(() => {
    initializeHop();

    if (!sessionID) {
      setSessionID(shortUUID.generate());
    }

    console.log("sessionID = ", sessionID);
    api.defaults.headers.sessionID = sessionID;
  }, [sessionID, setSessionID]);

  return <Component {...pageProps} />;
}

export default MyApp;
