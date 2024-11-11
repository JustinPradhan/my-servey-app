import axios from "axios";
import envVariables from "./configs";
import { GET_STORED_ACCESS_TOKEN, clearLocalStorage } from "./storage";


export const user_url = envVariables.VITE_REACT_APP_USER_API_URL;

export const surveyDashboard = `${user_url}/auth/surveyDashboard`;


export const surveyType = `${user_url}/auth/surveyType`;

export const surveyTypeActive = `${user_url}/auth/surveyTypeActive`;
//
export const saveQuestionUrl = `${user_url}/auth/question`;
export const questionUrl = `${user_url}/auth/question?id=`;
//summitSurvey
export const summitSurvey = `${user_url}/auth/summitSurvey`


export async function getPublicIpAddress(): Promise<string> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching public IP address:', error);
    throw new Error('Could not fetch public IP address');
  }
}


export const openLocalHttpService = axios.create();

openLocalHttpService.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  config.headers["Authorization"] = "";
  // if (GET_STORED_ACCESS_TOKEN) {
  //   console.log(BEARER);
  //   config.headers["Authorization"] = BEARER;
  // }
  return config;
});


let BEARER = `Bearer ${GET_STORED_ACCESS_TOKEN}`;

openLocalHttpService.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const statusCode = error.request.status;
    const originalRequest = error.config;
    const oldAccessToken = localStorage.getItem("AccessToken");
    const refreshToken = localStorage.getItem("RefreshToken");

    if (statusCode === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        clearLocalStorage();
        const url = `${refreshToken}`
        const { data } = await openLocalHttpService.get(url);

        if (!data?.accessToken || !data?.refreshToken) {
          const TOAST_MSG = "session expired please log in again.";
          clearLocalStorage();
          return;
        }

        // axios.defaults.headers.common["Authorization"] =
        //   "Bearer " + data.accessToken;
        BEARER = "Bearer " + data.accessToken;
        localStorage.setItem("AccessToken", data.accessToken);
        localStorage.setItem("RefreshToken", data.refreshToken);

        return openLocalHttpService(originalRequest);
      } catch (e) {
        const TOAST_MSG = "session expired please log in again.";
        clearLocalStorage();
      }
    }

    return Promise.reject(error);
  }
);