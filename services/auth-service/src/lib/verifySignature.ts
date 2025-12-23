export async function verifySignature(payload: {
    address: string;
    message: string;
    signature: string;
  }) {
    const res = await fetch("http://rust:4000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  
    if (!res.ok) {
      throw new Error("Rust verifier failed");
    }
  
    return res.json() as Promise<boolean>;
  }
  