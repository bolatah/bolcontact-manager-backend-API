// cors configuration
require("dotenv").config();
const corsOptions = {
  origin: process.env.REACT_APP_ORIGIN_NAME,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Accept",
    "access-token",
    "refresh-token",
    "x-access-token-expiration",
  ],
  credentials: true,
};

module.exports = corsOptions;
