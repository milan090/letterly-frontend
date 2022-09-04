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
    <div>
      <DefaultSeo
        title="Letterly"
        description="Fun vocabulary game for friends and family"
        canonical="https://letterly.hop.sh/"
        openGraph={{
          url: "https://letterly.hop.sh/",
          title: "Letterly",
          description: "Fun vocabulary game for friends and family",
          images: [
            {
              url: "https://letterly.hop.sh/preview.png",
              width: 800,
              height: 600,
              alt: "Letterly - Fun Vocabulary Game",
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
        additionalLinkTags={[
          {
            rel: "shortcut icon",
            href: "/favicon.png",
          },
        ]}
      />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
