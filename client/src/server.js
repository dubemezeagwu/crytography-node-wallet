import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:5042",
});

export default server;
