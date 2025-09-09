import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    response => {
      const { data } = response;
      if (data.code !== 0) {
        throw new Error(data.message || '请求失败');
      }
      return data.data;
    },
    error => {
      const message =
        error.response?.data?.message || error.message || '网络错误';
      throw new Error(message);
    }
  );

  return instance;
};

const api = createAxiosInstance();

// 通用POST请求方法
export const post = async <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.post(url, data, config);
};

// 通用GET请求方法
export const get = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  return api.get(url, config);
};

export default api;
