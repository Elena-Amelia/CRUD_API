import { ServerResponse } from "node:http";

export type HttpResponse = {
   statusCode: number;
   result: IUser | IError | IUser[] | [];
}

export interface IUser {
    id?: string;
    username?: string;
    age?: number;
    hobbies?: string[] | [];
}

export interface IError {
    error: string;
}
