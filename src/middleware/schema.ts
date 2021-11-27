import * as yup from "yup";
import { log } from "../services";

export const storeSchema = yup
  .object()
  .shape({
    wallet: yup.string().required(),
    data: yup.string().required(),
  })
  .required();

export const retrieveSchema = yup
  .object()
  .shape({
    wallet: yup.string().required(),
  })
  .required();

export const validate = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (e: any) {
    log.debug("Error validating request body schema:");
    log.error(e.message);

    return res.status(400).json({
      ERROR: true,
      MESSAGE: "SCHEMA VALIDATION ERROR: " + e.message,
    });
  }
};
