import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

import authRouter from "./routes/auth";
import topicsRouter from "./routes/topics";

const app = express();

app.use(morgan("common"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/auth", authRouter);

app.use("/topics", topicsRouter);

app.get("/healthz", function (req, res) {
  res.send("I am happy and healthy\n");
});

export default app;
