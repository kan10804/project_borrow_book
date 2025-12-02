import axios from "axios";

export default (baseUrl) => {
  return axios.create({
    baseURL: "http://localhost:3000" + baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
