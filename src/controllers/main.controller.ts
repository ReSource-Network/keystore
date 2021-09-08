import { Router } from "express";

import {
  storeSchema,
  retrieveSchema,
  validate as validateSchema,
} from "../middleware";
import { log } from "../services";
import { Controller } from "./types";

export const main: Controller = ({ prisma }) => {
  const r = Router();

  // Health check
  r.get("/", (_, res) => {
    return res.status(200).send("OK");
  });

  // CRUD
  r.post("/store", validateSchema(storeSchema), async (req, res) => {
    const { wallet, data } = req.body;

    if (!(wallet && data))
      return res.status(401).send({
        ERROR: true,
        MESSAGE: "BAD REQUEST: PARAMS WALLET AND DATA REQUIRED",
      });

    try {
      const created = await prisma.wallet.upsert({
        where: { walletId: wallet },
        update: { key: data },
        create: {
          walletId: wallet,
          key: data,
        },
      });

      if (!created) {
        return res.status(500).send({
          ERROR: true,
          MESSAGE: "INTERNAL SERVER ERROR: COULD NOT CREATE WALLET ENTRY",
        });
      }

      return res.status(200).json({
        wallet: created,
        error: false,
      });
    } catch (e) {
      log.debug("Error storing key:");
      log.error(e);

      return res.status(500).send({
        ERROR: true,
        MESSAGE: "INTERNAL SERVER ERROR: " + e,
      });
    }
  });

  r.post("/retrieve", validateSchema(retrieveSchema), async (req, res) => {
    const { wallet } = req.body;

    if (!wallet)
      return res.status(401).send({
        ERROR: true,
        MESSAGE: "BAD REQUEST: PARAM LINK REQUIRED",
      });

    try {
      const exists = await prisma.wallet.findUnique({
        where: { walletId: wallet },
      });

      if (!exists) {
        return res.status(500).send({
          ERROR: true,
          MESSAGE:
            "INTERNAL SERVER ERROR: COULD NOT FIND WALLET WITH ID: " + wallet,
        });
      }

      return res.status(200).json({
        walletId: exists.walletId,
        data: exists.key,
        error: false,
      });
    } catch (e) {
      log.debug("Error retrieving wallet:");
      log.error(e);

      return res.status(500).send({
        ERROR: true,
        MESSAGE: "INTERNAL SERVER ERROR: " + e,
      });
    }
  });

  return {
    path: "/api",
    router: r,
  };
};
