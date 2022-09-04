import Axios from "axios";
import short from "short-uuid";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

export const api = Axios.create({
  baseURL: API_URL,
  headers: {
    sessionID: "",
  },
});
