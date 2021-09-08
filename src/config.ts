import dotenv from "dotenv";
dotenv.config();

export function isProd() {
  return process.env.NODE_ENV === "production";
}

export function fetchConfig() {
  return {
    NODE_ENV: process.env.NODE_ENV!,
    PORT: parseInt(process.env.PORT!),
    POSTGRES: process.env.POSTGRES!,
  };
}

export default fetchConfig();
