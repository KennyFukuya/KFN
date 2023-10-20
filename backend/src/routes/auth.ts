import express from "express";
import jwt from "jsonwebtoken";
import { UserRefreshClient } from "google-auth-library";
import database from "../database";
import redis from "../redis";
import oAuth2Client, { clientId, clientSecret } from "../clients/oAuth2Client";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

router.post("/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);

  if (!tokens.id_token) {
    console.error("Error getting tokens for code:", req.body.code);

    return res.status(400).json({ error: "Failed to retrieve token" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(tokens.id_token);

  database
    .select("email")
    .from("users")
    .where("email", data.email)
    .then(async (rows) => {
      if (!rows.length) {
        database("users")
          .insert({
            email: data.email,
            given_name: data.given_name,
            family_name: data.family_name,
            source: "google",
          })
          .then(() => {
            console.log("New User from Google OAuth2 saved successfully");
          });
      }

      const users = await redis.get("users");
      const usersList = users ? JSON.parse(users) : {};

      await redis.set(
        "users",
        JSON.stringify({
          ...usersList,
          [data.email]: { ...tokens, last_seen: Date.now(), active: true },
        })
      );
    });

  return res.json(tokens);
});

router.post("/google/refresh-token", requireAuth, async (req, res) => {
  const { refreshToken } = req.body;

  const user = new UserRefreshClient(clientId, clientSecret, refreshToken);
  const { credentials } = await user.refreshAccessToken();

  if (!credentials.id_token) {
    console.error("Error getting tokens for refresh token:", refreshToken);

    return res.status(400).json({ error: "Failed to retrieve token" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(credentials.id_token);

  const users = await redis.get("users");
  const usersList = users ? JSON.parse(users) : {};

  await redis.set(
    "users",
    JSON.stringify({
      ...usersList,
      [data.email]: { ...credentials, last_seen: Date.now(), active: true },
    })
  );

  return res.json(credentials);
});

router.post("/google/logout", requireAuth, async (req, res) => {
  const authorizationHeader = req.headers.authorization!;
  const token = authorizationHeader.split(" ")[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(token);

  const userRedis = await redis.get(data.email);

  if (!userRedis) {
    return res.status(404).json({ message: "Session not found" });
  }

  const userData = JSON.parse(userRedis);

  const users = await redis.get("users");
  const usersList = users ? JSON.parse(users) : {};

  await redis.set(
    "users",
    JSON.stringify({
      ...usersList,
      [data.email]: { ...userData, last_seen: Date.now(), active: true },
    })
  );

  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
