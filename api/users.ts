import { LoginRequest, LoginResponse, RegisterRequest } from '../types/user';
import { post } from '../utils/request';

/**
 * 获取用户信息
 */
export const getUserInfo = (): Promise<{ username: string }> => {
  return post<{ username: string }>('/v1/users/info');
};
