import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import fastifyCors from "@fastify/cors"
import { nonceRoute } from "./routes/nonce.js";
import { verifyRoute } from "./routes/verify.js";
import { authMiddleware } from "./middleware/auth.js";

const app = Fastify();
await app.register(fastifyCors, {
  origin: ['http://localhost:5173'], // Array of specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'], // Allowed request headers
  credentials: true, // Allows cookies, authorization tokens, etc. to be sent with requests
  maxAge: 86400 // Caches preflight responses for 24 hours (86400 seconds)
});
app.register(nonceRoute);
app.register(verifyRoute);

app.get(
  "/admin/metrics",
  { preHandler: authMiddleware(["ADMIN"]) },
  async () => {
    return { secure: true };
  }
);

app.listen({ port: 3001 }, () => {
  console.log("Auth Service running on :3001");
});