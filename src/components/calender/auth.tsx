import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import z from "zod";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const SCOPES = "https://www.googleapis.com/auth/calendar";
const KEY = "DASH_INFO";

const zToken = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  id_token: z.string(),
  refresh_token_expires_in: z.number(),
});
const zRefreshedToken = zToken.omit({ refresh_token: true });

export type Token = z.infer<typeof zToken>;

async function exchangeAuthCode({ code }: { code: string }) {
  console.log("Exchanging auth code", { code });
  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: "http://localhost:5173",
    grant_type: "authorization_code",
  });
  return zToken.parse(await getNewToken({ params }));
}

async function refreshAuthToken({ refreshToken }: { refreshToken: string }) {
  console.log("Refreshing access token");
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  return zRefreshedToken.parse(await getNewToken({ params }));
}

async function getNewToken({ params }: { params: URLSearchParams }) {
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Auth: error getting token", { err });
    throw new Error(
      `Token retrieval failed: ${res.status} ${
        res.statusText
      } – ${JSON.stringify(err)}`
    );
  }

  return await res.json();
}

type GoogleOfflineAuthProps = {
  setAccessToken: (accessToken: string) => void;
};

export default function GoogleOfflineAuth({
  setAccessToken,
}: GoogleOfflineAuthProps) {
  const codeClientRef =
    useRef<ReturnType<typeof google.accounts.oauth2.initCodeClient>>(null);
  const [isGisLoaded, setGisLoaded] = useState(false);
  const [authCode, setAuthCode] = useState<string>();

  const existingToken = localStorage.getItem(KEY);
  const parsedToken = existingToken
    ? zToken.parse(JSON.parse(existingToken))
    : undefined;
  const [token, setToken] = useState<Token | undefined>(parsedToken);

  // 1. Dynamically inject the GIS <script> (or you can put this in public/index.html)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "gis-sdk";
    script.onload = () => {
      console.log("Auth: gis loaded by callback");
      setGisLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // 2. Initialize the CodeClient once GIS is available
  useEffect(() => {
    if (!isGisLoaded || codeClientRef.current) return;
    console.log("Auth: gis loaded", { google: window.google, codeClientRef });

    /* global google */
    codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      ux_mode: "popup", // or 'redirect'
      callback: (response) => {
        const { code } = response;
        console.log("Auth: Got one-time auth code", { code });
        setAuthCode(code);
      },
    });
  }, [isGisLoaded]);

  useEffect(() => {
    if (!authCode && !token) return;

    const getToken = async () => {
      console.log("Auth: tokens", {
        authCode: authCode !== undefined,
        token: token !== undefined,
      });
      let newToken: Token;

      try {
        if (!token && authCode) {
          newToken = await exchangeAuthCode({ code: authCode });
        } else if (token) {
          const { access_token, expires_in } = await refreshAuthToken({
            refreshToken: token.refresh_token,
          });
          newToken = {
            ...token,
            access_token,
            expires_in,
          };
        } else {
          console.error("Auth: Unexpected state");
          throw new Error("Unexpected auth error");
        }

        setToken(newToken);
        setAccessToken(newToken.access_token);
        setAuthCode(undefined);
        localStorage.setItem(KEY, JSON.stringify(newToken));

        const expiry = (newToken.expires_in - 60) * 1000;
        console.log("Auth: new acces token expires in", { expiry });
        setTimeout(getToken, expiry);
      } catch (err) {
        console.error("Auth: Failed to get token", { err });
        setToken(undefined);
        setAuthCode(undefined);
      }
    };

    getToken();
  }, [authCode]);

  // 3. Handler to kick off the consent flow
  const handleSignIn = () => {
    if (codeClientRef.current) {
      codeClientRef.current.requestCode();
    } else {
      console.warn("Auth: GIS CodeClient not yet initialized");
    }
  };

  return (
    !token && (
      <Button
        type="button"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "8px 12px",
          border: "1px solid #dadce0",
          borderRadius: "4px",
          backgroundColor: "#fff",
          cursor: "pointer",
          height: "100%",
          width: "100%",
        }}
        onClick={handleSignIn}
        disabled={!isGisLoaded}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          style={{ width: "18px", height: "18px", marginRight: "8px" }}
        />
        <span style={{ fontSize: "14px", color: "#3c4043" }}>
          Sign in with Google
        </span>
      </Button>
    )
  );
}
