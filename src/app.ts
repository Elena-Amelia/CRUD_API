import { createServer } from "node:http";
import { HTTP_STATUS_CODE, ERROR_MESSAGES } from "./constants";
import { controller } from "./controller";

export const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const data = await controller(req, res);
    res.statusCode = data.statusCode;
    res.end(JSON.stringify(data.result));
  } catch (err) {
    res.statusCode = HTTP_STATUS_CODE.InternalServerError;
    res.end(JSON.stringify({ error: ERROR_MESSAGES.internalErr }));
  }
});
