"use client";
import LoginBtn from "@/components/LoginBtn";
import {useSession} from "next-auth/react";
import {useGetAllAssets} from "@/lib/api/services/assetServiceAPI";

export default function Home() {
  const {data: session} = useSession();

  const {data: assets, isLoading: loadingAssets, error: assetsError} = useGetAllAssets();

  return (
    <div>
      <LoginBtn/>

      {session && session.user && (
        <div>
          <h2>Welcome, {session.user.given_name}</h2>
          <p>Email: {session.user.email}</p>
        </div>
      )}

      {loadingAssets && (
        <p>Loading assets...</p>
      )}

      {assetsError && (
        <p>Error loading assets: {assetsError.message}</p>
      )}

      {assets && assets.map((asset) => (
        <div key={asset.id}>
          <p>{asset.name}</p>
          <p>{asset.type}</p>
          <p>{asset.status}</p>
          <hr/>
        </div>
      ))}
    </div>
  );
}