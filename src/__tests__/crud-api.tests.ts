import request from "supertest";
import { IUser } from "../types";
import "dotenv/config";
import { v4 } from "uuid";

const port: number = Number(process.env.PORT) || 3000;
const req = request(`http://localhost:${port}/`);
const endpoint = "api/users/";

const cleanDataBase = async () => {
  const users = await req.get(endpoint);
  users.body.forEach(
    async (user: IUser) => await req.delete(endpoint + user.id)
  );
};

describe("Server should support basic operations", () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  const user: IUser = {
    username: "Lily",
    age: 19,
    hobbies: ["swimming", "play the piano"],
  };

  const updatedUser: IUser = {
    username: "Helen",
    age: 25,
    hobbies: ["dancing"],
  };

  test("should return an empty array of users at the beginning", async () => {
    const response = await req.get(endpoint);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("should create a new user and return it", async () => {
    const response = await req.post(endpoint).send(user);
    user.id = response.body.id;

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(user);
  });

  test("should get the created user by id", async () => {
    const response = await req.get(endpoint + user.id);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(user);
  });

  test("should update the user and return it by id", async () => {
    const response = await req.put(endpoint + user.id).send(updatedUser);

    updatedUser.id = user.id;

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  test("should get the updated user by id", async () => {
    const response = await req.get(endpoint + user.id);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedUser);
  });

  test("should delete the user by id", async () => {
    const response = await req.delete(endpoint + updatedUser.id);

    expect(response.statusCode).toBe(204);
  });

  test("should answer with status code 404, when request to a removed user", async () => {
    const response = await req.get(endpoint + updatedUser.id);

    expect(response.statusCode).toBe(404);
  });
});

describe("Server should answer with the correct status code, when there's a request with an invalid body", () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  test("should answer with status code 400, if the body doesn't contain required fields", async () => {
    let response = await req.post(endpoint).send({ age: 33, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Amelia", hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req.post(endpoint).send({ username: "Amelia", age: 33 });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Amelia", age: 33, hobbies: [] });
    expect(response.statusCode).toBe(201);

    const user: IUser = response.body;

    response = await req.put(endpoint + user.id).send({ age: 44, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Tom", hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Mary", age: 36 });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Mary", age: 36, hobbies: [] });
    expect(response.statusCode).toBe(200);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });

  test("should answer with status code 400, if the body contains not allowed field", async () => {
    let response = await req.post(endpoint).send({
      username: "Matt",
      age: 41,
      hobbies: ["ice-hockey"],
      notAllowedField: 555555,
    });

    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Matt", age: 41, hobbies: ["ice-hockey"] });
    expect(response.statusCode).toBe(201);

    const user: IUser = response.body;

    response = await req.put(endpoint + user.id).send({
      username: "Dina",
      age: 23,
      hobbies: [],
      notAllowedField: "something",
    });
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });

  test("should answer with status code 400, if the body contains field with an invalid type value", async () => {
    let response = await req
      .post(endpoint)
      .send({ username: 22, age: 22, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Lara", age: "22", hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Lara", age: 22, hobbies: "sing" });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Lara", age: 22, hobbies: [null] });
    expect(response.statusCode).toBe(400);

    response = await req
      .post(endpoint)
      .send({ username: "Lara", age: 22, hobbies: [] });
    expect(response.statusCode).toBe(201);

    const user: IUser = response.body;

    response = await req
      .put(endpoint + user.id)
      .send({ username: 22, age: 22, hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Lara", age: "22", hobbies: [] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Lara", age: 22, hobbies: "sing" });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Lara", age: 22, hobbies: [null] });
    expect(response.statusCode).toBe(400);

    response = await req
      .put(endpoint + user.id)
      .send({ username: "Lara", age: 22, hobbies: [] });
    expect(response.statusCode).toBe(200);

    response = await req.delete(endpoint + user.id);
    expect(response.statusCode).toBe(204);
  });
});

describe('Server should answer with correct status codes at non-existent endpoints', () => {
  beforeAll(cleanDataBase);
  afterAll(cleanDataBase);

  const randomId = v4();

  const cases = [
    [
      'invalidEndPoint',
      'api/invalidEndPoint',
      `api/users/${randomId}/invalidEndPoint`,
    ],
  ];

  test.each(cases)(
    'should answer with status code 404 for request to non-existent endpoints',
    async (endPoint) => {
      let response = await req.get(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.post(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.put(endPoint);
      expect(response.statusCode).toBe(404);

      response = await req.delete(endPoint);
      expect(response.statusCode).toBe(404);
    }
  );

  test('should answer with status code 404 for POST request to non-existent endpoints', async () => {
    let response = await req.post(endpoint + 'invalidId');
    expect(response.statusCode).toBe(404);

    response = await req.post(endpoint + randomId);
    expect(response.statusCode).toBe(404);
  });

  test('should answer with status code 400 for request with invalid id', async () => {
    let response = await req.get(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.put(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);

    response = await req.delete(endpoint + 'invalidId');
    expect(response.statusCode).toBe(400);
  });

  test('should answer with status code 404 for request with non-existent id', async () => {
    let response = await req.get(endpoint + randomId);
    expect(response.statusCode).toBe(404);

    response = await req.put(endpoint + randomId);
    expect(response.statusCode).toBe(404);

    response = await req.delete(endpoint + randomId);
    expect(response.statusCode).toBe(404);
  });
});
