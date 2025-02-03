// app/services/GenericHttpClientService.ts
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Axios from "axios";

export default class GenericHttpClientService {
  private static _instance: GenericHttpClientService;

  private readonly axios: AxiosInstance;

  private constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public static initInstance(axios: AxiosInstance): GenericHttpClientService {
    this._instance = new GenericHttpClientService(axios);
    return this._instance;
  }

  public static getInstance(): GenericHttpClientService {
    if (!this._instance) {
      throw new Error("Http service instance not initialized yet");
    }
    return this._instance;
  }

  // Generic GET method
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw to allow calling code to handle it as well
    }
  }

  // Generic POST method
  public async post<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.post(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic PUT method
  public async put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.put(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Generic DELETE method
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axios.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new Error((error as any).response.data.error.message);
    }
  }

  // Error handler
  private handleError(error: unknown): void {
    if (Axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error(`Axios error: ${error.message}`, error.response?.data);
    } else {
      // Handle other unexpected errors
      console.error("Unexpected error", error);
    }
  }
}
