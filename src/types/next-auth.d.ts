import {ISODateString} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      given_name: string;
      family_name: string;
      email: string;
      gender: string;
      roles: string[];
    },
    expires: ISODateString;
    accessToken: string;
  }
  interface Profile {
    sub: string;
    given_name: string;
    family_name: string;
    email: string;
    gender: string;
    "cognito:groups": string[];
  }
}