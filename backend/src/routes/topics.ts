import express from "express";
import database from "../database";
// import redis from "../redis";
import requireAuth from "../middlewares/requireAuth";
import redis from "../redis";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const topics = await database.select("id").select("name").from("topics");
  // .then(async (rows) => {
  //   if (rows.length) {
  //     const topicsRedis = await redis.get("users");

  //     if (!usersRedis) {
  //       return rows;
  //     }

  //     const userRedisData = JSON.parse(usersRedis);

  //     const userPromises = rows.map((user) => {
  //       const userData = userRedisData[user.email]

  //       return {
  //         ...user,
  //         last_seen: userData?.last_seen,
  //         active: userData?.active,
  //       };
  //     });

  //     return Promise.all(userPromises);
  //   }

  //   return [];
  // });

  return res.json(topics);
});

router.get("/online", requireAuth, async (req, res) => {
  return res.json(parseInt((await redis.get("online")) || "0"));
});

export default router;
