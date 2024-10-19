import { IncomingMessage, ServerResponse } from "node:http";
import { v4 } from "uuid";
import { IUser, IError } from "../types";
import {
  validateID,
  validateFullReqData,
  validatePartReqData,
} from "./validation";
import { HTTP_STATUS_CODE, ERROR_MESSAGES } from "../constants";

export let db: IUser[] = [];

export async function parseReqBody(req: IncomingMessage) {
  return new Promise<IUser | null>((resolve) => {
    const buffers = [];
    req.on("data", (chunk) => buffers.push(chunk));
    req.on("end", () => {
      const data = Buffer.concat(buffers).toString();
      try {
        let reqData = JSON.parse(data);
        resolve(reqData);
      } catch (err) {
        resolve(null);
      }
    });
  });
}

export function getUser(id: IUser["id"]) {
  let foundUser: IUser | IError;
  let statusCode: number;

  if (validateID(id)) {
    db.forEach((elem: IUser) => {
      if (elem.id === id) {
        foundUser = elem;
        statusCode = HTTP_STATUS_CODE.OK;
      } else {
        foundUser = { error: ERROR_MESSAGES.notFound };
        statusCode = HTTP_STATUS_CODE.NotFound;
      }
    });
  } else {
    foundUser = { error: ERROR_MESSAGES.invalidID };
    statusCode = HTTP_STATUS_CODE.BadRequest;
  }
  return { foundUser, statusCode };
}

export function getAllUsers() {
  const foundUsers: IUser[] | [] = db;
  const statusCode: number = HTTP_STATUS_CODE.OK;
  return { foundUsers, statusCode };
}

export function createUser(userData: IUser | null) {
  const validation = validateFullReqData(userData);
  let newUser: IUser | IError;
  let statusCode: number;

  if (validation.isValid) {
    const id = v4();
    let user = Object.assign({}, userData);
    user.id = id;
    db.push(user);
    newUser = user;
    statusCode = HTTP_STATUS_CODE.Created;
  } else {
    newUser = { error: validation.validMessage.join(", ") };
    statusCode = HTTP_STATUS_CODE.BadRequest;
  }

  return { newUser, statusCode };
}

export function updateUser(id: IUser["id"], userData: IUser | null) {
  let updatedUser: IUser | IError;
  let statusCode: number;
  let user: IUser | IError;

  if (validateID(id)) {
    db.forEach((elem: IUser) => {
      if (elem.id === id) {
        user = elem;

        const validation = validatePartReqData(userData);

        if (validation.isValid) {
          if (userData.username) {
            elem.username = userData.username;
          }
          if (userData.age) {
            elem.age = userData.age;
          }
          if (userData.hobbies) {
            elem.hobbies = userData.hobbies;
          }
          updatedUser = elem;
          statusCode = HTTP_STATUS_CODE.OK;
        } else {
          updatedUser = { error: validation.validMessage.join(", ") };
          statusCode = HTTP_STATUS_CODE.BadRequest;
        }
      } else {
        updatedUser = { error: ERROR_MESSAGES.notFound };
        statusCode = HTTP_STATUS_CODE.NotFound;
      }
    });
  } else {
    updatedUser = { error: ERROR_MESSAGES.invalidID };
    statusCode = HTTP_STATUS_CODE.BadRequest;
  }

  return { updatedUser, statusCode };
}

export function deleteUser(id: IUser["id"]) {
  let deletedUser: IUser | IError;
  let statusCode: number;

  if (validateID(id)) {
    db.forEach((elem: IUser, ind: number) => {
      if (elem.id === id) {
        db.splice(ind, 1);
        deletedUser = {};
        statusCode = HTTP_STATUS_CODE.NoContent;
      } else {
        deletedUser = { error: ERROR_MESSAGES.notFound };
        statusCode = HTTP_STATUS_CODE.NotFound;
      }
    });
  } else {
    deletedUser = { error: ERROR_MESSAGES.invalidID };
    statusCode = HTTP_STATUS_CODE.BadRequest;
  }
  return{deletedUser, statusCode }
}
