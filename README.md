# CRUD API 

## Instructions

Use 22.x.x version (22.9.0 or upper) of Node.js

### Installation

To install the application, do the following commands in order:
```
git clone https://github.com/Elena-Amelia/CRUD_API.git
```
```
cd CRUD_API
```
```
git checkout crud-api
```
```
npm install
```

### Launch

Based on the `.env.example` file, create a `.env` file and change the PORT if it's necessary (by default the application runs on port 3000)

### To run the application use the following commands:
Development mode:
```
npm run start:dev
```
Production mode:
```
npm run start:prod
```
### After the application is fully loaded, you can send requests.

### Tests are launched via a separate terminal with the command:
```
npm test
```
### Available endpoints:
```
GET      http://localhost:3000/api/users
GET      http://localhost:3000/api/users/{uuid}
POST     http://localhost:3000/api/users
PUT      http://localhost:3000/api/users/{uuid}
DELETE   http://localhost:3000/api/users/{uuid}
```

### Usage

1. The client communicates with the server via the port specified in `.env` file.
2. The client can be Postman or other similar applications.
3. The data in the request to the server must be sent in JSON format.
4. Data from the server response is returned in JSON format.
5. Finish the process via `ctrl+C`.