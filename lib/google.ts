/* ------------------------------------------------------------------ */
/*  Google OAuth 2.0 / OpenID Connect (authorization-code flow).        */
/*                                                                      */
/*  Confidential client: the code is exchanged server-to-server with    */
/*  the client secret, so the ID token is received directly from        */
/*  Google's token endpoint over TLS. Per the OIDC spec, signature      */
/*  validation is then optional — we still validate the aud / iss / exp */
/*  claims, which is what actually matters. No extra dependencies.      */
/* ------------------------------------------------------------------ */

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export function isGoogleConfigured(): boolean {
  return !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;
}

function clientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not set");
  return id;
}

function clientSecret(): string {
  const secret = process.env.GOOGLE_CLIENT_SECRET;
  if (!secret) throw new Error("GOOGLE_CLIENT_SECRET is not set");
  return secret;
}

/** Build the Google consent-screen URL to redirect the user to. */
export function buildGoogleAuthUrl(opts: {
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    client_id: clientId(),
    redirect_uri: opts.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state: opts.state,
    access_type: "online",
    prompt: "select_account",
    include_granted_scopes: "true",
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

type TokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
};

/** Exchange an authorization code for tokens (server-to-server). */
export async function exchangeGoogleCode(opts: {
  code: string;
  redirectUri: string;
}): Promise<TokenResponse> {
  const body = new URLSearchParams({
    code: opts.code,
    client_id: clientId(),
    client_secret: clientSecret(),
    redirect_uri: opts.redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    throw new Error(`Google token exchange failed (${res.status})`);
  }
  const json = (await res.json()) as TokenResponse;
  if (!json.id_token) throw new Error("Google response had no id_token");
  return json;
}

export type GoogleClaims = {
  sub: string; // Google user id
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  aud?: string;
  iss?: string;
  exp?: number;
};

/**
 * Decode the ID token JWT and validate its critical claims. Signature
 * validation is intentionally omitted — the token came straight from the
 * token endpoint over TLS (see file header), so provenance is already
 * established; the claims below are what guard against misuse.
 */
export function verifyGoogleIdToken(idToken: string): GoogleClaims {
  const parts = idToken.split(".");
  if (parts.length !== 3) throw new Error("Malformed id_token");

  const claims = JSON.parse(
    Buffer.from(parts[1], "base64url").toString("utf8")
  ) as GoogleClaims;

  const issOk =
    claims.iss === "https://accounts.google.com" ||
    claims.iss === "accounts.google.com";
  if (!issOk) throw new Error("id_token: unexpected issuer");
  if (claims.aud !== clientId()) throw new Error("id_token: audience mismatch");
  if (!claims.exp || claims.exp * 1000 < Date.now()) {
    throw new Error("id_token: expired");
  }
  if (!claims.sub) throw new Error("id_token: no subject");
  return claims;
}
