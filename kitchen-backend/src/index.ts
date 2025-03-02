import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import logger from "./utils/logger";
import config from "./utils/config";

import recipeRouter from "./routes/recipes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(morgan("tiny"));

mongoose.set("strictQuery", false);

logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    let errorMessage = "Error connecting to MongoDB";
    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    }
    logger.error(errorMessage);
  });

app.use("/api/recipes", recipeRouter);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
