import cors from "cors";
import express from "express";
import morgan from "morgan";

import { Controller, ControllerDeps } from "./controllers/types";
import { limitMw, slowMw } from "./middleware";
import { log } from "./services";

export const createServer = (
  dependencies: ControllerDeps,
  ...controllers: Controller[]
): express.Express => {
  const { prisma } = dependencies;
  const app = express();
  app.use(express.json());
  app.use(cors());

  // cors headers
  app.use(function (req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    next();
  });

  // rate limiting middleware
  app.use(slowMw);
  app.use(limitMw);

  // loggin middleware
  app.use(morgan("dev"));

  // add controllers
  for (const setupController of controllers) {
    const controller = setupController(dependencies);
    app.use(controller.path, controller.router);
  }

  return app;
};

export const startServer = async ({
  app,
  port,
}: {
  app: express.Express;
  port: number | string;
}) => {
  return app.listen(port, () => {
    log.info(`Server listening on port ${port}`);
  });
};
