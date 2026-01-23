import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.jsx";

// values
const AUTH0_DOMAIN = "abbasdev.us.auth0.com";
const AUTH0_CLIENT_ID = "4x7M1M5iAMaABwCauVQ0AS573k0PA0GN";
const CURRENT_ORIGIN = window.location.origin;

console.log("Auth0 Configuration:", {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  origin: CURRENT_ORIGIN,
  redirectUri: CURRENT_ORIGIN
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: CURRENT_ORIGIN,
        scope: "openid profile email",
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={false}
      onRedirectCallback={(appState) => {
        window.location.href = appState?.returnTo || window.location.pathname;
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);