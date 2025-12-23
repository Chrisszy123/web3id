import { useAccount, useSignMessage } from "wagmi";
import React from "react";

export function Login() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  async function login() {
    const nonceRes = await fetch("/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ walletAddress: address })
    });

    const { nonce } = await nonceRes.json();

    const signature = await signMessageAsync({ message: nonce });

    const verifyRes = await fetch("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ walletAddress: address, signature })
    });

    const { token } = await verifyRes.json();
    localStorage.setItem("token", token);
  }

  return <button onClick={login}>Sign in with Wallet</button>;
}
