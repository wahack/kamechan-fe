import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { addToast } from "@heroui/react";
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const createRequestInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    timeout: 60000,
    ...config,
  });
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const resData = response.data;
      
      if (resData.code !== 0) {
        // console.error(
        //   `[API Error] Code: ${resData.code}, Message: ${resData.message}`,
        //   `\nRequest URL: ${response.config.url}`,
        // );
        addToast({
          title: "Error",
          description: resData.message,
          color: "default",
        });
        return Promise.reject(response);
      }

      return response; // Directly return ApiResponse object
    },
    (error: AxiosError) => {
      console.error(
        `[Network Error] ${error.message}`,
        `\nRequest URL: ${error.config?.url}`,
      );
      addToast({
        title: "Network Error",
        description: "Please Try Again Later",
        color: "danger",
      });
      return Promise.reject(error);
    },
  );

  return instance;
};

export const requestApi = createRequestInstance();
