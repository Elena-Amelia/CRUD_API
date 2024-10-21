import {config} from "dotenv";
import {server} from './app';

config();
const port = Number(process.env.PORT) || 4000;

server.listen(port, ()=> {
    console.log("Server is running on port", port)
});