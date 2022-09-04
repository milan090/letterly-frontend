import { useEffect } from "react";
import shortUUID from "short-uuid";
import { api } from "../config/axios";
import { initializeHop } from "../config/hop";
import "../styles/globals.css";

import { useSessionStore } from "../store/session";
import { DefaultSeo } from "next-seo";

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

  return (
    <>
      <DefaultSeo
        title="Letterly"
        description="Fun vocabulary game for friends and family"
        canonical="https://www.canonical.ie/"
        openGraph={{
          url: "https://www.url.ie/a",
          title: "Letterly",
          description: "Fun vocabulary game for friends and family",
          images: [
            {
              url: "https://www.example.ie/og-image-01.jpg",
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
    
          ],
          site_name: "Letterly",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
