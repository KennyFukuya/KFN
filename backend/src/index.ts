/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import database from "./database";
import app from "./server";
import redis from "./redis";
import {
  isInternalTokenExpired,
  isTokenExpired,
} from "./middlewares/requireAuth";

database.migrate.latest();

const server = app.listen(process.env.PORT || 8080, function () {
  console.log("Webserver is ready");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const io = new Server(server, { cors: { origin: "*" } });

io.use(async (socket, next) => {
  const authToken = socket.handshake.auth.token;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return next(new Error("Unauthorized"));
  }

  const token = authToken.split(" ")[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(token);

  if (data && data.source === "internal") {
    const hasTokenExpired = await isInternalTokenExpired(token);

    if (hasTokenExpired) {
      return next(new Error("Unauthorized"));
    }

    return next();
  } else {
    const isExpired = await isTokenExpired(token);

    if (isExpired) {
      return next(new Error("Unauthorized"));
    }

    return next();
  }
});

io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token.split(" ")[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(token);

  console.log("A user connected");

  const online = parseInt((await redis.get("online")) || "0");

  await redis.set("online", online + 1);

  io.emit("message", {
    message: `Has joined`,
    timestamp: Date.now(),
    email: data.email,
    name: `${data.given_name} ${data.family_name}`,
    type: "text",
  });

  socket.on("disconnect", async () => {
    console.log("A user has disconnected");

    const online = parseInt((await redis.get("online")) || "0");

    await redis.set("online", online - 1);

    io.emit("message", {
      message: `Has left`,
      timestamp: Date.now(),
      email: data.email,
      name: `${data.given_name} ${data.family_name}`,
      type: "text",
    });
  });

  socket.on("message", (data) => {
    console.log("Received message:", data);

    io.emit("message", data);
  });
});

// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// shut down server
function shutdown() {
  server.close(function onServerClosed(err?: Error) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
}
//
// need above in docker container to properly exit
//
