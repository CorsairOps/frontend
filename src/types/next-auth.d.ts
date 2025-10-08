import {ISODateString} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    },
    expires: ISODateString;
    accessToken: string;
    idToken: string;
    refreshToken: string;
  }

  interface Profile {
    sub: string;
    roles: string[];
  }
}