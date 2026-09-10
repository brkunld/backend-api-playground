import dotenv from "dotenv";

if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

export default {
  PORT: process.env.PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  CONNECTION_STRING: process.env.CONNECTION_STRING,
};
