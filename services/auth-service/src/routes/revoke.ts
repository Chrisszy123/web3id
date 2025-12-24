export async function revokeRoute(app: any) {
    app.post("/auth/revoke", async (req: any) => {
      const { sessionId } = req.body;
  
      await app.db.sessions.update(sessionId, { revoked: true });
  
      return { success: true };
    });
  }
  