import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MongoDB connection string not specified");
}

export default {
  PORT,
  MONGODB_URI,
};
