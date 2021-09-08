import config, { isProd } from "./config";
import { main as controller } from "./controllers/main.controller";
import { createServer, startServer } from "./server";
import { log } from "./services";
import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

export const start = () =>
  startServer({
    app: createServer(
      {
        prisma,
      },
      controller,
    ),
    port: isProd() ? 80 : config.PORT,
  }).catch((e) => {
    log.info("Internal Server Error: ", e.message);
    log.error(e.stack);
  });

start();
