import axios from "axios";

const instance = axios.create({
  baseURL: "http://roomup.test/api",
});

export default instance;
