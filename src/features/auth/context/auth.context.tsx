"use client";
import React, {createContext, useEffect} from "react";
import {AXIOS_INSTANCE} from "@/lib/api/axiosInstance";
import {signOut, useSession} from "next-auth/react";

const AuthContext = createContext<string | null>(null);

export const AuthProvider = ({ children}: {
  children: React.ReactNode;
}) => {

  const {data: session} = useSession();

  useEffect(() => {
    // Adds the Authorization header to each request if the user is authenticated
    const interceptorId = AXIOS_INSTANCE.interceptors.request.use((config) => {
      if (config.headers && session && session.accessToken) {
        Object.entries({
          Authorization: `Bearer ${session.accessToken}`,
        }).forEach(([key, value]) => {
          config.headers.set(key, value);
        })
      }
      return config;
    });

    // Handle session errors
    if (session?.error === "RefreshAccessTokenError") {
      console.log("Session error: ", session.error);
      signOut(); // User's session has expired, sign them out
    }

    return () => {
      AXIOS_INSTANCE.interceptors.request.eject(interceptorId);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  )
}