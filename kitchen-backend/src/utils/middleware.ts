import logger from "./logger";

const requestLogger = (request, response, next) => {
  logger.info(request.method, request.path, response.statusCode);
  if (process.env.NODE_ENV === "dev" && request.method === "POST") {
    logger.info(request.body);
  }
  next();
};

export default { requestLogger };
