import KeycloakProvider from "next-auth/providers/keycloak";
import NextAuth, {AuthOptions} from "next-auth";
import {JWT} from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, account, profile}) {
      // Initial sign in
      if (account && profile && token) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : null;
        token.id = profile.sub;
        token.roles = profile.roles;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && new Date() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      console.log("Access token has expired, refreshing...");
      token = await refreshAccessToken(token);
      return token;
    },
    async session({session, token, user}) {
      if (session && token) {
        session.accessToken = token.accessToken as string;
        session.idToken = token.idToken as string;
        session.refreshToken = token.refreshToken as string;

        if (session.user) {
          session.user.id = token.id as string;
          session.user.roles = (token.roles as string[]) || [];
        }
      }

      return session;
    }
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    const url = `${process.env.KEYCLOAK_ISSUER!}/protocol/openid-connect/token`;
    console.log("Refreshing access token at URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      })
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.log("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};