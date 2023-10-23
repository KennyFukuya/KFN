import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserRefreshClient } from "google-auth-library";
import database from "../database";
import redis from "../redis";
import oAuth2Client, { clientId, clientSecret } from "../clients/oAuth2Client";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

const saltRounds = 15;

const createHashPwd = (password: string) => {
  return bcrypt.hashSync(password, saltRounds);
};

function signToken(user: {
  family_name: string;
  given_name: string;
  email: string;
  source: string;
}) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
        source: "internal",
      },
      process.env.JWT_SECRET_KEY as string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function (err: any, token: any) {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

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

router.post("/logout", requireAuth, async (req, res) => {
  const authorizationHeader = req.headers.authorization!;
  const token = authorizationHeader.split(" ")[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(token);

  if (data && data.source === "internal") {
    const expiredTokens = (await redis.get("expiredTokens")) || "[]";
    const tokens = JSON.parse(expiredTokens);

    await redis.set("expiredTokens", JSON.stringify([...tokens, token]));
  }

  return res.status(200).json({ message: "Logged out successfully" });
});

router.post("/signup", async (req, res) => {
  const data = req.body;

  if (!data.email || !data.givenName || !data.familyName || !data.password) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  database
    .select("email")
    .from("users")
    .where("email", data.email)
    .first()
    .then(async (rows) => {
      if (rows) {
        console.error("Account already exists");

        return res.status(409).json({ error: "Account already exists" });
      }

      const hashedPassword = createHashPwd(data.password);

      database("users")
        .insert({
          email: data.email,
          given_name: data.givenName,
          family_name: data.familyName,
          password: hashedPassword,
          source: "signup",
        })
        .then(() => {
          console.log("New User from Signup saved successfully");

          return res.status(201).json({ message: "Account created." });
        })
        .catch((err) => {
          console.error(err);

          return res.status(500).json({ error: "An error occurred" });
        });
    })
    .catch((err) => {
      console.error(err);

      return res.status(500).json({ error: "An error occurred" });
    });
});

router.post("/login", async (req, res) => {
  const data = req.body;

  if (!data.email || !data.password) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  database
    .select("*")
    .from("users")
    .where("email", data.email)
    .first()
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      bcrypt.compare(data.password, user.password).then(async (result) => {
        if (result) {
          const token = await signToken(user);

          return res.status(200).json({ message: "Login successful", token });
        } else {
          return res.status(401).json({ error: "Incorrect password" });
        }
      });
    })
    .catch((err) => {
      console.error(err);

      return res.status(500).json({ error: "An error occurred" });
    });
});

router.post("/validate", requireAuth, async (req, res) => {
  return res.status(200).json({ message: "Is Valid" });
});

export default router;
