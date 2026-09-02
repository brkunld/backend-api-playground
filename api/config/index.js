import dotenv from "dotenv";

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

export default {
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  CONNECTION_STRING:
    process.env.CONNECTION_STRING ||
    "mongodb://localhost:27017/backend-api-playground",
};
