// simple node web server that displays hello world
// optimized for Docker image

import express from "express";
// this example uses express web framework so we know what longer build times
// do and how Dockerfile layer ordering matters. If you mess up Dockerfile ordering
// you'll see long build times on every code change + build. If done correctly,
// code changes should be only a few seconds to build locally due to build cache.

import morgan from "morgan";
// morgan provides easy logging for express, and by default it logs to stdout
// which is a best practice in Docker. Friends don't let friends code their apps to
// do app logging to files in containers.

import database from "./database";

import session from "express-session";

import authRouter from "./routes/auth";
import passport from "passport";

// Appi
const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET as string,
  })
);

app.use(passport.authenticate("session"));

app.use(morgan("common"));

app.use("/auth", authRouter);

app.get("/", function (req, res, next) {
  database
    .raw("select VERSION() version")
    .then(([rows]) => rows[0])
    .then((row) => res.json({ message: `Hello from MySQL ${row.version}` }))
    .catch(next);
});

app.get("/healthz", function (req, res) {
  // do app logic here to determine if app is truly healthy
  // you should return 200 if healthy, and anything else will fail
  // if you want, you should be able to restrict this to localhost (include ipv4 and ipv6)
  res.send("I am happy and healthy\n");
});

export default app;
