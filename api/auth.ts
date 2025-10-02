import { LoginRequest, LoginResponse, RegisterRequest } from '../types/user';
import { post } from '../utils/request';

/**
 * 用户登录
 */
export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return post<LoginResponse>('/v1/users/login', data);
};

/**
 * 用户注册
 */
export const register = (data: RegisterRequest): Promise<void> => {
  return post<void>('/v1/users/register', data);
};

/**
 * 用户登出
 */
export const logout = (): Promise<void> => {
  return post<void>('/v1/users/logout');
};
