import { validate } from "uuid";
import { IUser } from "../types";

export function validateID(id: IUser["id"]) {
  return validate(id);
}

export function validateFullReqData(userData: IUser | null) {
  let isValid: boolean, validMessage: string[];

  if (userData === null) {
    isValid = false;
    validMessage = ["the request doesn't contain valid data"];
  } else {
    let messageArr = [];
    let message: string;

    for (let key in userData) {
      if (key !== "username" && key !== "age" && key !== "hobbies") {
        message = `the request contains not allowed field ${key}, please, remove it`;
        messageArr.push(message);
      }
    }

    if (userData.username === undefined) {
      message = "the request doesn't contain field username";
      messageArr.push(message);
    } else {
      if (typeof userData.username !== "string") {
        message = "username value must be a string";
        messageArr.push(message);
      }
    }

    if (userData.age === undefined) {
      message = "the request doesn't contain field age";
      messageArr.push(message);
    } else {
      if (typeof userData.age !== "number") {
        message = "age value must be a number";
        messageArr.push(message);
      }
    }

    if (userData.hobbies === undefined) {
      message = "the request doesn't contain field hobbies";
      messageArr.push(message);
    } else {
      if (!Array.isArray(userData.hobbies)) {
        message = "hobbies value must be an array";
        messageArr.push(message);
      } else {
        if (userData.hobbies.length !== 0) {
          let count = 0;
          userData.hobbies.forEach((elem) => {
            if (typeof elem !== "string") {
              count++;
            }
          });
          if (count !== 0) {
            message = "hobby value must be a string";
            messageArr.push(message);
          }
        }
      }
    }
    if (messageArr.length === 0) {
      isValid = true;
      validMessage = [];
    } else {
      isValid = false;
      validMessage = messageArr;
    }
  }
  return { isValid, validMessage };
}

export function validatePartReqData(userData: IUser | null) {
  let isValid: boolean, validMessage: string[];

  if (userData === null) {
    isValid = false;
    validMessage = ["the request doesn't contain valid data"];
  } else {
    let messageArr = [];
    let message: string;

    for (let key in userData) {
      if (key !== "username" && key !== "age" && key !== "hobbies") {
        message = `the request contains not allowed field ${key}, please, remove it`;
        messageArr.push(message);
      }
    }

    if (typeof userData.username !== "string") {
      message = "username value must be a string";
      messageArr.push(message);
    }

    if (typeof userData.age !== "number") {
      message = "age value must be a number";
      messageArr.push(message);
    }

    if (!Array.isArray(userData.hobbies)) {
      message = "hobbies value must be an array";
      messageArr.push(message);
    } else {
      if (userData.hobbies.length !== 0) {
        let count = 0;
        userData.hobbies.forEach((elem) => {
          if (typeof elem !== "string") {
            count++;
          }
        });
        if (count !== 0) {
          message = "hobby value must be a string";
          messageArr.push(message);
        }
      }
    }

    if (messageArr.length === 0) {
      isValid = true;
      validMessage = [];
    } else {
      isValid = false;
      validMessage = messageArr;
    }
  }
  return { isValid, validMessage };
}
