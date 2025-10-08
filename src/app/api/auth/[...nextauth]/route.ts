import KeycloakProvider from "next-auth/providers/keycloak";
import NextAuth, {AuthOptions} from "next-auth";

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

      console.log("Token", token);
      console.log("Account", account);
      console.log("Profile", profile);

      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
      }

      if (profile) {
        console.log("Profile:", profile);
        token.id = profile.sub;
        token.roles = profile.roles;
      }
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

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};