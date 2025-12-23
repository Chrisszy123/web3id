import { useAccount, useSignMessage, useConnect, useDisconnect } from "wagmi";

export function Login() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  async function login() {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const nonceRes = await fetch("http://localhost:3001/auth/nonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address })
      });

      if (!nonceRes.ok) {
        throw new Error("Failed to get nonce");
      }

      const { nonce } = await nonceRes.json();
      console.log(nonce);

      const signature = await signMessageAsync({ message: nonce });

      const verifyRes = await fetch("http://localhost:3001/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address, signature })
      });

      if (!verifyRes.ok) {
        throw new Error("Failed to verify signature");
      }

      const { token } = await verifyRes.json();
      localStorage.setItem("token", token);
      alert("Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      alert(`Login failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  if (!isConnected) {
    return (
      <div>
        <p>Connect your wallet to sign in</p>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            style={{ margin: "0.5rem", padding: "0.5rem 1rem" }}
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={login} style={{ marginRight: "0.5rem" }}>
        Sign in with Wallet
      </button>
      <button onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
