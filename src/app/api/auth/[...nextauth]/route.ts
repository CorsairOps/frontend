import CognitoProvider from "next-auth/providers/cognito";
import NextAuth, {AuthOptions} from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, account, profile}) {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        console.log("Profile:", profile);
        token.id = profile.sub;
        token.given_name = profile.given_name;
        token.family_name = profile.family_name;
        token.email = profile.email;
        token.gender = profile.gender;
        token.roles = profile["cognito:groups"] || [];
      }
      return token;
    },
    async session({session, token, user}) {
      if (session && token) {
        session.accessToken = token.accessToken as string;

        if (session.user) {
          session.user.id = token.id as string;
          session.user.given_name = token.given_name as string;
          session.user.family_name = token.family_name as string;
          session.user.email = token.email as string;
          session.user.gender = token.gender as string;
          session.user.roles = (token.roles as string[]) || [];
        }
      }

      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};