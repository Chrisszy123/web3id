import Fastify from "fastify";

const app = Fastify();

app.post("/auth/nonce", async () => {
  return { nonce: "random-nonce-placeholder" };
});

app.listen({ port: 3001 }, () => {
  console.log("Auth Service running on :3001");
});