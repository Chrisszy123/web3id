export async function verifySignature(payload: {
    address: string;
    message: string;
    signature: string;
  }) {
    try {
      const res = await fetch("http://rust-verifier:4000/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Rust verifier failed: ${res.status} ${errorText}`);
      }
      const result =  await res.json() as Promise<boolean>;
      console.log('result', result);
      return result;
    } catch (error: any) {
      if (error.message.includes("Rust verifier failed")) {
        throw error;
      }
      throw new Error(`Failed to connect to Rust verifier: ${error.message}`);
    }
  }
  