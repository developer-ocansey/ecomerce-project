import axios, { AxiosResponse, Method } from 'axios';
export const iourl = ''

const api = axios.create({
  baseURL: '',
});

const Request = <T>(
  method: Method,
  url: string,
  data: any,
  headers?: any,
): Promise<AxiosResponse<T>> => {
  return api.request<T>({
    method,
    url,
    data,
    headers,
  });
};

export const RequestPublic = <T>(
  method: Method,
  url: string,
  data: any,
  headers?: any,
): Promise<AxiosResponse<T>> => {
  return axios.create().request<T>({
    method,
    url,
    data,
    headers,
  });
};

export default Request;