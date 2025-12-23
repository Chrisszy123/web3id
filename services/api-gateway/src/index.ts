import Fastify from "fastify";

const app = Fastify();

app.get("/health", async () => {
  return { status: "ok" };
});

app.listen({ port: 3000 }, () => {
  console.log("API Gateway running on :3000");
});