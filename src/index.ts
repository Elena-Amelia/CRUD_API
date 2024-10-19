import {config} from "dotenv";
import {server} from './app';

config();
// const port = process.env.PORT || 4000;

server.listen(3000, ()=> {
    console.log("Server is running on port", 3000)
});