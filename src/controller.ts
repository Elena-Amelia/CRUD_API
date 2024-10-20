// import path from "node:path";
// import url from "node:url";
// import fs from "node:fs";
import { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_METHODS, HTTP_STATUS_CODE, ERROR_MESSAGES } from "./constants";
import { HttpResponse } from "./types";
import {
  parseReqBody,
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./functions/handlers";

export async function controller(req: IncomingMessage, res: ServerResponse) {
  let result: HttpResponse["result"];
  let statusCode: HttpResponse["statusCode"];

  if (!/^\/api\/users\/?/.test(req.url!)) {
    result = { error: ERROR_MESSAGES.nonExistingEndPoint };
    statusCode = HTTP_STATUS_CODE.NotFound;
    return { statusCode, result };
  } else {
    const id = req.url.replace(/^\/api\/users\/?|\/$/g, "");
    const userData = await parseReqBody(req);

    try {
      switch (req.method) {
        case HTTP_METHODS.GET:
          if (id) {
            const user = getUser(id);
            result = user.foundUser;
            statusCode = user.statusCode;
          } else {
            const users = getAllUsers();
            result = users.foundUsers;
            statusCode = users.statusCode;
          }

          break;
        case HTTP_METHODS.POST:
          if (id) {
            result = {
              error:
                "You are not allowed to send id to endpoint in method POST",
            };
            statusCode = HTTP_STATUS_CODE.NotFound;
          } else {
            const user = createUser(userData);
            result = user.newUser;
            statusCode = user.statusCode;
          }

          break;
        case HTTP_METHODS.PUT:
          if (!id) {
            result = {
              error: "User id is absent. Please, enter user id to endpoint",
            };
            statusCode = HTTP_STATUS_CODE.NotFound;
          } else {
            const user = updateUser(id, userData);
            result = user.updatedUser;
            statusCode = user.statusCode;
          }
          break;
        case HTTP_METHODS.DELETE:
          if (!id) {
            result = {
              error: "User id is absent. Please, enter user id to endpoint",
            };
            statusCode = HTTP_STATUS_CODE.NotFound;
          } else {
            const user = deleteUser(id);
            result = user.deletedUser;
            statusCode = user.statusCode;
          }
          break;

        default:
          throw new Error("Invalid request method");
      }
    } catch (err) {
      if (err) {
        statusCode = HTTP_STATUS_CODE.InternalServerError;
        result = {
          error: ERROR_MESSAGES.internalErr,
        };
      }
    }
    return { statusCode, result };
  }
}
