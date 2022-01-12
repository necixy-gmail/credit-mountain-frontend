import axios from "axios";
import { store } from "../redux/Store";
import { errorToast } from "../utils/toast";
import history from "../utils/history";
export const BASE_URL = "https://stark-sea-18065.herokuapp.com/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Accept-Language": "en",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      errorToast(error?.response?.data?.message);
      store.dispatch({ type: "LOGOUT" });
      history.replace("login");
      throw error;
    } else throw error;
  }
);

export default axiosInstance;
