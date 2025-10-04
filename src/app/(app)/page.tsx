"use client";
import LoginBtn from "@/components/LoginBtn";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

export default function Home() {
  const {data: session} = useSession();

  const [assets, setAssets] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function fetchAssets() {
    try {
      const res = await fetch("http://localhost:9000/api/assets", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.accessToken}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch assets");
      }

      const data = await res.json();
      setAssets(data);
      setFetchError(null);
    } catch (error: any) {
      setFetchError(error.message);
      setAssets([]);
    }
  }

  useEffect(() => {
    fetchAssets();
  }, [session]);

  return (
    <div>
      <LoginBtn/>

      {session && session.user && (
        <div>
          <h2>Welcome, {session.user.given_name}</h2>
          <p>Email: {session.user.email}</p>
        </div>
      )}

      <p>Error:</p>
      {fetchError}
      <p>Assets: </p>
      {assets.map((asset) => (
        <div key={asset.id}>
          <p>{asset.name} - {asset.type} - {asset.status}</p>

        </div>
      ))}
    </div>
  );
}