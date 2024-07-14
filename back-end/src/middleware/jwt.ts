import { verify } from "hono/jwt";
import app from "..";

app.use("/auth/*", async (c, next) => {
  try {
    const decodedPayload = await verify(
      c.req.header("Authorization") || "header",
      process.env?.JWT_SECRET_KEY || "mySecretKey"
    );
    //INFO: I used the headers because there is no known way for me to access
    //the request parameters over here

    //consider remomving this when in production and application is actually working
    console.log(decodedPayload.exp);

    if (!Number(c.req.header("userId"))) {
      return c.json({ error: "No userId specified in request headers" }, 403);
    }
    if (decodedPayload.userId === Number(c.req.header("userId"))) {
      await next();
    } else {
      return c.json({ error: "You're not authorized" }, 403);
    }
  } catch (error: any) {
    return c.json({ error: "You're not authorized", message: error.name }, 403);
  }
});
