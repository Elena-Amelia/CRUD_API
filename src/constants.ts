export enum ERROR_MESSAGES {
  invalidID = "UserId is invalid", //get, put, delete
  notFound = "User not found", //get, put, delete
  notReqFields = "Request body doesn't contain required fields", //post
  internalErr = "Unexpected error has occurred, try again later",
}

export enum HTTP_STATUS_CODE {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  NotFound = 404,
  InternalServerError = 500,
}

export enum HTTP_METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
