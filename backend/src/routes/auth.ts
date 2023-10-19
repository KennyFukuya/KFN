import express from "express";
import { OAuth2Client, UserRefreshClient } from "google-auth-library";
// import database from "../database";

const router = express.Router();

const clientId = process.env.CLIENT_ID as string;

const clientSecret = process.env.CLIENT_SECRET as string;

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

router.post("/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code);
  console.log(tokens);

  res.json(tokens);
});

router.post("/google/refresh-token", async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken
  );
  const { credentials } = await user.refreshAccessToken();

  res.json(credentials);
});

export default router;
