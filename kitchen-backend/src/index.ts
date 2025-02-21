import express from "express";
import cors from "cors";
import morgan from "morgan";
import logger from "./utils/logger";
import config from "./utils/config";
import recipeRouter from "./routes/recipes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/api/recipes", recipeRouter);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
